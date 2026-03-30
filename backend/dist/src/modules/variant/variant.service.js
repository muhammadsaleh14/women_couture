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
exports.createVariant = createVariant;
exports.updateVariant = updateVariant;
exports.listStockMovesForVariant = listStockMovesForVariant;
exports.deleteVariant = deleteVariant;
exports.addImage = addImage;
exports.deleteImage = deleteImage;
const path_1 = __importDefault(require("path"));
const prisma_1 = require("../../core/database/prisma");
async function createVariant(productId, data) {
    const product = await prisma_1.prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
        throw new Error("Product not found");
    }
    const agg = await prisma_1.prisma.productVariant.aggregate({
        where: { productId },
        _max: { sortOrder: true },
    });
    const nextOrder = (agg._max.sortOrder ?? -1) + 1;
    return prisma_1.prisma.productVariant.create({
        data: {
            productId,
            sku: data.sku,
            salePrice: data.salePrice,
            purchasePrice: data.purchasePrice,
            stockQty: 0,
            sortOrder: nextOrder,
        },
        include: {
            images: { orderBy: { order: "asc" } },
        },
    });
}
async function updateVariant(variantId, data) {
    return prisma_1.prisma.productVariant.update({
        where: { id: variantId },
        data,
        include: {
            images: { orderBy: { order: "asc" } },
        },
    });
}
async function listStockMovesForVariant(variantId) {
    const variant = await prisma_1.prisma.productVariant.findUnique({
        where: { id: variantId },
        include: {
            product: { select: { id: true, name: true } },
            stockMoves: { orderBy: { createdAt: "desc" } },
        },
    });
    if (!variant)
        return null;
    return {
        variantId: variant.id,
        sku: variant.sku,
        stockQty: variant.stockQty,
        productId: variant.productId,
        productName: variant.product.name,
        moves: variant.stockMoves.map((m) => ({
            id: m.id,
            productVariantId: m.productVariantId,
            type: m.type,
            quantity: m.quantity,
            notes: m.notes,
            createdAt: m.createdAt.toISOString(),
        })),
    };
}
async function deleteVariant(variantId) {
    const variant = await prisma_1.prisma.productVariant.findUnique({
        where: { id: variantId },
        include: { images: true },
    });
    if (!variant) {
        throw new Error("Variant not found");
    }
    await prisma_1.prisma.productVariant.delete({ where: { id: variantId } });
    const fs = await Promise.resolve().then(() => __importStar(require("fs/promises")));
    for (const img of variant.images) {
        if (img.url && !img.url.startsWith("http")) {
            const filePath = path_1.default.join(process.cwd(), img.url);
            await fs.unlink(filePath).catch(() => { });
        }
    }
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
async function deleteImage(imageId) {
    const image = await prisma_1.prisma.productImage.delete({
        where: { id: imageId },
    });
    if (image.url && !image.url.startsWith("http")) {
        const fs = await Promise.resolve().then(() => __importStar(require("fs/promises")));
        const filePath = path_1.default.join(process.cwd(), image.url);
        await fs.unlink(filePath).catch(() => { });
    }
    return image;
}
//# sourceMappingURL=variant.service.js.map