"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_openapi_1 = require("../../zod-openapi");
const registry_1 = require("../../core/openapi/registry");
const product_schema_1 = require("../product/product.schema");
const variant_schema_1 = require("./variant.schema");
registry_1.openAPIRegistry.registerPath({
    method: "get",
    path: "/variants/{variantId}/stock-moves",
    summary: "List stock moves for a variant",
    tags: ["Variants"],
    security: [{ bearerAuth: [] }],
    request: {
        params: zod_openapi_1.z.object({
            variantId: zod_openapi_1.z.string(),
        }),
    },
    responses: {
        200: {
            description: "OK",
            content: {
                "application/json": {
                    schema: product_schema_1.VariantStockMovesResponseSchema,
                },
            },
        },
        404: {
            description: "Variant not found",
        },
    },
});
registry_1.openAPIRegistry.registerPath({
    method: "patch",
    path: "/variants/{variantId}",
    summary: "Update variant details",
    tags: ["Variants"],
    security: [{ bearerAuth: [] }],
    request: {
        params: zod_openapi_1.z.object({
            variantId: zod_openapi_1.z.string(),
        }),
        body: {
            content: {
                "application/json": {
                    schema: variant_schema_1.UpdateVariantBodySchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: "Variant updated",
            content: {
                "application/json": {
                    schema: product_schema_1.ProductVariantSchema,
                },
            },
        },
        404: {
            description: "Variant not found",
        },
    },
});
registry_1.openAPIRegistry.registerPath({
    method: "delete",
    path: "/variants/{variantId}",
    summary: "Delete a variant",
    tags: ["Variants"],
    security: [{ bearerAuth: [] }],
    request: {
        params: zod_openapi_1.z.object({
            variantId: zod_openapi_1.z.string(),
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
registry_1.openAPIRegistry.registerPath({
    method: "post",
    path: "/variants/{variantId}/stock",
    summary: "Adjust variant stock",
    tags: ["Variants"],
    request: {
        params: zod_openapi_1.z.object({
            variantId: zod_openapi_1.z.string(),
        }),
        body: {
            content: {
                "application/json": {
                    schema: zod_openapi_1.z.object({
                        type: zod_openapi_1.z.enum(["IN", "OUT", "ADJUSTMENT"]),
                        quantity: zod_openapi_1.z.number().int().positive(),
                        notes: zod_openapi_1.z.string().optional(),
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
registry_1.openAPIRegistry.registerPath({
    method: "post",
    path: "/variants/{variantId}/images",
    summary: "Add an image to a variant",
    tags: ["Variants"],
    security: [{ bearerAuth: [] }],
    request: {
        params: zod_openapi_1.z.object({
            variantId: zod_openapi_1.z.string(),
        }),
        body: {
            content: {
                "multipart/form-data": {
                    schema: zod_openapi_1.z.object({
                        image: zod_openapi_1.z.any().openapi({ type: "string", format: "binary" }),
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
                    schema: zod_openapi_1.z.object({
                        id: zod_openapi_1.z.string(),
                        url: zod_openapi_1.z.string(),
                        order: zod_openapi_1.z.number(),
                    }),
                },
            },
        },
    },
});
registry_1.openAPIRegistry.registerPath({
    method: "delete",
    path: "/variants/images/{imageId}",
    summary: "Delete a variant image",
    tags: ["Variants"],
    security: [{ bearerAuth: [] }],
    request: {
        params: zod_openapi_1.z.object({
            imageId: zod_openapi_1.z.string(),
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
//# sourceMappingURL=openapi.paths.js.map