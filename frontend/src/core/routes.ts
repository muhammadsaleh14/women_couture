export const ROUTES = {
  login: "/login",
  home: "/",
  /** Category browse uses the home page with a query param. */
  shop: (categoryId: string) =>
    `/?category=${encodeURIComponent(categoryId)}` as const,
  product: (productId: string) => `/product/${productId}` as const,
  productDetail: (productId: string, variantId?: string | null) =>
    variantId
      ? (`/product/${productId}?variant=${encodeURIComponent(variantId)}` as const)
      : (`/product/${productId}` as const),
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
    homeHero: "/admin/home-hero",
  },
} as const;
