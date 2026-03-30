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
export declare const ProductImageSchema: z.ZodObject<{
    id: z.ZodString;
    url: z.ZodString;
    order: z.ZodNumber;
}, z.core.$strip>;
export declare const ProductVariantSchema: z.ZodObject<{
    id: z.ZodString;
    productId: z.ZodString;
    sku: z.ZodNullable<z.ZodString>;
    salePrice: z.ZodCoercedNumber<unknown>;
    purchasePrice: z.ZodNullable<z.ZodCoercedNumber<unknown>>;
    stockQty: z.ZodNumber;
    sortOrder: z.ZodNumber;
    images: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        url: z.ZodString;
        order: z.ZodNumber;
    }, z.core.$strip>>>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, z.core.$strip>;
export declare const ProductWithVariantsSchema: z.ZodObject<{
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
    variants: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        productId: z.ZodString;
        sku: z.ZodNullable<z.ZodString>;
        salePrice: z.ZodCoercedNumber<unknown>;
        purchasePrice: z.ZodNullable<z.ZodCoercedNumber<unknown>>;
        stockQty: z.ZodNumber;
        sortOrder: z.ZodNumber;
        images: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            url: z.ZodString;
            order: z.ZodNumber;
        }, z.core.$strip>>>;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const ProductListResponseSchema: z.ZodObject<{
    items: z.ZodArray<z.ZodObject<{
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
        variants: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            productId: z.ZodString;
            sku: z.ZodNullable<z.ZodString>;
            salePrice: z.ZodCoercedNumber<unknown>;
            purchasePrice: z.ZodNullable<z.ZodCoercedNumber<unknown>>;
            stockQty: z.ZodNumber;
            sortOrder: z.ZodNumber;
            images: z.ZodOptional<z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                url: z.ZodString;
                order: z.ZodNumber;
            }, z.core.$strip>>>;
            createdAt: z.ZodString;
            updatedAt: z.ZodString;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
    total: z.ZodNumber;
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
        sku: z.ZodOptional<z.ZodString>;
        salePrice: z.ZodNumber;
        purchasePrice: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export declare const CreateVariantBodySchema: z.ZodObject<{
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
export declare const StockMoveRecordSchema: z.ZodObject<{
    id: z.ZodString;
    productVariantId: z.ZodString;
    type: z.ZodEnum<{
        IN: "IN";
        OUT: "OUT";
        ADJUSTMENT: "ADJUSTMENT";
    }>;
    quantity: z.ZodNumber;
    notes: z.ZodNullable<z.ZodString>;
    createdAt: z.ZodString;
}, z.core.$strip>;
export declare const VariantStockMovesResponseSchema: z.ZodObject<{
    variantId: z.ZodString;
    sku: z.ZodNullable<z.ZodString>;
    stockQty: z.ZodNumber;
    productId: z.ZodString;
    productName: z.ZodString;
    moves: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        productVariantId: z.ZodString;
        type: z.ZodEnum<{
            IN: "IN";
            OUT: "OUT";
            ADJUSTMENT: "ADJUSTMENT";
        }>;
        quantity: z.ZodNumber;
        notes: z.ZodNullable<z.ZodString>;
        createdAt: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const UpdateProductBodySchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    type: z.ZodOptional<z.ZodEnum<{
        UNSTITCHED: "UNSTITCHED";
        THREE_PC: "THREE_PC";
        TWO_PC: "TWO_PC";
        SEPARATE: "SEPARATE";
    }>>;
    isActive: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
/** Full product save (create/update) sent as multipart `data` JSON + `variants[i]` files. */
export declare const SaveProductVariantInputSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    sku: z.ZodOptional<z.ZodString>;
    salePrice: z.ZodNumber;
    purchasePrice: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    existingImageIds: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
export declare const SaveProductBodySchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    type: z.ZodEnum<{
        UNSTITCHED: "UNSTITCHED";
        THREE_PC: "THREE_PC";
        TWO_PC: "TWO_PC";
        SEPARATE: "SEPARATE";
    }>;
    variants: z.ZodArray<z.ZodObject<{
        id: z.ZodOptional<z.ZodString>;
        sku: z.ZodOptional<z.ZodString>;
        salePrice: z.ZodNumber;
        purchasePrice: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
        existingImageIds: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type SaveProductBody = z.infer<typeof SaveProductBodySchema>;
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
