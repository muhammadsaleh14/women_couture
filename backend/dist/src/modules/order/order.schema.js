"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListOrdersQuerySchema = exports.OrderParamsSchema = exports.UpdateOrderBodySchema = exports.CreateOrderBodySchema = exports.OrderPublicSchema = exports.OrderLinePublicSchema = void 0;
const zod_1 = require("zod");
const registry_1 = require("../../core/openapi/registry");
registry_1.openAPIRegistry.register("OrderPayment", zod_1.z.enum(["cod", "online"]));
registry_1.openAPIRegistry.register("OrderStatusPublic", zod_1.z.enum(["pending", "shipped", "delivered"]));
exports.OrderLinePublicSchema = registry_1.openAPIRegistry.register("OrderLinePublic", zod_1.z.object({
    id: zod_1.z.string(),
    productName: zod_1.z.string(),
    type: zod_1.z.string(),
    sku: zod_1.z.string().nullable(),
    qty: zod_1.z.number().int(),
    unitPrice: zod_1.z.number(),
    lineTotal: zod_1.z.number(),
}));
exports.OrderPublicSchema = registry_1.openAPIRegistry.register("OrderPublic", zod_1.z.object({
    id: zod_1.z.string(),
    orderNumber: zod_1.z.number().int(),
    placedAt: zod_1.z.string().datetime(),
    customerName: zod_1.z.string(),
    phone: zod_1.z.string(),
    shippingAddress: zod_1.z.string(),
    city: zod_1.z.string(),
    payment: zod_1.z.enum(["cod", "online"]),
    status: zod_1.z.enum(["pending", "shipped", "delivered"]),
    subtotal: zod_1.z.number(),
    total: zod_1.z.number(),
    lines: zod_1.z.array(exports.OrderLinePublicSchema),
}));
const CreateOrderBodySchemaBase = zod_1.z.object({
    customerName: zod_1.z.string().min(1),
    phone: zod_1.z.string().min(1),
    shippingAddress: zod_1.z.string().min(1),
    city: zod_1.z.string().min(1),
    payment: zod_1.z.enum(["cod", "online"]),
    items: zod_1.z
        .array(zod_1.z.object({
        variantId: zod_1.z.string().min(1),
        qty: zod_1.z.number().int().positive(),
    }))
        .min(1),
});
exports.CreateOrderBodySchema = registry_1.openAPIRegistry.register("CreateOrderBody", CreateOrderBodySchemaBase);
const UpdateOrderBodySchemaBase = zod_1.z.object({
    status: zod_1.z.enum(["pending", "shipped", "delivered"]),
});
exports.UpdateOrderBodySchema = registry_1.openAPIRegistry.register("UpdateOrderBody", UpdateOrderBodySchemaBase);
exports.OrderParamsSchema = zod_1.z.object({
    orderId: zod_1.z.string(),
});
exports.ListOrdersQuerySchema = zod_1.z.object({
    skip: zod_1.z.coerce.number().int().min(0).optional(),
    take: zod_1.z.coerce.number().int().min(1).max(100).optional(),
});
//# sourceMappingURL=order.schema.js.map