import type { CategoryId, Product } from "@/shared/model/types";

export const CATEGORY_LABEL: Record<CategoryId, string> = {
  "three-piece": "Unstitched · 3 PC",
  "two-piece": "Unstitched · 2 PC",
  separates: "Separates",
};

export const CATEGORY_NAV: { id: CategoryId; title: string; subtitle: string }[] =
  [
    { id: "three-piece", title: "3 Piece", subtitle: "Unstitched" },
    { id: "two-piece", title: "2 Piece", subtitle: "Co-ords" },
    { id: "separates", title: "Separates", subtitle: "Dupatta & more" },
  ];

export function isCategoryId(v: string): v is CategoryId {
  return v === "three-piece" || v === "two-piece" || v === "separates";
}

function catalogSortPrice(p: Product): number {
  const nums = p.variants
    .map((v) => v.salePrice)
    .filter((n) => n > 0 && Number.isFinite(n));
  return nums.length > 0 ? Math.min(...nums) : p.regularPrice;
}

export function sortProducts(list: Product[], sort: string): Product[] {
  const next = [...list];
  if (sort === "new") {
    next.sort((a, b) => Number(b.isNew) - Number(a.isNew));
  }
  if (sort === "price-asc") {
    next.sort((a, b) => catalogSortPrice(a) - catalogSortPrice(b));
  }
  if (sort === "price-desc") {
    next.sort((a, b) => catalogSortPrice(b) - catalogSortPrice(a));
  }
  return next;
}
