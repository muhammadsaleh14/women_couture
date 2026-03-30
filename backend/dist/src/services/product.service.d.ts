import { ClothingType, StockMoveType } from "@prisma/client";
export declare function createProduct(data: {
    name: string;
    description?: string;
    type: ClothingType;
    variants?: Array<{
        color: string;
        sku?: string;
        salePrice: number;
        purchasePrice?: number;
    }>;
}): Promise<{
    variants: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        color: string;
        sku: string | null;
        salePrice: import("@prisma/client-runtime-utils").Decimal;
        purchasePrice: import("@prisma/client-runtime-utils").Decimal | null;
        productId: string;
        stockQty: number;
    }[];
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
}): Promise<({
    variants: ({
        images: {
            id: string;
            createdAt: Date;
            url: string;
            productVariantId: string;
            order: number;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        color: string;
        sku: string | null;
        salePrice: import("@prisma/client-runtime-utils").Decimal;
        purchasePrice: import("@prisma/client-runtime-utils").Decimal | null;
        productId: string;
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
})[]>;
export declare function createVariant(productId: string, data: {
    color: string;
    sku?: string;
    salePrice: number;
    purchasePrice?: number;
}): Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    color: string;
    sku: string | null;
    salePrice: import("@prisma/client-runtime-utils").Decimal;
    purchasePrice: import("@prisma/client-runtime-utils").Decimal | null;
    productId: string;
    stockQty: number;
}>;
export declare function adjustStock(variantId: string, type: StockMoveType, quantity: number, notes?: string): Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    color: string;
    sku: string | null;
    salePrice: import("@prisma/client-runtime-utils").Decimal;
    purchasePrice: import("@prisma/client-runtime-utils").Decimal | null;
    productId: string;
    stockQty: number;
}>;
export declare function addImage(variantId: string, url: string, order?: number): Promise<{
    id: string;
    createdAt: Date;
    url: string;
    productVariantId: string;
    order: number;
}>;
