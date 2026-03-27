import { z } from "../../zod-openapi";

export const HealthResponseSchema = z
  .object({
    status: z.literal("ok"),
    timestamp: z.string().datetime(),
  })
  .openapi("HealthResponse");

export const EchoBodySchema = z
  .object({
    message: z.string().min(1),
  })
  .openapi("EchoBody");

export const EchoResponseSchema = z
  .object({
    echo: z.string(),
  })
  .openapi("EchoResponse");
