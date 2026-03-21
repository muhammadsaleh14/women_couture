import { openAPIRegistry } from "./registry";
import {
  EchoBodySchema,
  EchoResponseSchema,
  HealthResponseSchema,
} from "../routes/schemas";

openAPIRegistry.registerPath({
  method: "get",
  path: "/health",
  summary: "Health check",
  tags: ["Health"],
  responses: {
    200: {
      description: "Service is healthy",
      content: {
        "application/json": {
          schema: HealthResponseSchema,
        },
      },
    },
  },
});

openAPIRegistry.registerPath({
  method: "post",
  path: "/api/v1/echo",
  summary: "Echo message",
  tags: ["Example"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: EchoBodySchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Echoed message",
      content: {
        "application/json": {
          schema: EchoResponseSchema,
        },
      },
    },
  },
});
