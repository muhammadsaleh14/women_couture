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
import {
  CreateProductBodySchema,
  CreateVariantBodySchema,
  AdjustStockBodySchema,
  ProductBaseSchema,
} from "../schemas/product.schema";

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

openAPIRegistry.registerPath({
  method: "get",
  path: "/api/v1/admin/products",
  summary: "List all products",
  tags: ["Products"],
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": {
          schema: ProductBaseSchema.array(), // Mock response length array
        },
      },
    },
  },
});

openAPIRegistry.registerPath({
  method: "post",
  path: "/api/v1/admin/products",
  summary: "Create a new base product",
  tags: ["Products"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: CreateProductBodySchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: "Created",
      content: {
        "application/json": {
          schema: ProductBaseSchema,
        },
      },
    },
  },
});

openAPIRegistry.registerPath({
  method: "post",
  path: "/api/v1/admin/products/{productId}/variants",
  summary: "Add a variant to a product",
  tags: ["Products"],
  request: {
    params: {
      productId: { type: "string" }, // Using inline raw def
    } as any, // Workaround for generic schema typing in some setups
    body: {
      content: {
        "application/json": {
          schema: CreateVariantBodySchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: "Created",
    },
  },
});

openAPIRegistry.registerPath({
  method: "post",
  path: "/api/v1/admin/variants/{variantId}/stock",
  summary: "Adjust variant stock",
  tags: ["Variants"],
  request: {
    params: {
      variantId: { type: "string" },
    } as any, 
    body: {
      content: {
        "application/json": {
          schema: AdjustStockBodySchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Stock adjusted successfully",
    },
  },
});
