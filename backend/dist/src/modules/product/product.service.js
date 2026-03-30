"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProduct = createProduct;
exports.getAllProducts = getAllProducts;
exports.getProductById = getProductById;
exports.adjustStock = adjustStock;
exports.updateProduct = updateProduct;
exports.replaceProductFull = replaceProductFull;
const fs = __importStar(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const prisma_1 = require("../../core/database/prisma");
const image_url_1 = require("../../core/utils/image-url");
const variantsBySortOrder = {
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    include: {
        images: {
            orderBy: { order: "asc" },
        },
    },
};
function withImageUrls(product) {
    if (!product.variants)
        return product;
    return {
        ...product,
        variants: product.variants.map((v) => ({
            ...v,
            images: v.images?.map((img) => ({ ...img, url: (0, image_url_1.toImageUrl)(img.url) })),
        })),
    };
}
async function createProduct(data, variantImages) {
    const product = await prisma_1.prisma.product.create({
        data: {
            name: data.name,
            description: data.description,
            type: data.type,
            isActive: true,
            variants: data.variants
                ? {
                    create: data.variants.map((v, i) => ({
                        sku: v.sku,
                        salePrice: v.salePrice,
                        purchasePrice: v.purchasePrice,
                        stockQty: 0,
                        sortOrder: i,
                        images: variantImages?.has(i)
                            ? {
                                create: variantImages.get(i).map((url, order) => ({
                                    url,
                                    order,
                                })),
                            }
                            : undefined,
                    })),
                }
                : undefined,
        },
        include: {
            variants: variantsBySortOrder,
        },
    });
    return withImageUrls(product);
}
async function getAllProducts(query) {
    const where = query.isActive !== undefined ? { isActive: query.isActive } : {};
    const [total, products] = await prisma_1.prisma.$transaction([
        prisma_1.prisma.product.count({ where }),
        prisma_1.prisma.product.findMany({
            where,
            skip: query.skip,
            take: query.take,
            include: {
                variants: variantsBySortOrder,
            },
            orderBy: { createdAt: "desc" },
        }),
    ]);
    return { items: products.map(withImageUrls), total };
}
async function getProductById(productId) {
    const product = await prisma_1.prisma.product.findUnique({
        where: { id: productId },
        include: {
            variants: variantsBySortOrder,
        },
    });
    return product ? withImageUrls(product) : null;
}
async function adjustStock(variantId, type, quantity, notes) {
    return prisma_1.prisma.$transaction(async (tx) => {
        const variant = await tx.productVariant.findUnique({ where: { id: variantId } });
        if (!variant) {
            throw new Error("Variant not found");
        }
        let stockDelta = 0;
        if (type === "IN") {
            stockDelta = quantity;
        }
        else if (type === "OUT") {
            stockDelta = -quantity;
        }
        else if (type === "ADJUSTMENT") {
            stockDelta = quantity - variant.stockQty;
        }
        if (variant.stockQty + stockDelta < 0) {
            throw new Error("Insufficient stock for this OUT operation.");
        }
        await tx.stockMove.create({
            data: {
                productVariantId: variantId,
                type,
                quantity: Math.abs(quantity),
                notes,
            },
        });
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
async function updateProduct(productId, data) {
    return prisma_1.prisma.product.update({
        where: { id: productId },
        data,
    });
}
async function unlinkStoredImage(url) {
    if (!url || url.startsWith("http"))
        return;
    const filePath = path_1.default.join(process.cwd(), url);
    await fs.unlink(filePath).catch(() => { });
}
/**
 * Replace product + variants + images in one transaction (multipart full save).
 * `variantFiles` maps variant index in `body.variants` to uploaded file paths (disk URLs).
 */
async function replaceProductFull(productId, body, variantFiles) {
    const existingProduct = await prisma_1.prisma.product.findUnique({ where: { id: productId } });
    if (!existingProduct) {
        throw new Error("Record to update not found");
    }
    await prisma_1.prisma.$transaction(async (tx) => {
        await tx.product.update({
            where: { id: productId },
            data: {
                name: body.name,
                description: body.description ?? null,
                type: body.type,
            },
        });
        const existingVariants = await tx.productVariant.findMany({
            where: { productId },
            include: { images: true },
        });
        const payloadIds = new Set(body.variants.map((v) => v.id).filter((id) => !!id));
        for (const ev of existingVariants) {
            if (!payloadIds.has(ev.id)) {
                for (const img of ev.images) {
                    await unlinkStoredImage(img.url);
                }
                await tx.productVariant.delete({ where: { id: ev.id } });
            }
        }
        for (let i = 0; i < body.variants.length; i++) {
            const v = body.variants[i];
            const newUrls = variantFiles.get(i) ?? [];
            if (v.id) {
                await tx.productVariant.update({
                    where: { id: v.id },
                    data: {
                        sku: v.sku ?? null,
                        salePrice: v.salePrice,
                        purchasePrice: v.purchasePrice ?? null,
                        sortOrder: i,
                    },
                });
                const keep = new Set(v.existingImageIds ?? []);
                const imgs = await tx.productImage.findMany({
                    where: { productVariantId: v.id },
                });
                for (const img of imgs) {
                    if (!keep.has(img.id)) {
                        await unlinkStoredImage(img.url);
                        await tx.productImage.delete({ where: { id: img.id } });
                    }
                }
                const agg = await tx.productImage.aggregate({
                    where: { productVariantId: v.id },
                    _max: { order: true },
                });
                let nextOrder = (agg._max.order ?? -1) + 1;
                for (const url of newUrls) {
                    await tx.productImage.create({
                        data: { productVariantId: v.id, url, order: nextOrder++ },
                    });
                }
            }
            else {
                await tx.productVariant.create({
                    data: {
                        productId,
                        sku: v.sku ?? null,
                        salePrice: v.salePrice,
                        purchasePrice: v.purchasePrice ?? null,
                        stockQty: 0,
                        sortOrder: i,
                        images: newUrls.length > 0
                            ? {
                                create: newUrls.map((url, order) => ({ url, order })),
                            }
                            : undefined,
                    },
                });
            }
        }
    });
    const full = await getProductById(productId);
    if (!full)
        throw new Error("Record to update not found");
    return full;
}
//# sourceMappingURL=product.service.js.map