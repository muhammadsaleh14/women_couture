import { api } from "@/core/lib/api";
import type { Order, PaymentMethod } from "@/shared/model/types";

export type CreateOrderRequest = {
  customerName: string;
  phone: string;
  shippingAddress: string;
  city: string;
  payment: PaymentMethod;
  items: { variantId: string; qty: number }[];
};

export type OrderLineDto = {
  id: string;
  productName: string;
  type: string;
  sku: string | null;
  qty: number;
  unitPrice: number;
  lineTotal: number;
};

export type OrderDto = {
  id: string;
  orderNumber: number;
  placedAt: string;
  customerName: string;
  phone: string;
  shippingAddress: string;
  city: string;
  payment: PaymentMethod;
  status: Order["status"];
  subtotal: number;
  total: number;
  lines: OrderLineDto[];
};

function mapOrder(dto: OrderDto): Order {
  return {
    id: dto.id,
    orderNumber: dto.orderNumber,
    placedAt: dto.placedAt,
    customerName: dto.customerName,
    phone: dto.phone,
    shippingAddress: dto.shippingAddress,
    city: dto.city,
    payment: dto.payment,
    status: dto.status,
    subtotal: dto.subtotal,
    total: dto.total,
    lines: dto.lines.map((l) => ({
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

export async function postOrder(body: CreateOrderRequest): Promise<Order> {
  const { data } = await api.post<OrderDto>("/orders", body);
  return mapOrder(data);
}

export async function fetchOrders(params?: {
  skip?: number;
  take?: number;
}): Promise<Order[]> {
  const { data } = await api.get<OrderDto[]>("/orders", { params });
  return data.map(mapOrder);
}

export async function patchOrderStatus(
  orderId: string,
  status: Order["status"],
): Promise<Order> {
  const { data } = await api.patch<OrderDto>(`/orders/${orderId}`, { status });
  return mapOrder(data);
}
