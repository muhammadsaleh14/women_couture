import { z } from "../../zod-openapi";
export declare const UserPublicSchema: z.ZodObject<{
    id: z.ZodString;
    username: z.ZodString;
    role: z.ZodEnum<{
        CUSTOMER: "CUSTOMER";
        ADMIN: "ADMIN";
    }>;
}, z.core.$strip>;
export declare const AuthTokenResponseSchema: z.ZodObject<{
    accessToken: z.ZodString;
    user: z.ZodObject<{
        id: z.ZodString;
        username: z.ZodString;
        role: z.ZodEnum<{
            CUSTOMER: "CUSTOMER";
            ADMIN: "ADMIN";
        }>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const RegisterBodySchema: z.ZodObject<{
    username: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export declare const LoginBodySchema: z.ZodObject<{
    username: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
