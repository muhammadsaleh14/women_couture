"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateVariantBodySchema = void 0;
const zod_1 = require("zod");
const registry_1 = require("../../core/openapi/registry");
exports.UpdateVariantBodySchema = registry_1.openAPIRegistry.register("UpdateVariantBody", zod_1.z.object({
    sku: zod_1.z.string().optional(),
    salePrice: zod_1.z.number().positive("Sale price must be positive").optional(),
    purchasePrice: zod_1.z.number().positive().optional(),
}));
//# sourceMappingURL=variant.schema.js.map