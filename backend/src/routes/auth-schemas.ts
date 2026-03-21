import { z } from "../zod-openapi";

export const UserPublicSchema = z
  .object({
    id: z.string(),
    username: z.string(),
    role: z.enum(["CUSTOMER", "ADMIN"]),
  })
  .openapi("UserPublic");

export const AuthTokenResponseSchema = z
  .object({
    accessToken: z.string(),
    user: UserPublicSchema,
  })
  .openapi("AuthTokenResponse");

export const RegisterBodySchema = z
  .object({
    username: z.string().min(3).max(32),
    password: z.string().min(8).max(128),
  })
  .openapi("RegisterBody");

export const LoginBodySchema = z
  .object({
    username: z.string().min(1).max(32),
    password: z.string().min(1).max(128),
  })
  .openapi("LoginBody");
