export type CategoryId = "three-piece" | "two-piece" | "separates";

export interface ProductVariant {
  id: string;
  sku: string | null;
  stock: number;
  /** Customer-facing unit price (from variant `salePrice` in the API). */
  salePrice: number;
  /** Real URL or internal placeholder sentinel (see `productImagePlaceholderUrl`). */
  imageUrl: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  mainCategory: "Unstitched";
  subCategory: "3 PC" | "2 PC" | "Separates";
  categoryId: CategoryId;
  /** Primary display price (first variant after sort); use variant `salePrice` when a variant is selected. */
  regularPrice: number;
  isNew: boolean;
  variants: ProductVariant[];
  /** Gallery images (first variant often used as hero) */
  images: string[];
}

export type PaymentMethod = "cod" | "online";

export type OrderStatus = "pending" | "shipped" | "delivered";

export interface OrderLine {
  id?: string;
  productName: string;
  type: string;
  /** Optional SKU for the line item */
  sku?: string | null;
  qty: number;
  unitPrice?: number;
  lineTotal?: number;
}

export interface Order {
  id: string;
  /** Monotonic display number from the server */
  orderNumber: number;
  placedAt: string;
  customerName: string;
  phone: string;
  lines: OrderLine[];
  payment: PaymentMethod;
  status: OrderStatus;
  shippingAddress: string;
  city: string;
  subtotal: number;
  total: number;
}
