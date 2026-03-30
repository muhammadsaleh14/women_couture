"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const registry_1 = require("../registry");
const common_schema_1 = require("../../schemas/common.schema");
registry_1.openAPIRegistry.registerPath({
    method: "get",
    path: "/health",
    summary: "Health check",
    tags: ["Health"],
    responses: {
        200: {
            description: "Service is healthy",
            content: {
                "application/json": {
                    schema: common_schema_1.HealthResponseSchema,
                },
            },
        },
    },
});
registry_1.openAPIRegistry.registerPath({
    method: "post",
    path: "/api/v1/echo",
    summary: "Echo message",
    tags: ["Example"],
    request: {
        body: {
            content: {
                "application/json": {
                    schema: common_schema_1.EchoBodySchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: "Echoed message",
            content: {
                "application/json": {
                    schema: common_schema_1.EchoResponseSchema,
                },
            },
        },
    },
});
//# sourceMappingURL=common.paths.js.map