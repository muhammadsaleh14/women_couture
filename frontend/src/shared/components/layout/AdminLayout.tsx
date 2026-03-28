import { Link, NavLink, Outlet } from "react-router-dom";
import { Package, ShoppingCart, Warehouse } from "lucide-react";
import { Button } from "@/core/components/ui/button";
import { Separator } from "@/core/components/ui/separator";
import { ROUTES } from "@/core/routes";
import { useAuth } from "@/modules/auth/application/use-auth";
import { cn } from "@/core/lib/utils";

const nav = [
  { to: ROUTES.admin.products, label: "Products / Suits", icon: Package },
  { to: ROUTES.admin.stock, label: "Stock", icon: Warehouse },
  { to: ROUTES.admin.orders, label: "Orders", icon: ShoppingCart },
];

export function AdminLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-screen bg-stone-100">
      <aside className="hidden w-56 shrink-0 flex-col border-r border-stone-200 bg-white md:flex">
        <div className="p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            Admin
          </p>
          <p className="text-lg font-semibold text-stone-900">Dashboard</p>
        </div>
        <Separator />
        <nav className="flex flex-1 flex-col gap-0.5 p-2">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-stone-900 text-white"
                    : "text-stone-700 hover:bg-stone-100",
                )
              }
            >
              <Icon className="size-4 shrink-0" aria-hidden />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto space-y-2 border-t border-stone-200 p-3">
          {user && (
            <p className="truncate px-1 text-xs text-stone-600">
              {user.username}
            </p>
          )}
          <Button variant="outline" size="sm" className="w-full" asChild>
            <Link to={ROUTES.home}>View storefront</Link>
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="w-full"
            onClick={() => logout()}
          >
            Log out
          </Button>
        </div>
      </aside>
      <div className="min-w-0 flex-1">
        <div className="border-b border-stone-200 bg-white px-4 py-3 md:hidden">
          <p className="text-sm font-semibold text-stone-900">Admin</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {nav.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  cn(
                    "rounded-full px-3 py-1 text-xs font-medium",
                    isActive
                      ? "bg-stone-900 text-white"
                      : "bg-stone-100 text-stone-800",
                  )
                }
              >
                {label}
              </NavLink>
            ))}
          </div>
        </div>
        <div className="p-4 md:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
