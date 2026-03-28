import { z } from "../../zod-openapi";
import { openAPIRegistry } from "../../core/openapi/registry";
import { NotificationPublicSchema } from "./notification.schema";

openAPIRegistry.registerPath({
  method: "get",
  path: "/notifications",
  summary: "List admin notifications (newest first)",
  tags: ["Notifications"],
  security: [{ bearerAuth: [] }],
  request: {
    query: z.object({
      skip: z.coerce.number().int().min(0).optional(),
      take: z.coerce.number().int().min(1).max(100).optional(),
    }),
  },
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": {
          schema: NotificationPublicSchema.array(),
        },
      },
    },
  },
});

openAPIRegistry.registerPath({
  method: "patch",
  path: "/notifications/{notificationId}/read",
  summary: "Mark a notification as read for the current admin",
  tags: ["Notifications"],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({ notificationId: z.string() }),
  },
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": {
          schema: NotificationPublicSchema,
        },
      },
    },
    404: {
      description: "Not found",
    },
  },
});
