"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductQuerySchema = exports.ProductParamsSchema = exports.ProductVariantParamsSchema = exports.AdjustStockBodySchema = exports.CreateVariantBodySchema = exports.CreateProductBodySchema = exports.ProductBaseSchema = void 0;
const zod_1 = require("zod");
const registry_1 = require("../openapi/registry");
// Reusable basic schemas
const IdParamSchema = zod_1.z.object({
    id: zod_1.z.string().cuid(),
});
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
exports.CreateProductBodySchema = registry_1.openAPIRegistry.register("CreateProductBody", zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required"),
    description: zod_1.z.string().optional(),
    type: zod_1.z.enum(["UNSTITCHED", "THREE_PC", "TWO_PC", "SEPARATE"]),
    variants: zod_1.z.array(zod_1.z.object({
        color: zod_1.z.string().min(1, "Color is required"),
        sku: zod_1.z.string().optional(),
        salePrice: zod_1.z.number().positive("Sale price must be positive"),
        purchasePrice: zod_1.z.number().positive().optional(),
    })).optional(),
}));
exports.CreateVariantBodySchema = registry_1.openAPIRegistry.register("CreateVariantBody", zod_1.z.object({
    color: zod_1.z.string().min(1, "Color is required"),
    sku: zod_1.z.string().optional(),
    salePrice: zod_1.z.number().positive("Sale price must be positive"),
    purchasePrice: zod_1.z.number().positive().optional(),
}));
exports.AdjustStockBodySchema = registry_1.openAPIRegistry.register("AdjustStockBody", zod_1.z.object({
    type: zod_1.z.enum(["IN", "OUT", "ADJUSTMENT"]),
    quantity: zod_1.z.number().int().positive("Quantity must be a positive integer"),
    notes: zod_1.z.string().optional(),
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