import {
  ClothingType,
  OrderPaymentMethod,
  OrderStatus,
  Prisma,
  StockMoveType,
} from "@prisma/client";
import { prisma } from "../../core/database/prisma";
import { HttpError } from "../../core/errors/http-error";
import * as notificationService from "../notification/notification.service";

export type CreateOrderInput = {
  customerName: string;
  phone: string;
  shippingAddress: string;
  city: string;
  payment: "cod" | "online";
  items: { variantId: string; qty: number }[];
  userId?: string | null;
};

function clothingTypeLabel(t: ClothingType): string {
  switch (t) {
    case "UNSTITCHED":
      return "Unstitched";
    case "THREE_PC":
      return "3 PC";
    case "TWO_PC":
      return "2 PC";
    case "SEPARATE":
      return "Separates";
    default:
      return t;
  }
}

function toDbPayment(p: "cod" | "online"): OrderPaymentMethod {
  return p === "cod" ? "COD" : "ONLINE";
}

function toPublicPayment(p: OrderPaymentMethod): "cod" | "online" {
  return p === "COD" ? "cod" : "online";
}

function toPublicStatus(s: OrderStatus): "pending" | "shipped" | "delivered" {
  if (s === "PENDING") return "pending";
  if (s === "SHIPPED") return "shipped";
  return "delivered";
}

function toDbStatus(s: "pending" | "shipped" | "delivered"): OrderStatus {
  if (s === "pending") return "PENDING";
  if (s === "shipped") return "SHIPPED";
  return "DELIVERED";
}

export function serializeOrder(
  o: Prisma.OrderGetPayload<{ include: { lines: true } }>,
) {
  return {
    id: o.id,
    orderNumber: o.orderNumber,
    placedAt: o.createdAt.toISOString(),
    customerName: o.customerName,
    phone: o.phone,
    shippingAddress: o.shippingAddress,
    city: o.city,
    payment: toPublicPayment(o.payment),
    status: toPublicStatus(o.status),
    subtotal: Number(o.subtotal),
    total: Number(o.total),
    lines: o.lines.map((l) => ({
      id: l.id,
      productName: l.productName,
      type: l.productType,
      sku: l.sku,
      qty: l.qty,
      unitPrice: Number(l.unitPrice),
      lineTotal: Number(l.lineTotal),
    })),
  };
}

export async function createOrder(input: CreateOrderInput) {
  const merged = new Map<string, number>();
  for (const it of input.items) {
    merged.set(it.variantId, (merged.get(it.variantId) ?? 0) + it.qty);
  }

  for (const [, qty] of merged) {
    if (qty < 1) {
      throw new HttpError(400, "Invalid quantity");
    }
  }

  return prisma.$transaction(async (tx) => {
    type LineRow = {
      productVariantId: string;
      productName: string;
      productType: string;
      sku: string | null;
      qty: number;
      unitPrice: Prisma.Decimal;
      lineTotal: Prisma.Decimal;
    };

    const lineRows: LineRow[] = [];
    let subtotal = new Prisma.Decimal(0);

    for (const [variantId, qty] of merged) {
      const variant = await tx.productVariant.findUnique({
        where: { id: variantId },
        include: { product: true },
      });
      if (!variant) {
        throw new HttpError(400, "One or more products are no longer available");
      }
      if (!variant.product.isActive) {
        throw new HttpError(
          400,
          `Product is not available: ${variant.product.name}`,
        );
      }
      if (variant.stockQty < qty) {
        throw new HttpError(
          400,
          `Insufficient stock for ${variant.product.name}`,
        );
      }

      const unitPrice = variant.salePrice;
      const lineTotal = unitPrice.mul(qty);
      subtotal = subtotal.add(lineTotal);

      lineRows.push({
        productVariantId: variantId,
        productName: variant.product.name,
        productType: clothingTypeLabel(variant.product.type),
        sku: variant.sku,
        qty,
        unitPrice,
        lineTotal,
      });
    }

    const order = await tx.order.create({
      data: {
        customerName: input.customerName,
        phone: input.phone,
        shippingAddress: input.shippingAddress,
        city: input.city,
        payment: toDbPayment(input.payment),
        subtotal,
        total: subtotal,
        userId: input.userId ?? undefined,
        lines: {
          create: lineRows.map((r) => ({
            productVariantId: r.productVariantId,
            productName: r.productName,
            productType: r.productType,
            sku: r.sku,
            qty: r.qty,
            unitPrice: r.unitPrice,
            lineTotal: r.lineTotal,
          })),
        },
      },
      include: { lines: true },
    });

    for (const row of lineRows) {
      await tx.stockMove.create({
        data: {
          productVariantId: row.productVariantId,
          type: StockMoveType.OUT,
          quantity: row.qty,
          notes: `Order #${order.orderNumber}`,
        },
      });
      await tx.productVariant.update({
        where: { id: row.productVariantId },
        data: { stockQty: { decrement: row.qty } },
      });
    }

    await notificationService.createOrderPlacedNotification(tx, {
      id: order.id,
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      city: order.city,
    });

    return serializeOrder(order);
  });
}

export async function listOrders(query: { skip: number; take: number }) {
  const rows = await prisma.order.findMany({
    skip: query.skip,
    take: query.take,
    orderBy: { createdAt: "desc" },
    include: { lines: true },
  });
  return rows.map(serializeOrder);
}

export async function getOrderById(orderId: string) {
  const row = await prisma.order.findUnique({
    where: { id: orderId },
    include: { lines: true },
  });
  return row ? serializeOrder(row) : null;
}

export async function updateOrderStatus(
  orderId: string,
  status: "pending" | "shipped" | "delivered",
) {
  const row = await prisma.order.update({
    where: { id: orderId },
    data: { status: toDbStatus(status) },
    include: { lines: true },
  });
  return serializeOrder(row);
}
