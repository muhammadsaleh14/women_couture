"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_openapi_1 = require("../../zod-openapi");
const registry_1 = require("../../core/openapi/registry");
const product_schema_1 = require("./product.schema");
registry_1.openAPIRegistry.registerPath({
    method: "get",
    path: "/products",
    summary: "List all products",
    tags: ["Products"],
    request: {
        query: zod_openapi_1.z.object({
            skip: zod_openapi_1.z.coerce.number().optional().openapi({ description: "Number of records to skip" }),
            take: zod_openapi_1.z.coerce.number().optional().openapi({ description: "Number of records to return" }),
            isActive: zod_openapi_1.z
                .enum(["true", "false"])
                .optional()
                .openapi({ description: "Filter by active state" }),
        }),
    },
    responses: {
        200: {
            description: "OK",
            content: {
                "application/json": {
                    schema: product_schema_1.ProductListResponseSchema,
                },
            },
        },
    },
});
registry_1.openAPIRegistry.registerPath({
    method: "get",
    path: "/products/{productId}",
    summary: "Get a product by ID",
    tags: ["Products"],
    security: [{ bearerAuth: [] }],
    request: {
        params: product_schema_1.ProductParamsSchema,
    },
    responses: {
        200: {
            description: "OK",
            content: {
                "application/json": {
                    schema: product_schema_1.ProductWithVariantsSchema,
                },
            },
        },
        404: {
            description: "Product not found",
        },
    },
});
registry_1.openAPIRegistry.registerPath({
    method: "post",
    path: "/products",
    summary: "Create a new base product",
    tags: ["Products"],
    request: {
        body: {
            content: {
                "application/json": {
                    schema: product_schema_1.CreateProductBodySchema,
                },
            },
        },
    },
    responses: {
        201: {
            description: "Created",
            content: {
                "application/json": {
                    schema: product_schema_1.ProductWithVariantsSchema,
                },
            },
        },
    },
});
registry_1.openAPIRegistry.registerPath({
    method: "post",
    path: "/products/{productId}/variants",
    summary: "Add a variant to a product",
    tags: ["Products"],
    request: {
        params: zod_openapi_1.z.object({
            productId: zod_openapi_1.z.string(),
        }),
        body: {
            content: {
                "application/json": {
                    schema: product_schema_1.CreateVariantBodySchema,
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
registry_1.openAPIRegistry.registerPath({
    method: "patch",
    path: "/products/{productId}",
    tags: ["Products"],
    summary: "Update product details or status",
    security: [{ bearerAuth: [] }],
    request: {
        params: product_schema_1.ProductParamsSchema,
        body: {
            content: {
                "application/json": {
                    schema: product_schema_1.UpdateProductBodySchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: "OK",
            content: {
                "application/json": {
                    schema: product_schema_1.ProductBaseSchema,
                },
            },
        },
    },
});
//# sourceMappingURL=openapi.paths.js.map