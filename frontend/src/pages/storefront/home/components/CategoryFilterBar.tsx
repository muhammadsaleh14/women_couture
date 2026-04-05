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
        "rounded-2xl border border-border/70 bg-muted/35 p-2 shadow-sm dark:border-border/60 dark:bg-muted/25",
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
              <span className="font-semibold tracking-tight">All</span>
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
              <span className="font-semibold tracking-tight">{title}</span>
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
      className={cn(
        "min-h-13 min-w-27 flex-1 basis-[calc(50%-0.25rem)] rounded-xl px-3 py-2.5 text-sm transition-all duration-200 sm:basis-auto sm:flex-initial",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        selected
          ? "border border-primary/20 bg-primary text-primary-foreground shadow-md ring-1 ring-primary/30"
          : "border border-transparent bg-background/90 text-foreground hover:border-border hover:bg-background hover:shadow-sm dark:bg-card/60 dark:hover:bg-card",
      )}
    >
      {children}
    </Link>
  );
}
