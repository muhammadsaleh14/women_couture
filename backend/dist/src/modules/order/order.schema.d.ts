import { z } from "zod";
export declare const OrderLinePublicSchema: z.ZodObject<{
    id: z.ZodString;
    productName: z.ZodString;
    type: z.ZodString;
    sku: z.ZodNullable<z.ZodString>;
    qty: z.ZodNumber;
    unitPrice: z.ZodNumber;
    lineTotal: z.ZodNumber;
}, z.core.$strip>;
export declare const OrderPublicSchema: z.ZodObject<{
    id: z.ZodString;
    orderNumber: z.ZodNumber;
    placedAt: z.ZodString;
    customerName: z.ZodString;
    phone: z.ZodString;
    shippingAddress: z.ZodString;
    city: z.ZodString;
    payment: z.ZodEnum<{
        cod: "cod";
        online: "online";
    }>;
    status: z.ZodEnum<{
        pending: "pending";
        shipped: "shipped";
        delivered: "delivered";
    }>;
    subtotal: z.ZodNumber;
    total: z.ZodNumber;
    lines: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        productName: z.ZodString;
        type: z.ZodString;
        sku: z.ZodNullable<z.ZodString>;
        qty: z.ZodNumber;
        unitPrice: z.ZodNumber;
        lineTotal: z.ZodNumber;
    }, z.core.$strip>>;
}, z.core.$strip>;
declare const CreateOrderBodySchemaBase: z.ZodObject<{
    customerName: z.ZodString;
    phone: z.ZodString;
    shippingAddress: z.ZodString;
    city: z.ZodString;
    payment: z.ZodEnum<{
        cod: "cod";
        online: "online";
    }>;
    items: z.ZodArray<z.ZodObject<{
        variantId: z.ZodString;
        qty: z.ZodNumber;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const CreateOrderBodySchema: z.ZodObject<{
    customerName: z.ZodString;
    phone: z.ZodString;
    shippingAddress: z.ZodString;
    city: z.ZodString;
    payment: z.ZodEnum<{
        cod: "cod";
        online: "online";
    }>;
    items: z.ZodArray<z.ZodObject<{
        variantId: z.ZodString;
        qty: z.ZodNumber;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type CreateOrderBody = z.infer<typeof CreateOrderBodySchemaBase>;
declare const UpdateOrderBodySchemaBase: z.ZodObject<{
    status: z.ZodEnum<{
        pending: "pending";
        shipped: "shipped";
        delivered: "delivered";
    }>;
}, z.core.$strip>;
export declare const UpdateOrderBodySchema: z.ZodObject<{
    status: z.ZodEnum<{
        pending: "pending";
        shipped: "shipped";
        delivered: "delivered";
    }>;
}, z.core.$strip>;
export type UpdateOrderBody = z.infer<typeof UpdateOrderBodySchemaBase>;
export declare const OrderParamsSchema: z.ZodObject<{
    orderId: z.ZodString;
}, z.core.$strip>;
export declare const ListOrdersQuerySchema: z.ZodObject<{
    skip: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    take: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
export {};
