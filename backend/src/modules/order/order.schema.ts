import { z } from "zod";
import { openAPIRegistry } from "../../core/openapi/registry";

openAPIRegistry.register(
  "OrderPayment",
  z.enum(["cod", "online"]),
);

openAPIRegistry.register(
  "OrderStatusPublic",
  z.enum(["pending", "shipped", "delivered"]),
);

export const OrderLinePublicSchema = openAPIRegistry.register(
  "OrderLinePublic",
  z.object({
    id: z.string(),
    productName: z.string(),
    type: z.string(),
    sku: z.string().nullable(),
    qty: z.number().int(),
    unitPrice: z.number(),
    lineTotal: z.number(),
  }),
);

export const OrderPublicSchema = openAPIRegistry.register(
  "OrderPublic",
  z.object({
    id: z.string(),
    orderNumber: z.number().int(),
    placedAt: z.string().datetime(),
    customerName: z.string(),
    phone: z.string(),
    shippingAddress: z.string(),
    city: z.string(),
    payment: z.enum(["cod", "online"]),
    status: z.enum(["pending", "shipped", "delivered"]),
    subtotal: z.number(),
    total: z.number(),
    lines: z.array(OrderLinePublicSchema),
  }),
);

const CreateOrderBodySchemaBase = z.object({
    customerName: z.string().min(1),
    phone: z.string().min(1),
    shippingAddress: z.string().min(1),
    city: z.string().min(1),
    payment: z.enum(["cod", "online"]),
    items: z
      .array(
        z.object({
          variantId: z.string().min(1),
          qty: z.number().int().positive(),
        }),
      )
      .min(1),
});

export const CreateOrderBodySchema = openAPIRegistry.register(
  "CreateOrderBody",
  CreateOrderBodySchemaBase,
);

export type CreateOrderBody = z.infer<typeof CreateOrderBodySchemaBase>;

const UpdateOrderBodySchemaBase = z.object({
  status: z.enum(["pending", "shipped", "delivered"]),
});

export const UpdateOrderBodySchema = openAPIRegistry.register(
  "UpdateOrderBody",
  UpdateOrderBodySchemaBase,
);

export type UpdateOrderBody = z.infer<typeof UpdateOrderBodySchemaBase>;

export const OrderParamsSchema = z.object({
  orderId: z.string(),
});

export const ListOrdersQuerySchema = z.object({
  skip: z.coerce.number().int().min(0).optional(),
  take: z.coerce.number().int().min(1).max(100).optional(),
});
