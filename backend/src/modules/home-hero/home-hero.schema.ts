import { z } from "zod";
import { openAPIRegistry } from "../../core/openapi/registry";

openAPIRegistry.register(
  "HomeHeroTheme",
  z.enum(["LIGHT", "DARK"]),
);

export const HomeHeroSlideResolvedSchema = openAPIRegistry.register(
  "HomeHeroSlideResolved",
  z.object({
    id: z.string(),
    theme: z.enum(["LIGHT", "DARK"]),
    usePrimaryHeading: z.boolean(),
    eyebrow: z.string(),
    title: z.string(),
    description: z.string().nullable(),
    productId: z.string().nullable(),
    variantId: z.string().nullable(),
    imageUrl: z.string().nullable(),
  }),
);

export const HomeHeroSlideRecordSchema = openAPIRegistry.register(
  "HomeHeroSlideRecord",
  z.object({
    id: z.string(),
    sortOrder: z.number().int(),
    isActive: z.boolean(),
    theme: z.enum(["LIGHT", "DARK"]),
    usePrimaryHeading: z.boolean(),
    eyebrow: z.string().nullable(),
    title: z.string().nullable(),
    description: z.string().nullable(),
    productVariantId: z.string().nullable(),
    productImageId: z.string().nullable(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  }),
);

const slideWriteBase = z.object({
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
  theme: z.enum(["LIGHT", "DARK"]),
  usePrimaryHeading: z.boolean().optional(),
  eyebrow: z.string().optional().nullable(),
  title: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  productVariantId: z.string().min(1, "productVariantId is required"),
  productImageId: z.string().min(1, "productImageId is required"),
});

export const CreateHomeHeroSlideBodySchema = openAPIRegistry.register(
  "CreateHomeHeroSlideBody",
  slideWriteBase,
);

const slideUpdateBase = z.object({
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
  theme: z.enum(["LIGHT", "DARK"]).optional(),
  usePrimaryHeading: z.boolean().optional(),
  eyebrow: z.string().optional().nullable(),
  title: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  productVariantId: z.string().optional().nullable(),
  productImageId: z.string().optional().nullable(),
});

export const UpdateHomeHeroSlideBodySchema = openAPIRegistry.register(
  "UpdateHomeHeroSlideBody",
  slideUpdateBase,
);

export const ReorderHomeHeroSlidesBodySchema = openAPIRegistry.register(
  "ReorderHomeHeroSlidesBody",
  z.object({
    orderedIds: z.array(z.string()).min(1),
  }),
);

export const HomeHeroSlideParamsSchema = z.object({
  slideId: z.string(),
});
