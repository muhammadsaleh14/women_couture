import { openAPIRegistry } from "../registry";
import {
  CreateProductBodySchema,
  CreateVariantBodySchema,
  AdjustStockBodySchema,
  ProductBaseSchema,
} from "../../schemas/product.schema";

openAPIRegistry.registerPath({
  method: "get",
  path: "/api/v1/admin/products",
  summary: "List all products",
  tags: ["Products"],
  request: {
    query: {
      skip: { type: "number", description: "Number of records to skip" },
      take: { type: "number", description: "Number of records to return" },
      isActive: { type: "boolean", description: "Filter by active state" },
    } as any,
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
  path: "/api/v1/admin/products",
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
  path: "/api/v1/admin/products/{productId}/variants",
  summary: "Add a variant to a product",
  tags: ["Products"],
  request: {
    params: {
      productId: { type: "string" },
    } as any,
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
  path: "/api/v1/admin/variants/{variantId}/stock",
  summary: "Adjust variant stock",
  tags: ["Variants"],
  request: {
    params: {
      variantId: { type: "string" },
    } as any, 
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
