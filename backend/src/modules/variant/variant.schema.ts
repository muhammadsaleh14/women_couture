import { z } from "zod";
import { openAPIRegistry } from "../../core/openapi/registry";

export const UpdateVariantBodySchema = openAPIRegistry.register(
  "UpdateVariantBody",
  z.object({
    color: z.string().min(1, "Color cannot be empty").optional(),
    sku: z.string().optional(),
    salePrice: z.number().positive("Sale price must be positive").optional(),
    purchasePrice: z.number().positive().optional(),
  }),
);
