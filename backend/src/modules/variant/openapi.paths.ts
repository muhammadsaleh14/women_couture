import { z } from "../../zod-openapi";
import { openAPIRegistry } from "../../core/openapi/registry";
import {
  CreateVariantBodySchema,
  ProductVariantSchema,
} from "../product/product.schema";
import { UpdateVariantBodySchema } from "./variant.schema";

openAPIRegistry.registerPath({
  method: "patch",
  path: "/admin/variants/{variantId}",
  summary: "Update variant details",
  tags: ["Variants"],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      variantId: z.string(),
    }),
    body: {
      content: {
        "application/json": {
          schema: UpdateVariantBodySchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Variant updated",
      content: {
        "application/json": {
          schema: ProductVariantSchema,
        },
      },
    },
    404: {
      description: "Variant not found",
    },
  },
});

openAPIRegistry.registerPath({
  method: "delete",
  path: "/admin/variants/{variantId}",
  summary: "Delete a variant",
  tags: ["Variants"],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      variantId: z.string(),
    }),
  },
  responses: {
    204: {
      description: "Variant deleted successfully",
    },
    404: {
      description: "Variant not found",
    },
  },
});

openAPIRegistry.registerPath({
  method: "post",
  path: "/admin/variants/{variantId}/stock",
  summary: "Adjust variant stock",
  tags: ["Variants"],
  request: {
    params: z.object({
      variantId: z.string(),
    }),
    body: {
      content: {
        "application/json": {
          schema: z.object({
            type: z.enum(["IN", "OUT", "ADJUSTMENT"]),
            quantity: z.number().int().positive(),
            notes: z.string().optional(),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: "Stock adjusted successfully",
    },
  },
});

openAPIRegistry.registerPath({
  method: "post",
  path: "/admin/variants/{variantId}/images",
  summary: "Add an image to a variant",
  tags: ["Variants"],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      variantId: z.string(),
    }),
    body: {
      content: {
        "multipart/form-data": {
          schema: z.object({
            image: z.any().openapi({ type: "string", format: "binary" }),
          }),
        },
      },
    },
  },
  responses: {
    201: {
      description: "Image uploaded successfully",
      content: {
        "application/json": {
          schema: z.object({
            id: z.string(),
            url: z.string(),
            order: z.number(),
          }),
        },
      },
    },
  },
});

openAPIRegistry.registerPath({
  method: "delete",
  path: "/admin/variants/images/{imageId}",
  summary: "Delete a variant image",
  tags: ["Variants"],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      imageId: z.string(),
    }),
  },
  responses: {
    204: {
      description: "Image deleted successfully",
    },
    404: {
      description: "Image not found",
    },
  },
});
