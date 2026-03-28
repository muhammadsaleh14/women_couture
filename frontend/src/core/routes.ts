export const ROUTES = {
  login: "/login",
  home: "/",
  shop: (categoryId: string) => `/shop/${categoryId}` as const,
  product: (productId: string) => `/product/${productId}` as const,
  cart: "/cart",
  admin: {
    root: "/admin",
    products: "/admin/products",
    productNew: "/admin/products/new",
    productEdit: (productId: string) =>
      `/admin/products/${productId}/edit` as const,
    orders: "/admin/orders",
    /** @deprecated use `stock` — kept for old links */
    inventory: "/admin/inventory",
    stock: "/admin/stock",
  },
} as const;
