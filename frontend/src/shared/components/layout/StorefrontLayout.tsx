import { Link, Outlet } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/core/components/ui/button";
import { Separator } from "@/core/components/ui/separator";
import { ROUTES } from "@/core/routes";
import { useAuth } from "@/modules/auth/application/use-auth";
import { useCartStore } from "@/modules/cart/application/cart-store";
import { WhatsAppFab } from "./WhatsAppFab";

export function StorefrontLayout() {
  const { user, logout } = useAuth();
  const count = useCartStore((s) => s.lines.reduce((n, l) => n + l.qty, 0));

  return (
    <div className="flex min-h-screen flex-col bg-stone-50">
      <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-stone-50/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-lg items-center justify-between gap-2 px-4 sm:max-w-3xl lg:max-w-5xl">
          <Link
            to={ROUTES.home}
            className="text-sm font-semibold tracking-wide text-stone-900"
          >
            Women Couture
          </Link>
          <div className="flex flex-wrap items-center justify-end gap-1 sm:gap-2">
            {user ? (
              <>
                <span className="hidden max-w-32 truncate text-xs text-stone-600 sm:inline">
                  {user.username}
                </span>
                {user.role === "ADMIN" && (
                  <Button variant="ghost" size="sm" asChild>
                    <Link to={ROUTES.admin.products}>Admin</Link>
                  </Button>
                )}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => logout()}
                >
                  Log out
                </Button>
              </>
            ) : (
              <Button variant="ghost" size="sm" asChild>
                <Link to={ROUTES.login}>Sign in</Link>
              </Button>
            )}
            <Button variant="ghost" size="sm" asChild className="gap-1.5">
              <Link to={ROUTES.cart}>
                <ShoppingBag className="size-4" aria-hidden />
                <span className="tabular-nums">
                  Cart{count > 0 ? ` (${count})` : ""}
                </span>
              </Link>
            </Button>
          </div>
        </div>
        <Separator />
      </header>
      <main className="mx-auto w-full max-w-lg flex-1 px-4 py-6 sm:max-w-3xl lg:max-w-5xl">
        <Outlet />
      </main>
      <WhatsAppFab />
    </div>
  );
}
