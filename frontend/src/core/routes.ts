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
    order: (orderId: string) => `/admin/orders/${orderId}` as const,
    /** @deprecated redirects to products */
    inventory: "/admin/inventory",
    /** @deprecated redirects to products */
    stock: "/admin/stock",
    variantStockMoves: (variantId: string) =>
      `/admin/variants/${encodeURIComponent(variantId)}/stock-moves` as const,
    homeHero: "/admin/home-hero",
    homeHeroNew: "/admin/home-hero/new",
    homeHeroEdit: (slideId: string) =>
      `/admin/home-hero/${encodeURIComponent(slideId)}/edit` as const,
  },
} as const;
