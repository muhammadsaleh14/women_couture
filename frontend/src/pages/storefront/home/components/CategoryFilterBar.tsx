import { type ReactNode } from "react";
import { Link } from "react-router-dom";
import { LayoutGrid } from "lucide-react";
import { ROUTES } from "@/core/routes";
import { cn } from "@/core/lib/utils";
import type { CategoryId } from "@/shared/model/types";
import { CATEGORY_NAV } from "./homeCategory";

export function CategoryFilterBar({
  activeId,
  className,
}: {
  activeId: CategoryId | null;
  className?: string;
}) {
  return (
    <nav
      className={cn(
        "rounded-sm border border-border/60 bg-card/40 p-2 shadow-[var(--storefront-card-shadow)] backdrop-blur-sm dark:border-border/50 dark:bg-card/20",
        className,
      )}
      aria-label="Product categories"
    >
      <div className="flex flex-wrap gap-2">
        <CategoryPill to="/" selected={activeId === null}>
          <span className="flex items-center gap-2">
            <LayoutGrid
              className="size-4 shrink-0 opacity-70"
              aria-hidden
            />
            <span className="flex min-w-0 flex-col gap-0.5 text-left leading-tight">
              <span className="font-display text-base font-medium tracking-tight">
                All
              </span>
              <span className="text-[11px] font-normal opacity-80">
                Full catalog
              </span>
            </span>
          </span>
        </CategoryPill>
        {CATEGORY_NAV.map(({ id, title, subtitle }) => (
          <CategoryPill
            key={id}
            to={ROUTES.shop(id)}
            selected={activeId === id}
          >
            <span className="flex min-w-0 flex-col gap-0.5 text-left leading-tight">
              <span className="font-display text-base font-medium tracking-tight">
                {title}
              </span>
              <span className="text-[11px] font-normal opacity-80">
                {subtitle}
              </span>
            </span>
          </CategoryPill>
        ))}
      </div>
    </nav>
  );
}

function CategoryPill({
  to,
  selected,
  children,
}: {
  to: string;
  selected: boolean;
  children: ReactNode;
}) {
  return (
    <Link
      to={to}
      preventScrollReset
      className={cn(
        "min-h-13 min-w-27 flex-1 basis-[calc(50%-0.25rem)] rounded-sm px-3 py-2.5 text-sm transition-all duration-300 sm:basis-auto sm:flex-initial",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        selected
          ? "border border-primary/25 bg-primary text-primary-foreground shadow-[var(--storefront-card-shadow)]"
          : "border border-border/40 bg-background/80 text-foreground hover:border-primary/20 hover:bg-background hover:shadow-sm dark:bg-card/50 dark:hover:bg-card/80",
      )}
    >
      {children}
    </Link>
  );
}
