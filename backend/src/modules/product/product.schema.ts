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
    color: z.string(),
    sku: z.string().nullable(),
    salePrice: z.coerce.number(),
    purchasePrice: z.coerce.number().nullable(),
    stockQty: z.number().int(),
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

export const CreateProductBodySchema = openAPIRegistry.register(
  "CreateProductBody",
  z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    type: z.enum(["UNSTITCHED", "THREE_PC", "TWO_PC", "SEPARATE"]),
    variants: z
      .array(
        z.object({
          color: z.string().min(1, "Color is required"),
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
    color: z.string().min(1, "Color is required"),
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
