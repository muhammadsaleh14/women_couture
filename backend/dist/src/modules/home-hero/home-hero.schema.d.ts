import { z } from "zod";
export declare const HomeHeroSlideResolvedSchema: z.ZodObject<{
    id: z.ZodString;
    theme: z.ZodEnum<{
        LIGHT: "LIGHT";
        DARK: "DARK";
    }>;
    usePrimaryHeading: z.ZodBoolean;
    eyebrow: z.ZodString;
    title: z.ZodString;
    description: z.ZodNullable<z.ZodString>;
    productId: z.ZodNullable<z.ZodString>;
    variantId: z.ZodNullable<z.ZodString>;
    imageUrl: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
export declare const HomeHeroSlideRecordSchema: z.ZodObject<{
    id: z.ZodString;
    sortOrder: z.ZodNumber;
    isActive: z.ZodBoolean;
    theme: z.ZodEnum<{
        LIGHT: "LIGHT";
        DARK: "DARK";
    }>;
    usePrimaryHeading: z.ZodBoolean;
    eyebrow: z.ZodNullable<z.ZodString>;
    title: z.ZodNullable<z.ZodString>;
    description: z.ZodNullable<z.ZodString>;
    productVariantId: z.ZodNullable<z.ZodString>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, z.core.$strip>;
export declare const CreateHomeHeroSlideBodySchema: z.ZodObject<{
    sortOrder: z.ZodOptional<z.ZodNumber>;
    isActive: z.ZodOptional<z.ZodBoolean>;
    theme: z.ZodEnum<{
        LIGHT: "LIGHT";
        DARK: "DARK";
    }>;
    usePrimaryHeading: z.ZodOptional<z.ZodBoolean>;
    eyebrow: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    title: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    productVariantId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
export declare const UpdateHomeHeroSlideBodySchema: z.ZodObject<{
    sortOrder: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    isActive: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
    theme: z.ZodOptional<z.ZodEnum<{
        LIGHT: "LIGHT";
        DARK: "DARK";
    }>>;
    usePrimaryHeading: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
    eyebrow: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    title: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    description: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    productVariantId: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
}, z.core.$strip>;
export declare const ReorderHomeHeroSlidesBodySchema: z.ZodObject<{
    orderedIds: z.ZodArray<z.ZodString>;
}, z.core.$strip>;
export declare const HomeHeroSlideParamsSchema: z.ZodObject<{
    slideId: z.ZodString;
}, z.core.$strip>;
