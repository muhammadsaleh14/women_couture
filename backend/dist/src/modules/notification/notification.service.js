"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializeNotification = serializeNotification;
exports.createOrderPlacedNotification = createOrderPlacedNotification;
exports.listNotificationsForUser = listNotificationsForUser;
exports.markNotificationRead = markNotificationRead;
const client_1 = require("@prisma/client");
const prisma_1 = require("../../core/database/prisma");
const http_error_1 = require("../../core/errors/http-error");
function typePublic(t) {
    if (t === "ORDER_PLACED")
        return "ORDER_PLACED";
    return "ORDER_PLACED";
}
function serializeNotification(row) {
    return {
        id: row.id,
        type: typePublic(row.type),
        title: row.title,
        body: row.body,
        orderId: row.orderId,
        createdAt: row.createdAt.toISOString(),
        read: row.reads.length > 0,
    };
}
async function createOrderPlacedNotification(tx, order) {
    await tx.adminNotification.create({
        data: {
            type: client_1.NotificationType.ORDER_PLACED,
            title: `New order #${order.orderNumber}`,
            body: `${order.customerName} · ${order.city}`,
            orderId: order.id,
        },
    });
}
async function listNotificationsForUser(userId, query) {
    const rows = await prisma_1.prisma.adminNotification.findMany({
        skip: query.skip,
        take: query.take,
        orderBy: { createdAt: "desc" },
        include: {
            reads: {
                where: { userId },
                take: 1,
            },
        },
    });
    return rows.map(serializeNotification);
}
async function markNotificationRead(notificationId, userId) {
    const exists = await prisma_1.prisma.adminNotification.findUnique({
        where: { id: notificationId },
    });
    if (!exists) {
        throw new http_error_1.HttpError(404, "Notification not found");
    }
    await prisma_1.prisma.adminNotificationRead.upsert({
        where: {
            notificationId_userId: { notificationId, userId },
        },
        create: { notificationId, userId },
        update: { readAt: new Date() },
    });
    const row = await prisma_1.prisma.adminNotification.findUniqueOrThrow({
        where: { id: notificationId },
        include: {
            reads: {
                where: { userId },
                take: 1,
            },
        },
    });
    return serializeNotification(row);
}
//# sourceMappingURL=notification.service.js.map