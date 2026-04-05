import { useMemo, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Label } from "@/core/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/core/components/ui/select";
import { ProductCard } from "@/modules/product/presentation/ProductCard";
import type { CategoryId, Product } from "@/shared/model/types";
import { cn } from "@/core/lib/utils";
import { ButtonLink } from "./ButtonLink";
import { CategoryFilterBar } from "./CategoryFilterBar";
import { CATEGORY_LABEL, sortProducts } from "./homeCategory";

type Props = {
  categoryFilter: CategoryId;
  allProducts: Product[];
};

export function HomeCategoryBrowse({ categoryFilter, allProducts }: Props) {
  const [sort, setSort] = useState("new");

  const categoryRaw = useMemo(
    () => allProducts.filter((p) => p.categoryId === categoryFilter),
    [allProducts, categoryFilter],
  );

  const filteredCategory = useMemo(
    () => sortProducts(categoryRaw, sort),
    [categoryRaw, sort],
  );

  const count = filteredCategory.length;
  const countLabel =
    count === 0
      ? "No pieces in this category yet"
      : `${count} ${count === 1 ? "piece" : "pieces"}`;

  return (
    <div className="flex w-full min-h-0 flex-1 flex-col gap-8 px-4 pb-10 sm:px-6 lg:px-8">
      <div className="space-y-5 pt-2">
        <ButtonLink />
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Shop by category
          </p>
          <CategoryFilterBar activeId={categoryFilter} />
        </div>
      </div>

      <div
        className={cn(
          "flex flex-col gap-5 border-b border-border/70 pb-8",
          "sm:flex-row sm:items-end sm:justify-between",
        )}
      >
        <div className="min-w-0 space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {CATEGORY_LABEL[categoryFilter]}
          </h1>
          <p className="text-sm text-muted-foreground">{countLabel}</p>
        </div>

        <div className="flex w-full flex-col gap-2 sm:w-auto sm:min-w-[12rem] sm:items-end">
          <Label
            htmlFor="home-sort"
            className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground"
          >
            <SlidersHorizontal className="size-3.5" aria-hidden />
            Sort by
          </Label>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger
              id="home-sort"
              className="h-10 w-full rounded-xl border-border/80 bg-background shadow-sm sm:w-52"
            >
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">Newest first</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {filteredCategory.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
