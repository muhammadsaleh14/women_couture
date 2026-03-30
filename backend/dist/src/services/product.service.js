"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProduct = createProduct;
exports.getAllProducts = getAllProducts;
exports.createVariant = createVariant;
exports.adjustStock = adjustStock;
exports.addImage = addImage;
const prisma_1 = require("../lib/prisma");
async function createProduct(data) {
    return prisma_1.prisma.product.create({
        data: {
            name: data.name,
            description: data.description,
            type: data.type,
            isActive: true,
            variants: data.variants ? {
                create: data.variants.map((v) => ({
                    color: v.color,
                    sku: v.sku,
                    salePrice: v.salePrice,
                    purchasePrice: v.purchasePrice,
                    stockQty: 0,
                })),
            } : undefined,
        },
        include: {
            variants: true,
        },
    });
}
async function getAllProducts(query) {
    const where = query.isActive !== undefined ? { isActive: query.isActive } : {};
    return prisma_1.prisma.product.findMany({
        where,
        skip: query.skip,
        take: query.take,
        include: {
            variants: {
                include: {
                    images: {
                        orderBy: { order: "asc" }
                    }
                }
            }
        },
        orderBy: { createdAt: "desc" },
    });
}
async function createVariant(productId, data) {
    // Ensure product exists
    const product = await prisma_1.prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
        throw new Error("Product not found");
    }
    // Prevent duplicate colors for the same product
    const existing = await prisma_1.prisma.productVariant.findUnique({
        where: { productId_color: { productId, color: data.color } },
    });
    if (existing) {
        throw new Error(`Variant with color '${data.color}' already exists for this product.`);
    }
    return prisma_1.prisma.productVariant.create({
        data: {
            productId,
            color: data.color,
            sku: data.sku,
            salePrice: data.salePrice,
            purchasePrice: data.purchasePrice,
            stockQty: 0,
        },
    });
}
async function adjustStock(variantId, type, quantity, notes) {
    // Use a Prisma transaction to ensure StockMove insertion and stockQty update happen atomically
    return prisma_1.prisma.$transaction(async (tx) => {
        const variant = await tx.productVariant.findUnique({ where: { id: variantId } });
        if (!variant) {
            throw new Error("Variant not found");
        }
        // Determine the actual delta amount
        let stockDelta = 0;
        if (type === "IN") {
            stockDelta = quantity;
        }
        else if (type === "OUT") {
            stockDelta = -quantity;
        }
        else if (type === "ADJUSTMENT") {
            // Assuming 'ADJUSTMENT' with a positive value means replacing/setting exact, 
            // or just adjusting wildly. Let's assume ADJUSTMENT means replacing current stock.
            // E.g., if quantity = 5, we set stock to 5. 
            // Delta = new quantity - current quantity.
            stockDelta = quantity - variant.stockQty;
        }
        // In a strict financial system, OUT shouldn't go below 0 unless backordered. 
        // We'll allow it for now or check.
        if (variant.stockQty + stockDelta < 0) {
            throw new Error("Insufficient stock for this OUT operation.");
        }
        // 1. Create StockMove
        await tx.stockMove.create({
            data: {
                productVariantId: variantId,
                type,
                quantity: Math.abs(quantity), // Keep quantity positive in history
                notes,
            },
        });
        // 2. Update stockQty cache
        const updatedVariant = await tx.productVariant.update({
            where: { id: variantId },
            data: {
                stockQty: {
                    increment: stockDelta,
                },
            },
        });
        return updatedVariant;
    });
}
async function addImage(variantId, url, order = 0) {
    return prisma_1.prisma.productImage.create({
        data: {
            productVariantId: variantId,
            url,
            order,
        },
    });
}
//# sourceMappingURL=product.service.js.map