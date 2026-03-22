import { z } from "../../zod-openapi";
import { openAPIRegistry } from "../registry";
import {
  CreateProductBodySchema,
  CreateVariantBodySchema,
  AdjustStockBodySchema,
  ProductBaseSchema,
} from "../../schemas/product.schema";

openAPIRegistry.registerPath({
  method: "get",
  path: "/admin/products",
  summary: "List all products",
  tags: ["Products"],
  request: {
    query: z.object({
      skip: z.coerce.number().optional().openapi({ description: "Number of records to skip" }),
      take: z.coerce.number().optional().openapi({ description: "Number of records to return" }),
      isActive: z.enum(['true', 'false']).optional().openapi({ description: "Filter by active state" }),
    }),
  },
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": {
          schema: ProductBaseSchema.array(),
        },
      },
    },
  },
});

openAPIRegistry.registerPath({
  method: "post",
  path: "/admin/products",
  summary: "Create a new base product",
  tags: ["Products"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: CreateProductBodySchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: "Created",
      content: {
        "application/json": {
          schema: ProductBaseSchema,
        },
      },
    },
  },
});

openAPIRegistry.registerPath({
  method: "post",
  path: "/admin/products/{productId}/variants",
  summary: "Add a variant to a product",
  tags: ["Products"],
  request: {
    params: z.object({
      productId: z.string(),
    }),
    body: {
      content: {
        "application/json": {
          schema: CreateVariantBodySchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: "Created",
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
          schema: AdjustStockBodySchema,
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
