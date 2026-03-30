"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginBodySchema = exports.RegisterBodySchema = exports.AuthTokenResponseSchema = exports.UserPublicSchema = void 0;
const zod_openapi_1 = require("../zod-openapi");
exports.UserPublicSchema = zod_openapi_1.z
    .object({
    id: zod_openapi_1.z.string(),
    username: zod_openapi_1.z.string(),
    role: zod_openapi_1.z.enum(["CUSTOMER", "ADMIN"]),
})
    .openapi("UserPublic");
exports.AuthTokenResponseSchema = zod_openapi_1.z
    .object({
    accessToken: zod_openapi_1.z.string(),
    user: exports.UserPublicSchema,
})
    .openapi("AuthTokenResponse");
exports.RegisterBodySchema = zod_openapi_1.z
    .object({
    username: zod_openapi_1.z.string().min(3).max(32),
    password: zod_openapi_1.z.string().min(8).max(128),
})
    .openapi("RegisterBody");
exports.LoginBodySchema = zod_openapi_1.z
    .object({
    username: zod_openapi_1.z.string().min(1).max(32),
    password: zod_openapi_1.z.string().min(1).max(128),
})
    .openapi("LoginBody");
//# sourceMappingURL=auth.schema.js.map