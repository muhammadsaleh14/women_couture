import { useMemo, useState } from "react";
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
import { ButtonLink } from "./ButtonLink";
import { CategoryFilterBar } from "./CategoryFilterBar";
import { CATEGORY_LABEL, sortProducts } from "./homeCategory";

type Props = {
  categoryFilter: CategoryId;
  allProducts: Product[];
};

export function HomeCategoryBrowse({ categoryFilter, allProducts }: Props) {
  const [sort, setSort] = useState("new");
  const [colorFilter, setColorFilter] = useState<string>("all");

  const categoryRaw = useMemo(
    () => allProducts.filter((p) => p.categoryId === categoryFilter),
    [allProducts, categoryFilter],
  );

  const colors = useMemo(() => {
    const set = new Set<string>();
    categoryRaw.forEach((p) =>
      p.variants.forEach((v) => set.add(v.colorName)),
    );
    return Array.from(set).sort();
  }, [categoryRaw]);

  const filteredCategory = useMemo(() => {
    let list = categoryRaw;
    if (colorFilter !== "all") {
      list = list.filter((p) =>
        p.variants.some((v) => v.colorName === colorFilter),
      );
    }
    return sortProducts(list, sort);
  }, [categoryRaw, colorFilter, sort]);

  return (
    <div className="flex w-full min-h-0 flex-1 flex-col space-y-6 px-4 sm:px-6 lg:px-8">
      <div>
        <ButtonLink />
        <CategoryFilterBar activeId={categoryFilter} className="mt-4" />
        <h1 className="mt-3 text-xl font-semibold text-foreground">
          {CATEGORY_LABEL[categoryFilter]}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {filteredCategory.length} piece
          {filteredCategory.length === 1 ? "" : "s"}
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="space-y-1.5">
          <Label htmlFor="home-sort" className="text-xs text-muted-foreground">
            Sort
          </Label>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger id="home-sort" className="w-full sm:w-44">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">Newest first</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label
            htmlFor="home-color"
            className="text-xs text-muted-foreground"
          >
            Filter by color
          </Label>
          <Select value={colorFilter} onValueChange={setColorFilter}>
            <SelectTrigger id="home-color" className="w-full sm:w-44">
              <SelectValue placeholder="Color" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All colors</SelectItem>
              {colors.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
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
