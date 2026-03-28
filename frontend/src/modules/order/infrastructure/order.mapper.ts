import type { OrderPublic } from "@/core/api/generated/api";
import type { Order } from "@/shared/model/types";

/** Map OpenAPI / Orval `OrderPublic` into shared storefront/admin `Order`. */
export function mapOrderPublicToOrder(o: OrderPublic): Order {
  return {
    id: o.id,
    orderNumber: o.orderNumber,
    placedAt: o.placedAt,
    customerName: o.customerName,
    phone: o.phone,
    shippingAddress: o.shippingAddress,
    city: o.city,
    payment: o.payment,
    status: o.status,
    subtotal: o.subtotal,
    total: o.total,
    lines: o.lines.map((l) => ({
      id: l.id,
      productName: l.productName,
      type: l.type,
      sku: l.sku,
      qty: l.qty,
      unitPrice: l.unitPrice,
      lineTotal: l.lineTotal,
    })),
  };
}
