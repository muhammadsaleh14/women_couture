import { openAPIRegistry } from "./registry";
import {
  AuthTokenResponseSchema,
  LoginBodySchema,
  RegisterBodySchema,
  UserPublicSchema,
} from "../routes/auth-schemas";
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
  path: "/api/v1/auth/register",
  summary: "Register (customer only)",
  tags: ["Auth"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: RegisterBodySchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: "Created",
      content: {
        "application/json": {
          schema: AuthTokenResponseSchema,
        },
      },
    },
  },
});

openAPIRegistry.registerPath({
  method: "post",
  path: "/api/v1/auth/login",
  summary: "Login",
  tags: ["Auth"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: LoginBodySchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": {
          schema: AuthTokenResponseSchema,
        },
      },
    },
  },
});

openAPIRegistry.registerPath({
  method: "get",
  path: "/api/v1/auth/me",
  summary: "Current user (send Authorization: Bearer token)",
  tags: ["Auth"],
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": {
          schema: UserPublicSchema,
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
