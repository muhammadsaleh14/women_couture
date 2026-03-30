import { z } from "zod";
export declare const ProductBaseSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodNullable<z.ZodString>;
    type: z.ZodEnum<{
        UNSTITCHED: "UNSTITCHED";
        THREE_PC: "THREE_PC";
        TWO_PC: "TWO_PC";
        SEPARATE: "SEPARATE";
    }>;
    isActive: z.ZodBoolean;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, z.core.$strip>;
export declare const CreateProductBodySchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    type: z.ZodEnum<{
        UNSTITCHED: "UNSTITCHED";
        THREE_PC: "THREE_PC";
        TWO_PC: "TWO_PC";
        SEPARATE: "SEPARATE";
    }>;
    variants: z.ZodOptional<z.ZodArray<z.ZodObject<{
        color: z.ZodString;
        sku: z.ZodOptional<z.ZodString>;
        salePrice: z.ZodNumber;
        purchasePrice: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export declare const CreateVariantBodySchema: z.ZodObject<{
    color: z.ZodString;
    sku: z.ZodOptional<z.ZodString>;
    salePrice: z.ZodNumber;
    purchasePrice: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export declare const AdjustStockBodySchema: z.ZodObject<{
    type: z.ZodEnum<{
        IN: "IN";
        OUT: "OUT";
        ADJUSTMENT: "ADJUSTMENT";
    }>;
    quantity: z.ZodNumber;
    notes: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const ProductVariantParamsSchema: z.ZodObject<{
    variantId: z.ZodString;
}, z.core.$strip>;
export declare const ProductParamsSchema: z.ZodObject<{
    productId: z.ZodString;
}, z.core.$strip>;
export declare const ProductQuerySchema: z.ZodObject<{
    skip: z.ZodDefault<z.ZodOptional<z.ZodCoercedNumber<unknown>>>;
    take: z.ZodDefault<z.ZodOptional<z.ZodCoercedNumber<unknown>>>;
    isActive: z.ZodOptional<z.ZodEnum<{
        true: "true";
        false: "false";
    }>>;
}, z.core.$strip>;
