"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const registry_1 = require("../registry");
const auth_schema_1 = require("../../schemas/auth.schema");
registry_1.openAPIRegistry.registerPath({
    method: "post",
    path: "/api/v1/auth/register",
    summary: "Register (customer only)",
    tags: ["Auth"],
    request: {
        body: {
            content: {
                "application/json": {
                    schema: auth_schema_1.RegisterBodySchema,
                },
            },
        },
    },
    responses: {
        201: {
            description: "Created",
            content: {
                "application/json": {
                    schema: auth_schema_1.AuthTokenResponseSchema,
                },
            },
        },
    },
});
registry_1.openAPIRegistry.registerPath({
    method: "post",
    path: "/api/v1/auth/login",
    summary: "Login",
    tags: ["Auth"],
    request: {
        body: {
            content: {
                "application/json": {
                    schema: auth_schema_1.LoginBodySchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: "OK",
            content: {
                "application/json": {
                    schema: auth_schema_1.AuthTokenResponseSchema,
                },
            },
        },
    },
});
registry_1.openAPIRegistry.registerPath({
    method: "get",
    path: "/api/v1/auth/me",
    summary: "Current user (send Authorization: Bearer token)",
    tags: ["Auth"],
    responses: {
        200: {
            description: "OK",
            content: {
                "application/json": {
                    schema: auth_schema_1.UserPublicSchema,
                },
            },
        },
    },
});
//# sourceMappingURL=auth.paths.js.map