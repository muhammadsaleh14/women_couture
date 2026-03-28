import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/core/components/ui/carousel";
import { useGetProducts } from "@/core/api/generated/api";
import { Label } from "@/core/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/core/components/ui/select";
import { mapProductWithVariantsToStorefront } from "@/modules/product/infrastructure/mapProductWithVariantsToStorefront";
import { ProductCard } from "@/modules/product/presentation/ProductCard";
import { HomeHeroCard } from "@/pages/storefront/components/HomeHeroCard";
import type { CategoryId, Product } from "@/shared/model/types";

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

export function HomePage() {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  const categoryFilter =
    categoryParam && isCategoryId(categoryParam) ? categoryParam : null;
  const invalidCategory = Boolean(categoryParam && !categoryFilter);

  const [sort, setSort] = useState("new");
  const [colorFilter, setColorFilter] = useState<string>("all");

  useEffect(() => {
    setColorFilter("all");
    setSort("new");
  }, [categoryFilter]);

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

  const categoryRaw = useMemo(() => {
    if (!categoryFilter) return [];
    return allProducts.filter((p) => p.categoryId === categoryFilter);
  }, [allProducts, categoryFilter]);

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
      <div className="space-y-6">
        <div>
          <ButtonLink />
          <h1 className="mt-3 text-xl font-semibold text-stone-900">
            {CATEGORY_LABEL[categoryFilter]}
          </h1>
          <p className="mt-1 text-sm text-stone-600">
            {filteredCategory.length} piece
            {filteredCategory.length === 1 ? "" : "s"}
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
          {filteredCategory.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <section>
        <Carousel className="w-full">
          <CarouselContent>
            <CarouselItem>
              <HomeHeroCard
                variant="light"
                titleAs="h1"
                eyebrow="New Arrivals"
                title="Summer lawn & chiffon — fresh drops weekly"
                description="Browse our unstitched and ready-to-wear pieces below."
              />
            </CarouselItem>
            <CarouselItem>
              <HomeHeroCard
                variant="dark"
                eyebrow="2 Piece & separates"
                title="Easy summer kurta sets"
              />
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious className="left-2 hidden sm:flex" />
          <CarouselNext className="right-2 hidden sm:flex" />
        </Carousel>
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

function ButtonLink() {
  return (
    <Link
      to="/"
      className="text-sm font-medium text-stone-700 underline-offset-4 hover:underline"
    >
      ← All products
    </Link>
  );
}
