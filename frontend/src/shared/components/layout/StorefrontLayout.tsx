import { Link, Outlet } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/core/components/ui/button";
import { Separator } from "@/core/components/ui/separator";
import { ROUTES } from "@/core/routes";
import { useAuth } from "@/modules/auth/application/use-auth";
import { useCartStore } from "@/modules/cart/application/cart-store";
import { ThemeToggle } from "@/core/components/theme/ThemeToggle";
import { WhatsAppFab } from "./WhatsAppFab";

export function StorefrontLayout() {
  const { user, logout } = useAuth();
  const count = useCartStore((s) => s.lines.reduce((n, l) => n + l.qty, 0));

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
        <div className="mx-auto flex h-14 max-w-lg items-center justify-between gap-2 px-4 sm:max-w-3xl lg:max-w-5xl">
          <Link
            to={ROUTES.home}
            className="text-sm font-semibold tracking-wide text-foreground"
          >
            Women Couture
          </Link>
          <div className="flex flex-wrap items-center justify-end gap-1 sm:gap-2">
            <ThemeToggle />
            {user ? (
              <>
                <span className="hidden max-w-32 truncate text-xs text-muted-foreground sm:inline">
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
      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col min-h-0 px-4 py-6 sm:max-w-3xl lg:max-w-5xl">
        {/*
          Flex chain: min-h-0 lets flex-1 children get a real height so nested
          pages (e.g. home backdrop with absolute inset-0) can fill the column.
        */}
        <div className="flex w-full min-h-0 flex-1 flex-col">
          <Outlet />
        </div>
      </main>
      <WhatsAppFab />
    </div>
  );
}
