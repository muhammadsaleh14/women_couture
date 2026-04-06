import { Link, Outlet } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/core/components/ui/button";
import { Separator } from "@/core/components/ui/separator";
import { ROUTES } from "@/core/routes";
import { useAuth } from "@/modules/auth/application/use-auth";
import { useCartStore } from "@/modules/cart/application/cart-store";
import { ThemeToggle } from "@/core/components/theme/ThemeToggle";
import { WhatsAppFab } from "./WhatsAppFab";
import { StorefrontCartSheet } from "./StorefrontCartSheet";

export function StorefrontLayout() {
  const { user, logout } = useAuth();
  const count = useCartStore((s) => s.lines.reduce((n, l) => n + l.qty, 0));
  const openCartSheet = useCartStore((s) => s.openSheet);

  return (
    <div className="storefront-surface flex min-h-dvh flex-col bg-background antialiased">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/90 backdrop-blur-md supports-backdrop-filter:bg-background/75">
        <div className="mx-auto flex h-16 w-full max-w-[1600px] items-center justify-between gap-3 px-4 sm:h-[4.25rem] sm:px-6 lg:px-10">
          <Link
            to={ROUTES.home}
            className="font-display text-xl font-medium tracking-[0.22em] text-foreground sm:text-2xl"
          >
            WOMEN COUTURE
          </Link>
          <nav
            className="flex flex-wrap items-center justify-end gap-0.5 sm:gap-1"
            aria-label="Main navigation"
          >
            <ThemeToggle />
            {user ? (
              <>
                <span className="hidden max-w-32 truncate text-[11px] uppercase tracking-wider text-muted-foreground sm:inline">
                  {user.username}
                </span>
                {user.role === "ADMIN" && (
                  <Button variant="ghost" size="sm" className="text-xs uppercase tracking-wider" asChild>
                    <Link to={ROUTES.admin.products}>Admin</Link>
                  </Button>
                )}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-xs uppercase tracking-wider"
                  onClick={() => logout()}
                >
                  Log out
                </Button>
              </>
            ) : (
              <Button variant="ghost" size="sm" className="text-xs uppercase tracking-wider" asChild>
                <Link to={ROUTES.login}>Sign in</Link>
              </Button>
            )}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="gap-1.5 text-xs uppercase tracking-wider"
              onClick={() => openCartSheet()}
            >
              <ShoppingBag className="size-4" aria-hidden />
              <span className="tabular-nums">
                Cart{count > 0 ? ` (${count})` : ""}
              </span>
            </Button>
          </nav>
        </div>
        <Separator />
      </header>
      <main className="flex min-h-0 w-full flex-1 flex-col">
        {/*
          Full-width main so page backgrounds (e.g. home mesh) match the shell.
          Individual routes add horizontal padding where needed.
        */}
        <div className="flex min-h-0 w-full flex-1 flex-col">
          <Outlet />
        </div>
      </main>
      <WhatsAppFab />
      <StorefrontCartSheet />
    </div>
  );
}
