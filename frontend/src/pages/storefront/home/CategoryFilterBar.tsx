import { type ReactNode } from "react";
import { Link } from "react-router-dom";
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
    <div
      className={cn("flex flex-wrap gap-2", className)}
      role="navigation"
      aria-label="Product categories"
    >
      <CategoryPill to="/" selected={activeId === null}>
        All
      </CategoryPill>
      {CATEGORY_NAV.map(({ id, title, subtitle }) => (
        <CategoryPill
          key={id}
          to={ROUTES.shop(id)}
          selected={activeId === id}
        >
          <span className="block font-medium leading-tight">{title}</span>
          <span className="block text-xs font-normal opacity-80">
            {subtitle}
          </span>
        </CategoryPill>
      ))}
    </div>
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
        "rounded-lg border px-3 py-2 text-left text-sm transition-colors",
        selected
          ? "border-stone-900 bg-stone-900 text-white"
          : "border-stone-200 bg-white text-stone-800 hover:border-stone-300 hover:bg-stone-50",
      )}
    >
      {children}
    </Link>
  );
}
