import { NotificationType, Prisma } from "@prisma/client";
export declare function serializeNotification(row: {
    id: string;
    type: NotificationType;
    title: string;
    body: string | null;
    orderId: string | null;
    createdAt: Date;
    reads: {
        userId: string;
    }[];
}): {
    id: string;
    type: "ORDER_PLACED";
    title: string;
    body: string | null;
    orderId: string | null;
    createdAt: string;
    read: boolean;
};
export declare function createOrderPlacedNotification(tx: Prisma.TransactionClient, order: {
    id: string;
    orderNumber: number;
    customerName: string;
    city: string;
}): Promise<void>;
export declare function listNotificationsForUser(userId: string, query: {
    skip: number;
    take: number;
}): Promise<{
    id: string;
    type: "ORDER_PLACED";
    title: string;
    body: string | null;
    orderId: string | null;
    createdAt: string;
    read: boolean;
}[]>;
export declare function markNotificationRead(notificationId: string, userId: string): Promise<{
    id: string;
    type: "ORDER_PLACED";
    title: string;
    body: string | null;
    orderId: string | null;
    createdAt: string;
    read: boolean;
}>;
