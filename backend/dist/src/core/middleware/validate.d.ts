import { RequestHandler } from "express";
import { ZodSchema } from "zod";
export declare function validateBody<T>(schema: ZodSchema<T>): RequestHandler;
