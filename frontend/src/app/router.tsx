/* eslint-disable react-refresh/only-export-components -- route table + lazy imports are not Fast Refresh components */
import { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { ROUTES } from "@/core/routes";
import { RootLayout } from "@/app/root-layout";
import { SuspensePage } from "@/app/page-loading-fallback";
import { RequireRole } from "@/modules/auth/application/RequireRole";
import { StorefrontLayout } from "@/shared/components/layout/StorefrontLayout";
import { HomePage } from "@/pages/storefront/home/HomePage";
import { CartPage } from "@/pages/storefront/CartPage";
import { ProductDetailPage } from "@/pages/storefront/ProductDetailPage";

const LoginPage = lazy(() =>
  import("@/modules/auth/presentation/LoginPage").then((m) => ({
    default: m.LoginPage,
  })),
);

const AdminLayout = lazy(() =>
  import("@/shared/components/layout/AdminLayout").then((m) => ({
    default: m.AdminLayout,
  })),
);

const AdminOrdersPage = lazy(() =>
  import("@/pages/admin/AdminOrdersPage").then((m) => ({
    default: m.AdminOrdersPage,
  })),
);

const AdminProductFormPage = lazy(() =>
  import("@/pages/admin/AdminProductFormPage").then((m) => ({
    default: m.AdminProductFormPage,
  })),
);

const AdminProductsPage = lazy(() =>
  import("@/pages/admin/AdminProductsPage").then((m) => ({
    default: m.AdminProductsPage,
  })),
);

const AdminHomeHeroPage = lazy(() =>
  import("@/pages/admin/AdminHomeHeroPage").then((m) => ({
    default: m.AdminHomeHeroPage,
  })),
);

const AdminStockPage = lazy(() =>
  import("@/pages/admin/AdminStockPage").then((m) => ({
    default: m.AdminStockPage,
  })),
);

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "login",
        element: (
          <SuspensePage>
            <LoginPage />
          </SuspensePage>
        ),
      },
      {
        path: "/",
        element: <StorefrontLayout />,
        children: [
          { index: true, element: <HomePage /> },
          { path: "product/:productId", element: <ProductDetailPage /> },
          { path: "cart", element: <CartPage /> },
        ],
      },
      {
        path: "admin",
        element: (
          <RequireRole role="ADMIN">
            <SuspensePage>
              <AdminLayout />
            </SuspensePage>
          </RequireRole>
        ),
        children: [
          {
            index: true,
            element: <Navigate to={ROUTES.admin.products} replace />,
          },
          {
            path: "inventory",
            element: <Navigate to={ROUTES.admin.stock} replace />,
          },
          { path: "stock", element: <AdminStockPage /> },
          { path: "home-hero", element: <AdminHomeHeroPage /> },
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
