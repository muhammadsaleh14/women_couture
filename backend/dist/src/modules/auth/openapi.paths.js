"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const registry_1 = require("../../core/openapi/registry");
const auth_schema_1 = require("./auth.schema");
registry_1.openAPIRegistry.registerPath({
    method: "post",
    path: "/auth/register",
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
    path: "/auth/login",
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
    path: "/auth/me",
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
//# sourceMappingURL=openapi.paths.js.map