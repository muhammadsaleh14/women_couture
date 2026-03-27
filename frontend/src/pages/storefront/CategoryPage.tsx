import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/core/components/ui/select";
import { Label } from "@/core/components/ui/label";
import type { CategoryId, Product } from "@/shared/model/types";
import { getProductsByCategory } from "@/modules/product/infrastructure/mock-products";
import { ProductCard } from "@/modules/product/presentation/ProductCard";

const CATEGORY_LABEL: Record<CategoryId, string> = {
  "three-piece": "Unstitched · 3 PC",
  "two-piece": "Unstitched · 2 PC",
  separates: "Separates",
};

function isCategoryId(v: string): v is CategoryId {
  return v === "three-piece" || v === "two-piece" || v === "separates";
}

function sortProducts(list: Product[], sort: string) {
  const next = [...list];
  if (sort === "new") {
    next.sort((a, b) => Number(b.isNew) - Number(a.isNew));
  }
  if (sort === "price-asc") {
    next.sort(
      (a, b) =>
        (a.salePrice ?? a.regularPrice) - (b.salePrice ?? b.regularPrice),
    );
  }
  if (sort === "price-desc") {
    next.sort(
      (a, b) =>
        (b.salePrice ?? b.regularPrice) - (a.salePrice ?? a.regularPrice),
    );
  }
  return next;
}

export function CategoryPage() {
  const { categoryId = "" } = useParams();
  const [sort, setSort] = useState("new");
  const [colorFilter, setColorFilter] = useState<string>("all");

  const valid = isCategoryId(categoryId);
  const raw = valid ? getProductsByCategory(categoryId) : [];

  const colors = useMemo(() => {
    const set = new Set<string>();
    raw.forEach((p) => p.variants.forEach((v) => set.add(v.colorName)));
    return Array.from(set).sort();
  }, [raw]);

  const filtered = useMemo(() => {
    let list = raw;
    if (colorFilter !== "all") {
      list = list.filter((p) =>
        p.variants.some((v) => v.colorName === colorFilter),
      );
    }
    return sortProducts(list, sort);
  }, [raw, colorFilter, sort]);

  if (!valid) {
    return (
      <p className="text-center text-sm text-stone-600">Category not found.</p>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-stone-900">
          {CATEGORY_LABEL[categoryId]}
        </h1>
        <p className="mt-1 text-sm text-stone-600">
          {filtered.length} piece{filtered.length === 1 ? "" : "s"}
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="space-y-1.5">
          <Label htmlFor="sort" className="text-xs text-stone-500">
            Sort
          </Label>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger id="sort" className="w-full sm:w-44">
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
          <Label htmlFor="color" className="text-xs text-stone-500">
            Filter by color
          </Label>
          <Select value={colorFilter} onValueChange={setColorFilter}>
            <SelectTrigger id="color" className="w-full sm:w-44">
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
        {filtered.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
