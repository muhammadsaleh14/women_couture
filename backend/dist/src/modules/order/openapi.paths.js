"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_openapi_1 = require("../../zod-openapi");
const registry_1 = require("../../core/openapi/registry");
const order_schema_1 = require("./order.schema");
registry_1.openAPIRegistry.registerPath({
    method: "post",
    path: "/orders",
    summary: "Place an order (guest or authenticated customer)",
    tags: ["Orders"],
    request: {
        body: {
            content: {
                "application/json": {
                    schema: order_schema_1.CreateOrderBodySchema,
                },
            },
        },
    },
    responses: {
        201: {
            description: "Created",
            content: {
                "application/json": {
                    schema: order_schema_1.OrderPublicSchema,
                },
            },
        },
        400: {
            description: "Validation or stock error",
        },
    },
});
registry_1.openAPIRegistry.registerPath({
    method: "get",
    path: "/orders",
    summary: "List orders (admin)",
    tags: ["Orders"],
    security: [{ bearerAuth: [] }],
    request: {
        query: zod_openapi_1.z.object({
            skip: zod_openapi_1.z.coerce.number().int().min(0).optional(),
            take: zod_openapi_1.z.coerce.number().int().min(1).max(100).optional(),
        }),
    },
    responses: {
        200: {
            description: "OK",
            content: {
                "application/json": {
                    schema: order_schema_1.OrderPublicSchema.array(),
                },
            },
        },
    },
});
registry_1.openAPIRegistry.registerPath({
    method: "get",
    path: "/orders/{orderId}",
    summary: "Get order by id (admin)",
    tags: ["Orders"],
    security: [{ bearerAuth: [] }],
    request: {
        params: zod_openapi_1.z.object({ orderId: zod_openapi_1.z.string() }),
    },
    responses: {
        200: {
            description: "OK",
            content: {
                "application/json": {
                    schema: order_schema_1.OrderPublicSchema,
                },
            },
        },
        404: {
            description: "Not found",
        },
    },
});
registry_1.openAPIRegistry.registerPath({
    method: "patch",
    path: "/orders/{orderId}",
    summary: "Update order status (admin)",
    tags: ["Orders"],
    security: [{ bearerAuth: [] }],
    request: {
        params: zod_openapi_1.z.object({ orderId: zod_openapi_1.z.string() }),
        body: {
            content: {
                "application/json": {
                    schema: order_schema_1.UpdateOrderBodySchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: "OK",
            content: {
                "application/json": {
                    schema: order_schema_1.OrderPublicSchema,
                },
            },
        },
        404: {
            description: "Not found",
        },
    },
});
//# sourceMappingURL=openapi.paths.js.map