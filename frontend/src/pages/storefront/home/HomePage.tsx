import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal } from "lucide-react";
import { useGetProducts } from "@/core/api/generated/api";
import { mapProductWithVariantsToStorefront } from "@/modules/product/infrastructure/mapProductWithVariantsToStorefront";
import { ProductCard } from "@/modules/product/presentation/ProductCard";
import { Label } from "@/core/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/core/components/ui/select";
import { ButtonLink } from "./components/ButtonLink";
import { CategoryFilterBar } from "./components/CategoryFilterBar";
import { HomeHeroCarousel } from "./components/HomeHeroCarousel";
import { HomePageMathBackdrop } from "./components/HomePageMathBackdrop";
import {
  CATEGORY_LABEL,
  isCategoryId,
  sortProducts,
} from "./components/homeCategory";

export function HomePage() {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  const categoryFilter =
    categoryParam && isCategoryId(categoryParam) ? categoryParam : null;
  const invalidCategory = Boolean(categoryParam && !categoryFilter);

  const [sortByCategoryKey, setSortByCategoryKey] = useState<
    Record<string, string>
  >({});
  const sortStorageKey = categoryFilter ?? "__all__";
  const sort = sortByCategoryKey[sortStorageKey] ?? "new";
  const setSort = (value: string) => {
    setSortByCategoryKey((prev) => ({ ...prev, [sortStorageKey]: value }));
  };

  const productQueryParams = useMemo(
    () =>
      ({
        isActive: "true" as const,
        take: 100,
        ...(categoryFilter ? { category: categoryFilter } : {}),
      }) satisfies Parameters<typeof useGetProducts>[0],
    [categoryFilter],
  );

  const { data, isLoading, isError } = useGetProducts(productQueryParams);

  const mappedProducts = useMemo(() => {
    const items = data?.items ?? [];
    return items
      .filter((p) => p.isActive)
      .map(mapProductWithVariantsToStorefront);
  }, [data?.items]);

  const displayedProducts = useMemo(
    () => sortProducts(mappedProducts, sort),
    [mappedProducts, sort],
  );

  const count = displayedProducts.length;
  const countLabel =
    count === 0
      ? "No pieces yet"
      : `${count} ${count === 1 ? "piece" : "pieces"}`;

  if (invalidCategory) {
    return (
      <div className="flex flex-1 flex-col space-y-4 px-4 text-center sm:px-6 lg:px-8">
        <p className="text-sm text-muted-foreground">Category not found.</p>
        <ButtonLink />
      </div>
    );
  }

  return (
    <div className="relative isolate flex w-full min-h-0 flex-1 flex-col">
      <div className="relative isolate w-full">
        <HomePageMathBackdrop />
        <div className="relative z-10 w-full">
          <HomeHeroCarousel />
        </div>
      </div>

      <div className="relative z-10 flex min-h-0 flex-1 flex-col space-y-10 px-4 pb-10 pt-10 sm:px-6 lg:px-8">
        <section className="space-y-4">
          <div className="space-y-1.5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Browse
            </p>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Shop by category
            </h2>
          </div>
          <CategoryFilterBar activeId={categoryFilter} />
        </section>

        <section className="space-y-4">
          <div
            className="flex flex-col gap-5 border-b border-border/70 pb-8 sm:flex-row sm:items-end sm:justify-between"
          >
            <div className="min-w-0 space-y-1">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Products
              </h2>
              <p className="text-sm text-muted-foreground">
                {categoryFilter
                  ? `${CATEGORY_LABEL[categoryFilter]} · ${countLabel}`
                  : countLabel}
              </p>
            </div>
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:min-w-48 sm:items-end">
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

          {isLoading && (
            <p className="text-sm text-muted-foreground">Loading products…</p>
          )}
          {isError && (
            <p className="text-sm text-destructive">
              Could not load products. Check that the API is running.
            </p>
          )}
          {!isLoading && !isError && displayedProducts.length === 0 && (
            <p className="text-sm text-muted-foreground">
              {categoryFilter
                ? "No active products in this category yet."
                : "No active products yet."}
            </p>
          )}
          {!isLoading && !isError && displayedProducts.length > 0 && (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {displayedProducts.map((p) => (
                <li key={p.id} className="min-w-0">
                  <ProductCard product={p} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
