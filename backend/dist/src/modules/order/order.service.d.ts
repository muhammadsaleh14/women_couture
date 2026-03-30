import { Prisma } from "@prisma/client";
export type CreateOrderInput = {
    customerName: string;
    phone: string;
    shippingAddress: string;
    city: string;
    payment: "cod" | "online";
    items: {
        variantId: string;
        qty: number;
    }[];
    userId?: string | null;
};
export declare function serializeOrder(o: Prisma.OrderGetPayload<{
    include: {
        lines: true;
    };
}>): {
    id: string;
    orderNumber: number;
    placedAt: string;
    customerName: string;
    phone: string;
    shippingAddress: string;
    city: string;
    payment: "cod" | "online";
    status: "pending" | "shipped" | "delivered";
    subtotal: number;
    total: number;
    lines: {
        id: string;
        productName: string;
        type: string;
        sku: string | null;
        qty: number;
        unitPrice: number;
        lineTotal: number;
    }[];
};
export declare function createOrder(input: CreateOrderInput): Promise<{
    id: string;
    orderNumber: number;
    placedAt: string;
    customerName: string;
    phone: string;
    shippingAddress: string;
    city: string;
    payment: "cod" | "online";
    status: "pending" | "shipped" | "delivered";
    subtotal: number;
    total: number;
    lines: {
        id: string;
        productName: string;
        type: string;
        sku: string | null;
        qty: number;
        unitPrice: number;
        lineTotal: number;
    }[];
}>;
export declare function listOrders(query: {
    skip: number;
    take: number;
}): Promise<{
    id: string;
    orderNumber: number;
    placedAt: string;
    customerName: string;
    phone: string;
    shippingAddress: string;
    city: string;
    payment: "cod" | "online";
    status: "pending" | "shipped" | "delivered";
    subtotal: number;
    total: number;
    lines: {
        id: string;
        productName: string;
        type: string;
        sku: string | null;
        qty: number;
        unitPrice: number;
        lineTotal: number;
    }[];
}[]>;
export declare function getOrderById(orderId: string): Promise<{
    id: string;
    orderNumber: number;
    placedAt: string;
    customerName: string;
    phone: string;
    shippingAddress: string;
    city: string;
    payment: "cod" | "online";
    status: "pending" | "shipped" | "delivered";
    subtotal: number;
    total: number;
    lines: {
        id: string;
        productName: string;
        type: string;
        sku: string | null;
        qty: number;
        unitPrice: number;
        lineTotal: number;
    }[];
} | null>;
export declare function updateOrderStatus(orderId: string, status: "pending" | "shipped" | "delivered"): Promise<{
    id: string;
    orderNumber: number;
    placedAt: string;
    customerName: string;
    phone: string;
    shippingAddress: string;
    city: string;
    payment: "cod" | "online";
    status: "pending" | "shipped" | "delivered";
    subtotal: number;
    total: number;
    lines: {
        id: string;
        productName: string;
        type: string;
        sku: string | null;
        qty: number;
        unitPrice: number;
        lineTotal: number;
    }[];
}>;
