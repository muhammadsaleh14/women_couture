import { z } from "../../zod-openapi";
import { openAPIRegistry } from "../../core/openapi/registry";
import {
  CreateOrderBodySchema,
  OrderPublicSchema,
  UpdateOrderBodySchema,
} from "./order.schema";

openAPIRegistry.registerPath({
  method: "post",
  path: "/orders",
  summary: "Place an order (guest or authenticated customer)",
  tags: ["Orders"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: CreateOrderBodySchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: "Created",
      content: {
        "application/json": {
          schema: OrderPublicSchema,
        },
      },
    },
    400: {
      description: "Validation or stock error",
    },
  },
});

openAPIRegistry.registerPath({
  method: "get",
  path: "/orders",
  summary: "List orders (admin)",
  tags: ["Orders"],
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
          schema: OrderPublicSchema.array(),
        },
      },
    },
  },
});

openAPIRegistry.registerPath({
  method: "get",
  path: "/orders/{orderId}",
  summary: "Get order by id (admin)",
  tags: ["Orders"],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({ orderId: z.string() }),
  },
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": {
          schema: OrderPublicSchema,
        },
      },
    },
    404: {
      description: "Not found",
    },
  },
});

openAPIRegistry.registerPath({
  method: "patch",
  path: "/orders/{orderId}",
  summary: "Update order status (admin)",
  tags: ["Orders"],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({ orderId: z.string() }),
    body: {
      content: {
        "application/json": {
          schema: UpdateOrderBodySchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": {
          schema: OrderPublicSchema,
        },
      },
    },
    404: {
      description: "Not found",
    },
  },
});
