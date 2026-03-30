import { z } from "zod";
export declare const UpdateVariantBodySchema: z.ZodObject<{
    sku: z.ZodOptional<z.ZodString>;
    salePrice: z.ZodOptional<z.ZodNumber>;
    purchasePrice: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
