"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const registry_1 = require("../../core/openapi/registry");
const common_schema_1 = require("./common.schema");
registry_1.openAPIRegistry.registerPath({
    method: "post",
    path: "/echo",
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
//# sourceMappingURL=openapi.paths.js.map