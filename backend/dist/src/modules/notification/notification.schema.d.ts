import { z } from "zod";
export declare const NotificationPublicSchema: z.ZodObject<{
    id: z.ZodString;
    type: z.ZodEnum<{
        ORDER_PLACED: "ORDER_PLACED";
    }>;
    title: z.ZodString;
    body: z.ZodNullable<z.ZodString>;
    orderId: z.ZodNullable<z.ZodString>;
    createdAt: z.ZodString;
    read: z.ZodBoolean;
}, z.core.$strip>;
export declare const NotificationParamsSchema: z.ZodObject<{
    notificationId: z.ZodString;
}, z.core.$strip>;
export declare const ListNotificationsQuerySchema: z.ZodObject<{
    skip: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    take: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
