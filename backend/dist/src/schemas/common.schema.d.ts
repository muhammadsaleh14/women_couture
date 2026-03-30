import { z } from "../zod-openapi";
export declare const HealthResponseSchema: z.ZodObject<{
    status: z.ZodLiteral<"ok">;
    timestamp: z.ZodString;
}, z.core.$strip>;
export declare const EchoBodySchema: z.ZodObject<{
    message: z.ZodString;
}, z.core.$strip>;
export declare const EchoResponseSchema: z.ZodObject<{
    echo: z.ZodString;
}, z.core.$strip>;
