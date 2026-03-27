import { createBrowserRouter, Navigate } from "react-router-dom";
import { ROUTES } from "@/core/routes";
import { RootLayout } from "@/app/root-layout";
import { RequireRole } from "@/modules/auth/application/RequireRole";
import { LoginPage } from "@/modules/auth/presentation/LoginPage";
import { AdminLayout } from "@/shared/components/layout/AdminLayout";
import { StorefrontLayout } from "@/shared/components/layout/StorefrontLayout";
import { AdminOrdersPage } from "@/pages/admin/AdminOrdersPage";
import { AdminProductFormPage } from "@/pages/admin/AdminProductFormPage";
import { AdminProductsPage } from "@/pages/admin/AdminProductsPage";
import { CartPage } from "@/pages/storefront/CartPage";
import { CategoryPage } from "@/pages/storefront/CategoryPage";
import { HomePage } from "@/pages/storefront/HomePage";
import { ProductDetailPage } from "@/pages/storefront/ProductDetailPage";

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "login", element: <LoginPage /> },
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
        path: "admin",
        element: (
          <RequireRole role="ADMIN">
            <AdminLayout />
          </RequireRole>
        ),
        children: [
          {
            index: true,
            element: <Navigate to={ROUTES.admin.products} replace />,
          },
          {
            path: "inventory",
            element: <Navigate to={ROUTES.admin.products} replace />,
          },
          { path: "products", element: <AdminProductsPage /> },
          { path: "products/new", element: <AdminProductFormPage /> },
          {
            path: "products/:productId/edit",
            element: <AdminProductFormPage />,
          },
          { path: "orders", element: <AdminOrdersPage /> },
        ],
      },
    ],
  },
]);
