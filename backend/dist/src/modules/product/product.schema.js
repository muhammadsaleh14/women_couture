"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductQuerySchema = exports.ProductParamsSchema = exports.ProductVariantParamsSchema = exports.SaveProductBodySchema = exports.SaveProductVariantInputSchema = exports.UpdateProductBodySchema = exports.VariantStockMovesResponseSchema = exports.StockMoveRecordSchema = exports.AdjustStockBodySchema = exports.CreateVariantBodySchema = exports.CreateProductBodySchema = exports.ProductListResponseSchema = exports.ProductWithVariantsSchema = exports.ProductVariantSchema = exports.ProductImageSchema = exports.ProductBaseSchema = void 0;
const zod_1 = require("zod");
const registry_1 = require("../../core/openapi/registry");
registry_1.openAPIRegistry.register("ClothingType", zod_1.z.enum(["UNSTITCHED", "THREE_PC", "TWO_PC", "SEPARATE"]));
exports.ProductBaseSchema = registry_1.openAPIRegistry.register("ProductBase", zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    description: zod_1.z.string().nullable(),
    type: zod_1.z.enum(["UNSTITCHED", "THREE_PC", "TWO_PC", "SEPARATE"]),
    isActive: zod_1.z.boolean(),
    createdAt: zod_1.z.string().datetime(),
    updatedAt: zod_1.z.string().datetime(),
}));
exports.ProductImageSchema = registry_1.openAPIRegistry.register("ProductImage", zod_1.z.object({
    id: zod_1.z.string(),
    url: zod_1.z.string(),
    order: zod_1.z.number().int(),
}));
exports.ProductVariantSchema = registry_1.openAPIRegistry.register("ProductVariant", zod_1.z.object({
    id: zod_1.z.string(),
    productId: zod_1.z.string(),
    sku: zod_1.z.string().nullable(),
    salePrice: zod_1.z.coerce.number(),
    purchasePrice: zod_1.z.coerce.number().nullable(),
    stockQty: zod_1.z.number().int(),
    sortOrder: zod_1.z.number().int(),
    images: zod_1.z.array(exports.ProductImageSchema).optional(),
    createdAt: zod_1.z.string().datetime(),
    updatedAt: zod_1.z.string().datetime(),
}));
exports.ProductWithVariantsSchema = registry_1.openAPIRegistry.register("ProductWithVariants", exports.ProductBaseSchema.extend({
    variants: zod_1.z.array(exports.ProductVariantSchema),
}));
exports.ProductListResponseSchema = registry_1.openAPIRegistry.register("ProductListResponse", zod_1.z.object({
    items: zod_1.z.array(exports.ProductWithVariantsSchema),
    total: zod_1.z.number().int().min(0),
}));
exports.CreateProductBodySchema = registry_1.openAPIRegistry.register("CreateProductBody", zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required"),
    description: zod_1.z.string().optional(),
    type: zod_1.z.enum(["UNSTITCHED", "THREE_PC", "TWO_PC", "SEPARATE"]),
    variants: zod_1.z
        .array(zod_1.z.object({
        sku: zod_1.z.string().optional(),
        salePrice: zod_1.z.number().positive("Sale price must be positive"),
        purchasePrice: zod_1.z.number().positive().optional(),
    }))
        .optional(),
}));
exports.CreateVariantBodySchema = registry_1.openAPIRegistry.register("CreateVariantBody", zod_1.z.object({
    sku: zod_1.z.string().optional(),
    salePrice: zod_1.z.number().positive("Sale price must be positive"),
    purchasePrice: zod_1.z.number().positive().optional(),
}));
exports.AdjustStockBodySchema = registry_1.openAPIRegistry.register("AdjustStockBody", zod_1.z.object({
    type: zod_1.z.enum(["IN", "OUT", "ADJUSTMENT"]),
    quantity: zod_1.z.number().int().positive("Quantity must be a positive integer"),
    notes: zod_1.z.string().optional(),
}));
exports.StockMoveRecordSchema = registry_1.openAPIRegistry.register("StockMoveRecord", zod_1.z.object({
    id: zod_1.z.string(),
    productVariantId: zod_1.z.string(),
    type: zod_1.z.enum(["IN", "OUT", "ADJUSTMENT"]),
    quantity: zod_1.z.number().int(),
    notes: zod_1.z.string().nullable(),
    createdAt: zod_1.z.string().datetime(),
}));
exports.VariantStockMovesResponseSchema = registry_1.openAPIRegistry.register("VariantStockMovesResponse", zod_1.z.object({
    variantId: zod_1.z.string(),
    sku: zod_1.z.string().nullable(),
    stockQty: zod_1.z.number().int(),
    productId: zod_1.z.string(),
    productName: zod_1.z.string(),
    moves: zod_1.z.array(exports.StockMoveRecordSchema),
}));
exports.UpdateProductBodySchema = registry_1.openAPIRegistry.register("UpdateProductBody", zod_1.z.object({
    name: zod_1.z.string().min(1, "Name cannot be empty").optional(),
    description: zod_1.z.string().optional(),
    type: zod_1.z.enum(["UNSTITCHED", "THREE_PC", "TWO_PC", "SEPARATE"]).optional(),
    isActive: zod_1.z.boolean().optional(),
}));
/** Full product save (create/update) sent as multipart `data` JSON + `variants[i]` files. */
exports.SaveProductVariantInputSchema = zod_1.z.object({
    id: zod_1.z.string().optional(),
    sku: zod_1.z.string().optional(),
    salePrice: zod_1.z.number().nonnegative(),
    purchasePrice: zod_1.z.number().nonnegative().optional().nullable(),
    /** Image row ids to keep for an existing variant; others are removed. */
    existingImageIds: zod_1.z.array(zod_1.z.string()).optional(),
});
exports.SaveProductBodySchema = registry_1.openAPIRegistry.register("SaveProductBody", zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required"),
    description: zod_1.z.string().optional(),
    type: zod_1.z.enum(["UNSTITCHED", "THREE_PC", "TWO_PC", "SEPARATE"]),
    variants: zod_1.z.array(exports.SaveProductVariantInputSchema).min(1, "At least one variant is required"),
}));
exports.ProductVariantParamsSchema = registry_1.openAPIRegistry.register("ProductVariantParams", zod_1.z.object({
    variantId: zod_1.z.string(),
}));
exports.ProductParamsSchema = registry_1.openAPIRegistry.register("ProductParams", zod_1.z.object({
    productId: zod_1.z.string(),
}));
exports.ProductQuerySchema = registry_1.openAPIRegistry.register("ProductQuery", zod_1.z.object({
    skip: zod_1.z.coerce.number().int().min(0).optional().default(0),
    take: zod_1.z.coerce.number().int().min(1).max(100).optional().default(20),
    isActive: zod_1.z.enum(["true", "false"]).optional(),
}));
//# sourceMappingURL=product.schema.js.map