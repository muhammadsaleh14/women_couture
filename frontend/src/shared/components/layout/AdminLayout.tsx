import { Suspense } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { LayoutTemplate, Package, ShoppingCart } from "lucide-react";
import { Button } from "@/core/components/ui/button";
import { Separator } from "@/core/components/ui/separator";
import { ROUTES } from "@/core/routes";
import { useAuth } from "@/modules/auth/application/use-auth";
import { ThemeToggle } from "@/core/components/theme/ThemeToggle";
import { cn } from "@/core/lib/utils";
import { PageLoadingFallback } from "@/app/page-loading-fallback";
import { AdminNotificationBell } from "@/modules/notification/presentation/AdminNotificationBell";

const nav = [
  { to: ROUTES.admin.products, label: "Products / Suits", icon: Package },
  { to: ROUTES.admin.homeHero, label: "Home hero", icon: LayoutTemplate },
  { to: ROUTES.admin.orders, label: "Orders", icon: ShoppingCart },
];

export function AdminLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-56 shrink-0 flex-col border-r border-border bg-card md:flex">
        <div className="flex items-start justify-between gap-2 p-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Admin
            </p>
            <p className="text-lg font-semibold text-foreground">Dashboard</p>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <AdminNotificationBell />
            <ThemeToggle className="size-8" />
          </div>
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
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                )
              }
            >
              <Icon className="size-4 shrink-0" aria-hidden />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto space-y-2 border-t border-border p-3">
          {user && (
            <p className="truncate px-1 text-xs text-muted-foreground">
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
        <div className="border-b border-border bg-card px-4 py-3 md:hidden">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-foreground">Admin</p>
            <div className="flex items-center gap-1">
              <AdminNotificationBell />
              <ThemeToggle className="size-8" />
            </div>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {nav.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  cn(
                    "rounded-full px-3 py-1 text-xs font-medium",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground",
                  )
                }
              >
                {label}
              </NavLink>
            ))}
          </div>
        </div>
        <div className="p-4 md:p-8">
          <Suspense fallback={<PageLoadingFallback />}>
            <Outlet />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
