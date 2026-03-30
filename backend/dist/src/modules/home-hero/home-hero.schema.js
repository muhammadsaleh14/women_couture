"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeHeroSlideParamsSchema = exports.ReorderHomeHeroSlidesBodySchema = exports.UpdateHomeHeroSlideBodySchema = exports.CreateHomeHeroSlideBodySchema = exports.HomeHeroSlideRecordSchema = exports.HomeHeroSlideResolvedSchema = void 0;
const zod_1 = require("zod");
const registry_1 = require("../../core/openapi/registry");
registry_1.openAPIRegistry.register("HomeHeroTheme", zod_1.z.enum(["LIGHT", "DARK"]));
exports.HomeHeroSlideResolvedSchema = registry_1.openAPIRegistry.register("HomeHeroSlideResolved", zod_1.z.object({
    id: zod_1.z.string(),
    theme: zod_1.z.enum(["LIGHT", "DARK"]),
    usePrimaryHeading: zod_1.z.boolean(),
    eyebrow: zod_1.z.string(),
    title: zod_1.z.string(),
    description: zod_1.z.string().nullable(),
    productId: zod_1.z.string().nullable(),
    variantId: zod_1.z.string().nullable(),
    imageUrl: zod_1.z.string().nullable(),
}));
exports.HomeHeroSlideRecordSchema = registry_1.openAPIRegistry.register("HomeHeroSlideRecord", zod_1.z.object({
    id: zod_1.z.string(),
    sortOrder: zod_1.z.number().int(),
    isActive: zod_1.z.boolean(),
    theme: zod_1.z.enum(["LIGHT", "DARK"]),
    usePrimaryHeading: zod_1.z.boolean(),
    eyebrow: zod_1.z.string().nullable(),
    title: zod_1.z.string().nullable(),
    description: zod_1.z.string().nullable(),
    productVariantId: zod_1.z.string().nullable(),
    createdAt: zod_1.z.string().datetime(),
    updatedAt: zod_1.z.string().datetime(),
}));
const slideWriteBase = zod_1.z.object({
    sortOrder: zod_1.z.number().int().optional(),
    isActive: zod_1.z.boolean().optional(),
    theme: zod_1.z.enum(["LIGHT", "DARK"]),
    usePrimaryHeading: zod_1.z.boolean().optional(),
    eyebrow: zod_1.z.string().optional().nullable(),
    title: zod_1.z.string().optional().nullable(),
    description: zod_1.z.string().optional().nullable(),
    productVariantId: zod_1.z.string().optional().nullable(),
});
exports.CreateHomeHeroSlideBodySchema = registry_1.openAPIRegistry.register("CreateHomeHeroSlideBody", slideWriteBase.superRefine((data, ctx) => {
    const hasVariant = data.productVariantId !== null &&
        data.productVariantId !== undefined &&
        data.productVariantId.trim() !== "";
    if (!hasVariant) {
        const t = data.title?.trim() ?? "";
        if (t.length === 0) {
            ctx.addIssue({
                code: "custom",
                message: "title is required when productVariantId is not set",
                path: ["title"],
            });
        }
    }
}));
exports.UpdateHomeHeroSlideBodySchema = registry_1.openAPIRegistry.register("UpdateHomeHeroSlideBody", slideWriteBase.partial());
exports.ReorderHomeHeroSlidesBodySchema = registry_1.openAPIRegistry.register("ReorderHomeHeroSlidesBody", zod_1.z.object({
    orderedIds: zod_1.z.array(zod_1.z.string()).min(1),
}));
exports.HomeHeroSlideParamsSchema = zod_1.z.object({
    slideId: zod_1.z.string(),
});
//# sourceMappingURL=home-hero.schema.js.map