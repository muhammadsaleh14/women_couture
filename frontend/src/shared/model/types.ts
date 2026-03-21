export type CategoryId = "three-piece" | "two-piece" | "separates";

export interface ProductVariant {
  id: string;
  colorName: string;
  hex: string;
  stock: number;
  imageUrl: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  mainCategory: "Unstitched";
  subCategory: "3 PC" | "2 PC" | "Separates";
  categoryId: CategoryId;
  regularPrice: number;
  salePrice?: number;
  isNew: boolean;
  variants: ProductVariant[];
  /** Gallery images (first variant often used as hero) */
  images: string[];
}

export type PaymentMethod = "cod" | "online";

export type OrderStatus = "pending" | "shipped" | "delivered";

export interface OrderLine {
  productName: string;
  type: string;
  color: string;
  qty: number;
}

export interface Order {
  id: string;
  placedAt: string;
  customerName: string;
  phone: string;
  lines: OrderLine[];
  payment: PaymentMethod;
  status: OrderStatus;
  shippingAddress: string;
  city: string;
}
