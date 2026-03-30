export declare function createVariant(productId: string, data: {
    sku?: string;
    salePrice: number;
    purchasePrice?: number;
}): Promise<{
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
    salePrice: import("@prisma/client-runtime-utils").Decimal;
    purchasePrice: import("@prisma/client-runtime-utils").Decimal | null;
    stockQty: number;
}>;
export declare function updateVariant(variantId: string, data: {
    sku?: string;
    salePrice?: number;
    purchasePrice?: number;
}): Promise<{
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
    salePrice: import("@prisma/client-runtime-utils").Decimal;
    purchasePrice: import("@prisma/client-runtime-utils").Decimal | null;
    stockQty: number;
}>;
export declare function listStockMovesForVariant(variantId: string): Promise<{
    variantId: string;
    sku: string | null;
    stockQty: number;
    productId: string;
    productName: string;
    moves: {
        id: string;
        productVariantId: string;
        type: import(".prisma/client").$Enums.StockMoveType;
        quantity: number;
        notes: string | null;
        createdAt: string;
    }[];
} | null>;
export declare function deleteVariant(variantId: string): Promise<void>;
export declare function addImage(variantId: string, url: string, order?: number): Promise<{
    id: string;
    productVariantId: string;
    createdAt: Date;
    url: string;
    order: number;
}>;
export declare function deleteImage(imageId: string): Promise<{
    id: string;
    productVariantId: string;
    createdAt: Date;
    url: string;
    order: number;
}>;
