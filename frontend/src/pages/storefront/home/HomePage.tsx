import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useGetProducts } from "@/core/api/generated/api";
import { mapProductWithVariantsToStorefront } from "@/modules/product/infrastructure/mapProductWithVariantsToStorefront";
import { ProductCard } from "@/modules/product/presentation/ProductCard";
import { ButtonLink } from "./components/ButtonLink";
import { CategoryFilterBar } from "./components/CategoryFilterBar";
import { HomeCategoryBrowse } from "./components/HomeCategoryBrowse";
import { HomeHeroCarousel } from "./components/HomeHeroCarousel";
import { HomePageMathBackdrop } from "./components/HomePageMathBackdrop";
import { isCategoryId } from "./components/homeCategory";

export function HomePage() {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  const categoryFilter =
    categoryParam && isCategoryId(categoryParam) ? categoryParam : null;
  const invalidCategory = Boolean(categoryParam && !categoryFilter);

  const { data, isLoading, isError } = useGetProducts({
    isActive: "true",
    take: 100,
  });

  const apiProducts = data?.items ?? [];

  const allProducts = useMemo(
    () =>
      apiProducts
        .filter((p) => p.isActive)
        .map(mapProductWithVariantsToStorefront),
    [apiProducts],
  );

  if (invalidCategory) {
    return (
      <div className="flex flex-1 flex-col space-y-4 px-4 text-center sm:px-6 lg:px-8">
        <p className="text-sm text-muted-foreground">Category not found.</p>
        <ButtonLink />
      </div>
    );
  }

  if (categoryFilter) {
    if (isLoading) {
      return (
        <p className="flex flex-1 justify-center px-4 pt-8 text-center text-sm text-muted-foreground sm:px-6 lg:px-8">
          Loading…
        </p>
      );
    }
    if (isError) {
      return (
        <p className="flex flex-1 justify-center px-4 pt-8 text-center text-sm text-destructive sm:px-6 lg:px-8">
          Could not load products.
        </p>
      );
    }

    return (
      <HomeCategoryBrowse
        key={categoryFilter}
        categoryFilter={categoryFilter}
        allProducts={allProducts}
      />
    );
  }

  return (
    <div className="relative isolate flex w-full min-h-0 flex-1 flex-col">
      <HomePageMathBackdrop />
      <div className="relative z-10 w-full">
        <HomeHeroCarousel />
      </div>
      <div className="relative z-10 flex min-h-0 flex-1 flex-col space-y-10 px-4 pt-10 sm:px-6 lg:px-8">
        <section className="space-y-4">
          <div className="space-y-1.5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Browse
            </p>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Shop by category
            </h2>
          </div>
          <CategoryFilterBar activeId={null} />
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Products
          </h2>
          {isLoading && (
            <p className="text-sm text-muted-foreground">Loading products…</p>
          )}
          {isError && (
            <p className="text-sm text-destructive">
              Could not load products. Check that the API is running.
            </p>
          )}
          {!isLoading && !isError && allProducts.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No active products yet.
            </p>
          )}
          {!isLoading && !isError && allProducts.length > 0 && (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {allProducts.map((p) => (
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
