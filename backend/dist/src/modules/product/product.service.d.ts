import { ClothingType, Prisma, StockMoveType } from "@prisma/client";
import type { SaveProductBody } from "./product.schema";
export declare function createProduct(data: {
    name: string;
    description?: string;
    type: ClothingType;
    variants?: Array<{
        sku?: string;
        salePrice: number;
        purchasePrice?: number;
    }>;
}, variantImages?: Map<number, string[]>): Promise<{
    variants: ({
        images: {
            id: string;
            productVariantId: string;
            createdAt: Date;
            url: string;
            order: number;
        }[];
    } & {
        id: string;
        productId: string;
        sortOrder: number;
        createdAt: Date;
        updatedAt: Date;
        sku: string | null;
        salePrice: Prisma.Decimal;
        purchasePrice: Prisma.Decimal | null;
        stockQty: number;
    })[];
} & {
    id: string;
    type: import(".prisma/client").$Enums.ClothingType;
    description: string | null;
    name: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}>;
export declare function getAllProducts(query: {
    skip: number;
    take: number;
    isActive?: boolean;
}): Promise<{
    items: ({
        variants: ({
            images: {
                id: string;
                productVariantId: string;
                createdAt: Date;
                url: string;
                order: number;
            }[];
        } & {
            id: string;
            productId: string;
            sortOrder: number;
            createdAt: Date;
            updatedAt: Date;
            sku: string | null;
            salePrice: Prisma.Decimal;
            purchasePrice: Prisma.Decimal | null;
            stockQty: number;
        })[];
    } & {
        id: string;
        type: import(".prisma/client").$Enums.ClothingType;
        description: string | null;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    })[];
    total: number;
}>;
export declare function getProductById(productId: string): Promise<({
    variants: ({
        images: {
            id: string;
            productVariantId: string;
            createdAt: Date;
            url: string;
            order: number;
        }[];
    } & {
        id: string;
        productId: string;
        sortOrder: number;
        createdAt: Date;
        updatedAt: Date;
        sku: string | null;
        salePrice: Prisma.Decimal;
        purchasePrice: Prisma.Decimal | null;
        stockQty: number;
    })[];
} & {
    id: string;
    type: import(".prisma/client").$Enums.ClothingType;
    description: string | null;
    name: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}) | null>;
export declare function adjustStock(variantId: string, type: StockMoveType, quantity: number, notes?: string): Promise<{
    id: string;
    productId: string;
    sortOrder: number;
    createdAt: Date;
    updatedAt: Date;
    sku: string | null;
    salePrice: Prisma.Decimal;
    purchasePrice: Prisma.Decimal | null;
    stockQty: number;
}>;
export declare function updateProduct(productId: string, data: {
    name?: string;
    description?: string;
    type?: ClothingType;
    isActive?: boolean;
}): Promise<{
    id: string;
    type: import(".prisma/client").$Enums.ClothingType;
    description: string | null;
    name: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}>;
/**
 * Replace product + variants + images in one transaction (multipart full save).
 * `variantFiles` maps variant index in `body.variants` to uploaded file paths (disk URLs).
 */
export declare function replaceProductFull(productId: string, body: SaveProductBody, variantFiles: Map<number, string[]>): Promise<{
    variants: ({
        images: {
            id: string;
            productVariantId: string;
            createdAt: Date;
            url: string;
            order: number;
        }[];
    } & {
        id: string;
        productId: string;
        sortOrder: number;
        createdAt: Date;
        updatedAt: Date;
        sku: string | null;
        salePrice: Prisma.Decimal;
        purchasePrice: Prisma.Decimal | null;
        stockQty: number;
    })[];
} & {
    id: string;
    type: import(".prisma/client").$Enums.ClothingType;
    description: string | null;
    name: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}>;
