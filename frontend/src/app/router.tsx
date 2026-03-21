import { createBrowserRouter, Navigate } from "react-router-dom";
import { ROUTES } from "@/core/routes";
import { AdminLayout } from "@/shared/components/layout/AdminLayout";
import { StorefrontLayout } from "@/shared/components/layout/StorefrontLayout";
import { AdminOrdersPage } from "@/features/admin/pages/AdminOrdersPage";
import { AdminProductFormPage } from "@/features/admin/pages/AdminProductFormPage";
import { AdminProductsPage } from "@/features/admin/pages/AdminProductsPage";
import { CartPage } from "@/features/storefront/pages/CartPage";
import { CategoryPage } from "@/features/storefront/pages/CategoryPage";
import { HomePage } from "@/features/storefront/pages/HomePage";
import { ProductDetailPage } from "@/features/storefront/pages/ProductDetailPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <StorefrontLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "shop/:categoryId", element: <CategoryPage /> },
      { path: "product/:productId", element: <ProductDetailPage /> },
      { path: "cart", element: <CartPage /> },
    ],
  },
  {
    path: ROUTES.admin.root,
    element: <AdminLayout />,
    children: [
      { index: true, element: <Navigate to={ROUTES.admin.products} replace /> },
      {
        path: "inventory",
        element: <Navigate to={ROUTES.admin.products} replace />,
      },
      { path: "products", element: <AdminProductsPage /> },
      { path: "products/new", element: <AdminProductFormPage /> },
      { path: "products/:productId/edit", element: <AdminProductFormPage /> },
      { path: "orders", element: <AdminOrdersPage /> },
    ],
  },
]);
