import { z } from "zod";
import { openAPIRegistry } from "../../core/openapi/registry";

openAPIRegistry.register(
  "ClothingType",
  z.enum(["UNSTITCHED", "THREE_PC", "TWO_PC", "SEPARATE"]),
);

export const ProductBaseSchema = openAPIRegistry.register(
  "ProductBase",
  z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().nullable(),
    type: z.enum(["UNSTITCHED", "THREE_PC", "TWO_PC", "SEPARATE"]),
    isActive: z.boolean(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  }),
);

export const ProductImageSchema = openAPIRegistry.register(
  "ProductImage",
  z.object({
    id: z.string(),
    url: z.string(),
    order: z.number().int(),
  }),
);

export const ProductVariantSchema = openAPIRegistry.register(
  "ProductVariant",
  z.object({
    id: z.string(),
    productId: z.string(),
    sku: z.string().nullable(),
    salePrice: z.coerce.number(),
    purchasePrice: z.coerce.number().nullable(),
    stockQty: z.number().int(),
    sortOrder: z.number().int(),
    images: z.array(ProductImageSchema).optional(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  }),
);

export const ProductWithVariantsSchema = openAPIRegistry.register(
  "ProductWithVariants",
  ProductBaseSchema.extend({
    variants: z.array(ProductVariantSchema),
  }),
);

export const ProductListResponseSchema = openAPIRegistry.register(
  "ProductListResponse",
  z.object({
    items: z.array(ProductWithVariantsSchema),
    total: z.number().int().min(0),
  }),
);

export const CreateProductBodySchema = openAPIRegistry.register(
  "CreateProductBody",
  z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    type: z.enum(["UNSTITCHED", "THREE_PC", "TWO_PC", "SEPARATE"]),
    variants: z
      .array(
        z.object({
          sku: z.string().optional(),
          salePrice: z.number().positive("Sale price must be positive"),
          purchasePrice: z.number().positive().optional(),
        }),
      )
      .optional(),
  }),
);

export const CreateVariantBodySchema = openAPIRegistry.register(
  "CreateVariantBody",
  z.object({
    sku: z.string().optional(),
    salePrice: z.number().positive("Sale price must be positive"),
    purchasePrice: z.number().positive().optional(),
  }),
);

export const AdjustStockBodySchema = openAPIRegistry.register(
  "AdjustStockBody",
  z.object({
    type: z.enum(["IN", "OUT", "ADJUSTMENT"]),
    quantity: z.number().int().positive("Quantity must be a positive integer"),
    notes: z.string().optional(),
  }),
);

export const UpdateProductBodySchema = openAPIRegistry.register(
  "UpdateProductBody",
  z.object({
    name: z.string().min(1, "Name cannot be empty").optional(),
    description: z.string().optional(),
    type: z.enum(["UNSTITCHED", "THREE_PC", "TWO_PC", "SEPARATE"]).optional(),
    isActive: z.boolean().optional(),
  }),
);

/** Full product save (create/update) sent as multipart `data` JSON + `variants[i]` files. */
export const SaveProductVariantInputSchema = z.object({
  id: z.string().optional(),
  sku: z.string().optional(),
  salePrice: z.number().nonnegative(),
  purchasePrice: z.number().nonnegative().optional().nullable(),
  /** Image row ids to keep for an existing variant; others are removed. */
  existingImageIds: z.array(z.string()).optional(),
});

export const SaveProductBodySchema = openAPIRegistry.register(
  "SaveProductBody",
  z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    type: z.enum(["UNSTITCHED", "THREE_PC", "TWO_PC", "SEPARATE"]),
    variants: z.array(SaveProductVariantInputSchema).min(1, "At least one variant is required"),
  }),
);

export type SaveProductBody = z.infer<typeof SaveProductBodySchema>;

export const ProductVariantParamsSchema = openAPIRegistry.register(
  "ProductVariantParams",
  z.object({
    variantId: z.string(),
  }),
);

export const ProductParamsSchema = openAPIRegistry.register(
  "ProductParams",
  z.object({
    productId: z.string(),
  }),
);

export const ProductQuerySchema = openAPIRegistry.register(
  "ProductQuery",
  z.object({
    skip: z.coerce.number().int().min(0).optional().default(0),
    take: z.coerce.number().int().min(1).max(100).optional().default(20),
    isActive: z.enum(["true", "false"]).optional(),
  }),
);
