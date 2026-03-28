import type { Order } from "@/shared/model/types";

export const mockOrders: Order[] = [
  {
    id: "ord-1001",
    placedAt: new Date(Date.now() - 3600_000 * 5).toISOString(),
    customerName: "Ayesha Khan",
    phone: "+92 300 1234567",
    lines: [
      {
        productName: "Embroidered Lawn 3PC",
        type: "3 PC",
        sku: "LWN-NVY-01",
        qty: 1,
      },
    ],
    payment: "cod",
    status: "pending",
    shippingAddress: "House 12, Street 4, DHA Phase 5",
    city: "Lahore",
  },
  {
    id: "ord-1002",
    placedAt: new Date(Date.now() - 3600_000 * 28).toISOString(),
    customerName: "Sara Malik",
    phone: "+92 321 9876543",
    lines: [
      {
        productName: "Chiffon Dupatta Set",
        type: "3 PC",
        sku: "CHF-MRN-12",
        qty: 2,
      },
      {
        productName: "Cotton Trouser Separate",
        type: "Separates",
        sku: "TRS-WHT-9",
        qty: 1,
      },
    ],
    payment: "online",
    status: "shipped",
    shippingAddress: "Apartment 3B, Clifton Block 8",
    city: "Karachi",
  },
  {
    id: "ord-1003",
    placedAt: new Date(Date.now() - 3600_000 * 72).toISOString(),
    customerName: "Fatima Noor",
    phone: "+92 333 5557788",
    lines: [
      {
        productName: "Printed 2PC Kurta",
        type: "2 PC",
        sku: "2PC-TEAL-3",
        qty: 1,
      },
    ],
    payment: "cod",
    status: "delivered",
    shippingAddress: "Street 21, G-10/4",
    city: "Islamabad",
  },
];
