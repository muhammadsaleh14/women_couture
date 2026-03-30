"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const registry_1 = require("../registry");
const product_schema_1 = require("../../schemas/product.schema");
registry_1.openAPIRegistry.registerPath({
    method: "get",
    path: "/api/v1/admin/products",
    summary: "List all products",
    tags: ["Products"],
    request: {
        query: {
            skip: { type: "number", description: "Number of records to skip" },
            take: { type: "number", description: "Number of records to return" },
            isActive: { type: "boolean", description: "Filter by active state" },
        },
    },
    responses: {
        200: {
            description: "OK",
            content: {
                "application/json": {
                    schema: product_schema_1.ProductBaseSchema.array(),
                },
            },
        },
    },
});
registry_1.openAPIRegistry.registerPath({
    method: "post",
    path: "/api/v1/admin/products",
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
                    schema: product_schema_1.ProductBaseSchema,
                },
            },
        },
    },
});
registry_1.openAPIRegistry.registerPath({
    method: "post",
    path: "/api/v1/admin/products/{productId}/variants",
    summary: "Add a variant to a product",
    tags: ["Products"],
    request: {
        params: {
            productId: { type: "string" },
        },
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
    method: "post",
    path: "/api/v1/admin/variants/{variantId}/stock",
    summary: "Adjust variant stock",
    tags: ["Variants"],
    request: {
        params: {
            variantId: { type: "string" },
        },
        body: {
            content: {
                "application/json": {
                    schema: product_schema_1.AdjustStockBodySchema,
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
//# sourceMappingURL=product.paths.js.map