import { NotificationType, Prisma } from "@prisma/client";
import { prisma } from "../../core/database/prisma";
import { HttpError } from "../../core/errors/http-error";

function typePublic(t: NotificationType): "ORDER_PLACED" {
  if (t === "ORDER_PLACED") return "ORDER_PLACED";
  return "ORDER_PLACED";
}

export function serializeNotification(
  row: {
    id: string;
    type: NotificationType;
    title: string;
    body: string | null;
    orderId: string | null;
    createdAt: Date;
    reads: { userId: string }[];
  },
) {
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

export async function createOrderPlacedNotification(
  tx: Prisma.TransactionClient,
  order: {
    id: string;
    orderNumber: number;
    customerName: string;
    city: string;
  },
) {
  await tx.adminNotification.create({
    data: {
      type: NotificationType.ORDER_PLACED,
      title: `New order #${order.orderNumber}`,
      body: `${order.customerName} · ${order.city}`,
      orderId: order.id,
    },
  });
}

export async function listNotificationsForUser(
  userId: string,
  query: { skip: number; take: number },
) {
  const rows = await prisma.adminNotification.findMany({
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

export async function markNotificationRead(
  notificationId: string,
  userId: string,
) {
  const exists = await prisma.adminNotification.findUnique({
    where: { id: notificationId },
  });
  if (!exists) {
    throw new HttpError(404, "Notification not found");
  }

  await prisma.adminNotificationRead.upsert({
    where: {
      notificationId_userId: { notificationId, userId },
    },
    create: { notificationId, userId },
    update: { readAt: new Date() },
  });

  const row = await prisma.adminNotification.findUniqueOrThrow({
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
