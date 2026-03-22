import { openAPIRegistry } from "../registry";
import {
  AuthTokenResponseSchema,
  LoginBodySchema,
  RegisterBodySchema,
  UserPublicSchema,
} from "../../schemas/auth.schema";

openAPIRegistry.registerPath({
  method: "post",
  path: "/auth/register",
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
  path: "/auth/login",
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
  path: "/auth/me",
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
