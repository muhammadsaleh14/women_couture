"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListNotificationsQuerySchema = exports.NotificationParamsSchema = exports.NotificationPublicSchema = void 0;
const zod_1 = require("zod");
const registry_1 = require("../../core/openapi/registry");
registry_1.openAPIRegistry.register("NotificationTypePublic", zod_1.z.enum(["ORDER_PLACED"]));
exports.NotificationPublicSchema = registry_1.openAPIRegistry.register("NotificationPublic", zod_1.z.object({
    id: zod_1.z.string(),
    type: zod_1.z.enum(["ORDER_PLACED"]),
    title: zod_1.z.string(),
    body: zod_1.z.string().nullable(),
    orderId: zod_1.z.string().nullable(),
    createdAt: zod_1.z.string().datetime(),
    read: zod_1.z.boolean(),
}));
exports.NotificationParamsSchema = zod_1.z.object({
    notificationId: zod_1.z.string(),
});
exports.ListNotificationsQuerySchema = zod_1.z.object({
    skip: zod_1.z.coerce.number().int().min(0).optional(),
    take: zod_1.z.coerce.number().int().min(1).max(100).optional(),
});
//# sourceMappingURL=notification.schema.js.map