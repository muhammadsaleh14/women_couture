import { useEffect, useMemo, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/core/components/ui/button";
import { Input } from "@/core/components/ui/input";
import { Label } from "@/core/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/core/components/ui/select";
import { Switch } from "@/core/components/ui/switch";
import { Textarea } from "@/core/components/ui/textarea";
import { ROUTES } from "@/core/routes";
import {
  getGetHomeHeroSlidesManageQueryKey,
  getGetHomeHeroSlidesQueryKey,
  useGetHomeHeroSlidesManage,
  useGetProducts,
  usePatchHomeHeroSlidesSlideId,
  usePostHomeHeroSlides,
  type HomeHeroSlideRecord,
  type ProductImage,
  type ProductWithVariants,
} from "@/core/api/generated/api";
import { HomeHeroCard } from "@/pages/storefront/home/components/HomeHeroCard";
import { cn } from "@/core/lib/utils";
import { toast } from "sonner";
import {
  emptyHomeHeroFormValues,
  homeHeroSlideFormSchema,
  type HomeHeroSlideFormValues,
} from "./homeHeroSlideFormSchema";

type VariantOption = {
  id: string;
  label: string;
  productId: string;
  images: ProductImage[];
};

function findVariantInProducts(
  products: ProductWithVariants[],
  variantId: string,
): VariantOption | undefined {
  for (const p of products) {
    const v = p.variants?.find((x) => x.id === variantId);
    if (v) {
      const imgs = [...(v.images ?? [])].sort((a, b) => a.order - b.order);
      return {
        id: v.id,
        productId: p.id,
        label: v.sku ? `${p.name} · ${v.sku}` : p.name,
        images: imgs,
      };
    }
  }
  return undefined;
}

function recordToFormValues(
  s: HomeHeroSlideRecord,
  products: ProductWithVariants[],
): HomeHeroSlideFormValues {
  const variantId = s.productVariantId ?? "";
  let imageId = s.productImageId ?? "";
  if (variantId && !imageId) {
    const opt = findVariantInProducts(products, variantId);
    imageId = opt?.images[0]?.id ?? "";
  }
  return {
    theme: s.theme,
    usePrimaryHeading: s.usePrimaryHeading,
    isActive: s.isActive,
    eyebrow: s.eyebrow ?? "",
    title: s.title ?? "",
    description: s.description ?? "",
    productVariantId: variantId,
    productImageId: imageId,
  };
}

function themeToCardVariant(theme: "LIGHT" | "DARK"): "light" | "dark" {
  return theme === "LIGHT" ? "light" : "dark";
}

export function AdminHomeHeroSlideFormPage() {
  const { slideId } = useParams<{ slideId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  /** `home-hero/new` has no param; `home-hero/:slideId/edit` sets `slideId`. */
  const isNew = slideId === undefined;

  const { data: slides = [], isLoading: slidesLoading } =
    useGetHomeHeroSlidesManage();
  const { data: productsData, isLoading: productsLoading } = useGetProducts();
  const products = useMemo(
    () => productsData?.items ?? [],
    [productsData?.items],
  );

  const editing = useMemo(
    () => (isNew ? null : slides.find((s) => s.id === slideId) ?? null),
    [isNew, slides, slideId],
  );

  const variantOptions = useMemo((): VariantOption[] => {
    return products.flatMap((p) =>
      (p.variants ?? [])
        .filter((v) => (v.images?.length ?? 0) > 0)
        .map((v) => {
          const imgs = [...(v.images ?? [])].sort((a, b) => a.order - b.order);
          return {
            id: v.id,
            productId: p.id,
            label: v.sku ? `${p.name} · ${v.sku}` : p.name,
            images: imgs,
          };
        }),
    );
  }, [products]);

  const invalidate = () => {
    queryClient.invalidateQueries({
      queryKey: getGetHomeHeroSlidesManageQueryKey(),
    });
    queryClient.invalidateQueries({ queryKey: getGetHomeHeroSlidesQueryKey() });
  };

  const postMutation = usePostHomeHeroSlides({
    mutation: {
      onSuccess: () => {
        invalidate();
        toast.success("Slide created");
        navigate(ROUTES.admin.homeHero);
      },
      onError: () => toast.error("Could not create slide"),
    },
  });

  const patchMutation = usePatchHomeHeroSlidesSlideId({
    mutation: {
      onSuccess: () => {
        invalidate();
        toast.success("Slide saved");
        navigate(ROUTES.admin.homeHero);
      },
      onError: () => toast.error("Could not save slide"),
    },
  });

  const form = useForm<HomeHeroSlideFormValues>({
    resolver: zodResolver(homeHeroSlideFormSchema),
    defaultValues: emptyHomeHeroFormValues(),
  });

  const { control, register, handleSubmit, reset, setValue, formState } = form;

  const ready = !productsLoading && (isNew || !slidesLoading);
  /** Avoid resetting the form on every React Query cache refresh (new array refs). */
  const formInitMarker = useRef<string | null>(null);

  useEffect(() => {
    formInitMarker.current = null;
  }, [slideId, isNew]);

  useEffect(() => {
    if (!ready) return;
    if (isNew) {
      if (formInitMarker.current !== "new") {
        formInitMarker.current = "new";
        reset(emptyHomeHeroFormValues());
      }
      return;
    }
    if (!slideId) return;
    const slide = slides.find((s) => s.id === slideId);
    if (!slide) return;
    const marker = `${slideId}:${slide.updatedAt}:${products.length}`;
    if (formInitMarker.current === marker) return;
    formInitMarker.current = marker;
    reset(recordToFormValues(slide, products));
  }, [ready, isNew, slideId, slides, products, reset]);

  const variantId = useWatch({ control, name: "productVariantId" });
  const imageId = useWatch({ control, name: "productImageId" });
  const theme = useWatch({ control, name: "theme" });
  const useH1 = useWatch({ control, name: "usePrimaryHeading" });
  const eyebrow = useWatch({ control, name: "eyebrow" });
  const title = useWatch({ control, name: "title" });
  const description = useWatch({ control, name: "description" });

  const selectedVariant = useMemo(
    () => variantOptions.find((o) => o.id === variantId),
    [variantOptions, variantId],
  );

  const selectedImage = useMemo(
    () => selectedVariant?.images.find((img) => img.id === imageId),
    [selectedVariant, imageId],
  );

  useEffect(() => {
    if (!selectedVariant) return;
    if (!selectedVariant.images.some((img) => img.id === imageId)) {
      const first = selectedVariant.images[0]?.id ?? "";
      setValue("productImageId", first, { shouldValidate: true });
    }
  }, [selectedVariant, imageId, setValue]);

  const previewProduct = useMemo(() => {
    if (!selectedVariant) return null;
    return products.find((p) => p.id === selectedVariant.productId) ?? null;
  }, [products, selectedVariant]);

  const previewTitle =
    title.trim() || previewProduct?.name || "Untitled";
  const previewEyebrow = eyebrow.trim() || "Featured";
  const previewDescription =
    description.trim() || previewProduct?.description || null;
  const previewImageUrl = selectedImage?.url ?? null;

  const onSubmit = (values: HomeHeroSlideFormValues) => {
    const payload = {
      theme: values.theme,
      isActive: values.isActive,
      usePrimaryHeading: values.usePrimaryHeading,
      eyebrow: values.eyebrow.trim() || null,
      title: values.title.trim() || null,
      description: values.description.trim() || null,
      productVariantId: values.productVariantId.trim(),
      productImageId: values.productImageId.trim(),
    };

    if (isNew) {
      postMutation.mutate({ data: payload });
      return;
    }
    if (!editing) return;
    patchMutation.mutate({ slideId: editing.id, data: payload });
  };

  const busy = postMutation.isPending || patchMutation.isPending;

  if (!isNew && !slidesLoading && !editing) {
    return (
      <div className="space-y-4">
        <p className="text-destructive">Slide not found.</p>
        <Button asChild variant="outline">
          <Link to={ROUTES.admin.homeHero}>Back to home hero</Link>
        </Button>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="text-muted-foreground">Loading…</div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <Button asChild variant="ghost" size="sm" className="-ml-3 gap-1">
            <Link to={ROUTES.admin.homeHero}>
              <ArrowLeft className="size-4" />
              Home hero
            </Link>
          </Button>
          <h1 className="text-2xl font-semibold text-foreground">
            {isNew ? "New slide" : "Edit slide"}
          </h1>
          <p className="text-sm text-muted-foreground">
            Pick a variant with photos, then choose which image this slide uses.
            You can add several slides for the same variant using different
            images.
          </p>
        </div>
      </div>

      <section className="space-y-2">
        <h2 className="text-sm font-medium text-foreground">Preview</h2>
        <div className="rounded-xl border border-border bg-muted/30 p-4">
          <HomeHeroCard
            variant={themeToCardVariant(theme)}
            titleAs={useH1 ? "h1" : "h2"}
            eyebrow={previewEyebrow}
            title={previewTitle}
            description={previewDescription}
            imageUrl={previewImageUrl}
            href={
              previewProduct && variantId
                ? ROUTES.productDetail(previewProduct.id, variantId)
                : undefined
            }
          />
        </div>
        {!previewImageUrl ? (
          <p className="text-xs text-muted-foreground">
            Select a variant and image to see the hero preview.
          </p>
        ) : null}
      </section>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid gap-6"
        noValidate
      >
        <div className="space-y-2">
          <Label htmlFor="hh-variant">Product variant</Label>
          <Controller
            name="productVariantId"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value || undefined}
                onValueChange={(v) => {
                  field.onChange(v);
                  const opt = variantOptions.find((o) => o.id === v);
                  const first = opt?.images[0]?.id ?? "";
                  setValue("productImageId", first, { shouldValidate: true });
                }}
              >
                <SelectTrigger id="hh-variant">
                  <SelectValue placeholder="Choose variant (must have images)" />
                </SelectTrigger>
                <SelectContent>
                  {variantOptions.map((o) => (
                    <SelectItem key={o.id} value={o.id}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {formState.errors.productVariantId?.message ? (
            <p className="text-xs text-destructive" role="alert">
              {formState.errors.productVariantId.message}
            </p>
          ) : null}
          {variantOptions.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              No variants with images yet. Add photos to a product variant first.
            </p>
          ) : null}
        </div>

        {selectedVariant && selectedVariant.images.length > 0 ? (
          <div className="space-y-2">
            <Label>Slide image</Label>
            <Controller
              name="productImageId"
              control={control}
              render={({ field }) => (
                <div className="flex flex-wrap gap-3">
                  {selectedVariant.images.map((img) => {
                    const selected = field.value === img.id;
                    return (
                      <button
                        key={img.id}
                        type="button"
                        onClick={() =>
                          field.onChange(img.id)
                        }
                        className={cn(
                          "relative size-24 overflow-hidden rounded-lg border-2 transition-colors",
                          selected
                            ? "border-primary ring-2 ring-primary/20"
                            : "border-transparent hover:border-border",
                        )}
                      >
                        <img
                          src={img.url}
                          alt=""
                          className="size-full object-cover"
                        />
                      </button>
                    );
                  })}
                </div>
              )}
            />
            {formState.errors.productImageId?.message ? (
              <p className="text-xs text-destructive" role="alert">
                {formState.errors.productImageId.message}
              </p>
            ) : null}
          </div>
        ) : null}

        <div className="space-y-2">
          <Label htmlFor="hh-theme">Theme</Label>
          <Controller
            name="theme"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="hh-theme">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LIGHT">Light</SelectItem>
                  <SelectItem value="DARK">Dark</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="flex items-center justify-between gap-4">
          <Label htmlFor="hh-active">Active</Label>
          <Controller
            name="isActive"
            control={control}
            render={({ field }) => (
              <Switch
                id="hh-active"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
        </div>

        <div className="flex items-center justify-between gap-4">
          <Label htmlFor="hh-h1">Use main page heading (H1)</Label>
          <Controller
            name="usePrimaryHeading"
            control={control}
            render={({ field }) => (
              <Switch
                id="hh-h1"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="hh-eyebrow">Eyebrow</Label>
          <Input
            id="hh-eyebrow"
            placeholder="Optional; defaults to “Featured”"
            {...register("eyebrow")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="hh-title">Title</Label>
          <Input
            id="hh-title"
            placeholder="Optional; defaults to product name"
            {...register("title")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="hh-desc">Description</Label>
          <Textarea
            id="hh-desc"
            rows={3}
            placeholder="Optional; defaults to product description"
            {...register("description")}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button type="submit" disabled={busy}>
            {busy ? "Saving…" : isNew ? "Create slide" : "Save changes"}
          </Button>
          <Button asChild type="button" variant="outline" disabled={busy}>
            <Link to={ROUTES.admin.homeHero}>Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
