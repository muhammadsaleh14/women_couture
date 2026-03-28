import { z } from "zod";
import { openAPIRegistry } from "../../core/openapi/registry";

openAPIRegistry.register(
  "NotificationTypePublic",
  z.enum(["ORDER_PLACED"]),
);

export const NotificationPublicSchema = openAPIRegistry.register(
  "NotificationPublic",
  z.object({
    id: z.string(),
    type: z.enum(["ORDER_PLACED"]),
    title: z.string(),
    body: z.string().nullable(),
    orderId: z.string().nullable(),
    createdAt: z.string().datetime(),
    read: z.boolean(),
  }),
);

export const NotificationParamsSchema = z.object({
  notificationId: z.string(),
});

export const ListNotificationsQuerySchema = z.object({
  skip: z.coerce.number().int().min(0).optional(),
  take: z.coerce.number().int().min(1).max(100).optional(),
});
