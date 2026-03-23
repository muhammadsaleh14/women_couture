import { z } from "../../zod-openapi";
import { openAPIRegistry } from "../registry";
import {
  CreateProductBodySchema,
  CreateVariantBodySchema,
  AdjustStockBodySchema,
  ProductBaseSchema,
  ProductWithVariantsSchema,
  UpdateProductBodySchema,
  ProductParamsSchema,
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
          schema: ProductWithVariantsSchema.array(),
        },
      },
    },
  },
});

openAPIRegistry.registerPath({
  method: "get",
  path: "/admin/products/{productId}",
  summary: "Get a product by ID",
  tags: ["Products"],
  security: [{ bearerAuth: [] }],
  request: {
    params: ProductParamsSchema,
  },
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": {
          schema: ProductWithVariantsSchema,
        },
      },
    },
    404: {
      description: "Product not found",
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
          schema: ProductWithVariantsSchema,
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

openAPIRegistry.registerPath({
  method: "patch",
  path: "/admin/products/{productId}",
  tags: ["Products"],
  summary: "Update product details or status",
  security: [{ bearerAuth: [] }],
  request: {
    params: ProductParamsSchema,
    body: {
      content: {
        "application/json": {
          schema: UpdateProductBodySchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "OK",
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
          // It returns ProductImage model
          schema: z.object({
            id: z.string(),
            url: z.string(),
            order: z.number()
          })
        }
      }
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
