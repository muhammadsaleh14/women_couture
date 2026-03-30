"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializeOrder = serializeOrder;
exports.createOrder = createOrder;
exports.listOrders = listOrders;
exports.getOrderById = getOrderById;
exports.updateOrderStatus = updateOrderStatus;
const client_1 = require("@prisma/client");
const prisma_1 = require("../../core/database/prisma");
const http_error_1 = require("../../core/errors/http-error");
const notificationService = __importStar(require("../notification/notification.service"));
function clothingTypeLabel(t) {
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
function toDbPayment(p) {
    return p === "cod" ? "COD" : "ONLINE";
}
function toPublicPayment(p) {
    return p === "COD" ? "cod" : "online";
}
function toPublicStatus(s) {
    if (s === "PENDING")
        return "pending";
    if (s === "SHIPPED")
        return "shipped";
    return "delivered";
}
function toDbStatus(s) {
    if (s === "pending")
        return "PENDING";
    if (s === "shipped")
        return "SHIPPED";
    return "DELIVERED";
}
function serializeOrder(o) {
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
async function createOrder(input) {
    const merged = new Map();
    for (const it of input.items) {
        merged.set(it.variantId, (merged.get(it.variantId) ?? 0) + it.qty);
    }
    for (const [, qty] of merged) {
        if (qty < 1) {
            throw new http_error_1.HttpError(400, "Invalid quantity");
        }
    }
    return prisma_1.prisma.$transaction(async (tx) => {
        const lineRows = [];
        let subtotal = new client_1.Prisma.Decimal(0);
        for (const [variantId, qty] of merged) {
            const variant = await tx.productVariant.findUnique({
                where: { id: variantId },
                include: { product: true },
            });
            if (!variant) {
                throw new http_error_1.HttpError(400, "One or more products are no longer available");
            }
            if (!variant.product.isActive) {
                throw new http_error_1.HttpError(400, `Product is not available: ${variant.product.name}`);
            }
            if (variant.stockQty < qty) {
                throw new http_error_1.HttpError(400, `Insufficient stock for ${variant.product.name}`);
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
                    type: client_1.StockMoveType.OUT,
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
async function listOrders(query) {
    const rows = await prisma_1.prisma.order.findMany({
        skip: query.skip,
        take: query.take,
        orderBy: { createdAt: "desc" },
        include: { lines: true },
    });
    return rows.map(serializeOrder);
}
async function getOrderById(orderId) {
    const row = await prisma_1.prisma.order.findUnique({
        where: { id: orderId },
        include: { lines: true },
    });
    return row ? serializeOrder(row) : null;
}
async function updateOrderStatus(orderId, status) {
    const row = await prisma_1.prisma.order.update({
        where: { id: orderId },
        data: { status: toDbStatus(status) },
        include: { lines: true },
    });
    return serializeOrder(row);
}
//# sourceMappingURL=order.service.js.map