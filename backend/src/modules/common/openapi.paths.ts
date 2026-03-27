import { openAPIRegistry } from "../../core/openapi/registry";
import { EchoBodySchema, EchoResponseSchema } from "./common.schema";

openAPIRegistry.registerPath({
  method: "post",
  path: "/echo",
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
