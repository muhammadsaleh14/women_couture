import { z } from "zod";
import { openAPIRegistry } from "../openapi/registry";

// Reusable basic schemas
const IdParamSchema = z.object({
  id: z.string().cuid(),
});

openAPIRegistry.register(
  "ClothingType",
  z.enum(["UNSTITCHED", "THREE_PC", "TWO_PC", "SEPARATE"])
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
  })
);

export const CreateProductBodySchema = openAPIRegistry.register(
  "CreateProductBody",
  z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    type: z.enum(["UNSTITCHED", "THREE_PC", "TWO_PC", "SEPARATE"]),
  })
);

export const CreateVariantBodySchema = openAPIRegistry.register(
  "CreateVariantBody",
  z.object({
    color: z.string().min(1, "Color is required"),
    sku: z.string().optional(),
    salePrice: z.number().positive("Sale price must be positive"),
    purchasePrice: z.number().positive().optional(),
  })
);

export const AdjustStockBodySchema = openAPIRegistry.register(
  "AdjustStockBody",
  z.object({
    type: z.enum(["IN", "OUT", "ADJUSTMENT"]),
    quantity: z.number().int().positive("Quantity must be a positive integer"),
    notes: z.string().optional(),
  })
);

export const ProductVariantParamsSchema = openAPIRegistry.register(
  "ProductVariantParams",
  z.object({
    variantId: z.string(),
  })
);

export const ProductParamsSchema = openAPIRegistry.register(
  "ProductParams",
  z.object({
    productId: z.string(),
  })
);
