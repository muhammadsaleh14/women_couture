import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/core/components/ui/carousel";
import { useGetProducts } from "@/core/api/generated/api";
import { mapProductWithVariantsToStorefront } from "@/modules/product/infrastructure/mapProductWithVariantsToStorefront";
import { ProductCard } from "@/modules/product/presentation/ProductCard";
import { ButtonLink } from "./ButtonLink";
import { CategoryFilterBar } from "./CategoryFilterBar";
import { HomeCategoryBrowse } from "./HomeCategoryBrowse";
import { HomeHeroCarousel } from "./HomeHeroCarousel";
import { isCategoryId } from "./homeCategory";

export function HomePage() {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  const categoryFilter =
    categoryParam && isCategoryId(categoryParam) ? categoryParam : null;
  const invalidCategory = Boolean(categoryParam && !categoryFilter);

  const { data: apiProducts = [], isLoading, isError } = useGetProducts({
    isActive: "true",
    take: 100,
  });

  const allProducts = useMemo(
    () =>
      apiProducts
        .filter((p) => p.isActive)
        .map(mapProductWithVariantsToStorefront),
    [apiProducts],
  );

  if (invalidCategory) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-sm text-stone-600">Category not found.</p>
        <ButtonLink />
      </div>
    );
  }

  if (categoryFilter) {
    if (isLoading) {
      return (
        <p className="text-center text-sm text-stone-600">Loading…</p>
      );
    }
    if (isError) {
      return (
        <p className="text-center text-sm text-destructive">
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
    <div className="space-y-10">
      <HomeHeroCarousel />

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-stone-900">
          Shop by category
        </h2>
        <CategoryFilterBar activeId={null} />
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-stone-900">Products</h2>
        {isLoading && (
          <p className="text-sm text-stone-500">Loading products…</p>
        )}
        {isError && (
          <p className="text-sm text-destructive">
            Could not load products. Check that the API is running.
          </p>
        )}
        {!isLoading && !isError && allProducts.length === 0 && (
          <p className="text-sm text-stone-600">No active products yet.</p>
        )}
        {!isLoading && !isError && allProducts.length > 0 && (
          <Carousel opts={{ align: "start", dragFree: true }} className="w-full">
            <CarouselContent className="-ml-2">
              {allProducts.map((p) => (
                <CarouselItem
                  key={p.id}
                  className="basis-[70%] pl-2 sm:basis-[45%] md:basis-[33%]"
                >
                  <ProductCard product={p} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        )}
      </section>
    </div>
  );
}
