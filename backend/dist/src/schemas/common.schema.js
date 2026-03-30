"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EchoResponseSchema = exports.EchoBodySchema = exports.HealthResponseSchema = void 0;
const zod_openapi_1 = require("../zod-openapi");
exports.HealthResponseSchema = zod_openapi_1.z
    .object({
    status: zod_openapi_1.z.literal("ok"),
    timestamp: zod_openapi_1.z.string().datetime(),
})
    .openapi("HealthResponse");
exports.EchoBodySchema = zod_openapi_1.z
    .object({
    message: zod_openapi_1.z.string().min(1),
})
    .openapi("EchoBody");
exports.EchoResponseSchema = zod_openapi_1.z
    .object({
    echo: zod_openapi_1.z.string(),
})
    .openapi("EchoResponse");
//# sourceMappingURL=common.schema.js.map