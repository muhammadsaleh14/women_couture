"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_openapi_1 = require("../../zod-openapi");
const registry_1 = require("../../core/openapi/registry");
const notification_schema_1 = require("./notification.schema");
registry_1.openAPIRegistry.registerPath({
    method: "get",
    path: "/notifications",
    summary: "List admin notifications (newest first)",
    tags: ["Notifications"],
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
                    schema: notification_schema_1.NotificationPublicSchema.array(),
                },
            },
        },
    },
});
registry_1.openAPIRegistry.registerPath({
    method: "patch",
    path: "/notifications/{notificationId}/read",
    summary: "Mark a notification as read for the current admin",
    tags: ["Notifications"],
    security: [{ bearerAuth: [] }],
    request: {
        params: zod_openapi_1.z.object({ notificationId: zod_openapi_1.z.string() }),
    },
    responses: {
        200: {
            description: "OK",
            content: {
                "application/json": {
                    schema: notification_schema_1.NotificationPublicSchema,
                },
            },
        },
        404: {
            description: "Not found",
        },
    },
});
//# sourceMappingURL=openapi.paths.js.map