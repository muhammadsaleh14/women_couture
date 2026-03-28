import type { UseFormReturn } from "react-hook-form";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { Button } from "@/core/components/ui/button";
import { Input } from "@/core/components/ui/input";
import { Label } from "@/core/components/ui/label";
import { Separator } from "@/core/components/ui/separator";
import {
  type AdjustVariantStockPayload,
  type ProductFormValues,
} from "../domain/productFormSchema";
import { VariantImageGrid } from "./VariantImageGrid";

interface VariantCardProps {
  form: UseFormReturn<ProductFormValues>;
  index: number;
  canRemove: boolean;
  variantStockById?: Record<string, number>;
  onAdjustVariantStock?: (payload: AdjustVariantStockPayload) => void;
  onRemove: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onAddImages: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (uid: string) => void;
}

export function VariantCard({
  form,
  index,
  canRemove,
  variantStockById,
  onAdjustVariantStock,
  onRemove,
  onMoveUp,
  onMoveDown,
  onAddImages,
  onRemoveImage,
}: VariantCardProps) {
  const {
    register,
    watch,
    formState: { errors },
  } = form;

  const images = watch(`variants.${index}.images`);
  const sku = watch(`variants.${index}.sku`);
  const variantId = watch(`variants.${index}.id`);
  const isNewVariant = watch(`variants.${index}.isNew`);
  const onHand =
    variantStockById && !isNewVariant
      ? (variantStockById[variantId] ?? 0)
      : null;
  const variantErrors = errors.variants?.[index];
  const sectionTitle = sku?.trim() ? `SKU ${sku.trim()}` : `Variant ${index + 1}`;
  const canAdjustStock =
    Boolean(variantStockById) &&
    Boolean(onAdjustVariantStock) &&
    !isNewVariant;

  const showReorder = onMoveUp != null || onMoveDown != null;

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm ring-1 ring-border/40">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border bg-muted/40 px-4 py-3 sm:px-5">
        <div className="min-w-0 space-y-0.5">
          <p className="text-sm font-semibold text-foreground">
            Variant {index + 1}
            {showReorder ? (
              <span className="ml-2 font-normal text-muted-foreground">
                · order {index + 1}
              </span>
            ) : null}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {sku?.trim() ? `SKU · ${sku.trim()}` : "No SKU yet"}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-0.5">
          {showReorder ? (
            <div
              className="mr-1 flex flex-col gap-0.5 rounded-md border border-border/80 bg-background p-0.5 shadow-sm"
              role="group"
              aria-label="Change variant order"
            >
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="size-8"
                disabled={!onMoveUp}
                onClick={onMoveUp}
                aria-label="Move variant up"
              >
                <ChevronUp className="size-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="size-8"
                disabled={!onMoveDown}
                onClick={onMoveDown}
                aria-label="Move variant down"
              >
                <ChevronDown className="size-4" />
              </Button>
            </div>
          ) : null}
          {canRemove ? (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="text-muted-foreground hover:text-destructive"
              onClick={onRemove}
              aria-label="Remove variant"
            >
              <Trash2 className="size-4" />
            </Button>
          ) : null}
        </div>
      </div>

      <div className="space-y-6 p-4 sm:p-5">
        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Pricing and SKU
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-1.5 sm:col-span-2 lg:col-span-1">
              <Label>SKU (optional)</Label>
              <Input
                placeholder="e.g. NVY-123"
                {...register(`variants.${index}.sku`)}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Sale price (PKR)</Label>
              <Input
                inputMode="numeric"
                {...register(`variants.${index}.salePrice`)}
              />
              {variantErrors?.salePrice ? (
                <p className="text-sm text-destructive">
                  {variantErrors.salePrice.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <Label>Cost price (optional)</Label>
              <Input
                inputMode="numeric"
                placeholder="e.g. 500"
                {...register(`variants.${index}.purchasePrice`)}
              />
            </div>
          </div>
        </div>

        {variantStockById != null ? (
          <>
            <Separator />
            <div>
              <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Inventory
              </p>
              <div className="rounded-lg border border-border/80 bg-muted/25 p-4">
                <div className="flex flex-wrap items-end gap-3">
                  <div className="min-w-32 flex-1 space-y-1.5 sm:max-w-xs">
                    <Label>On hand</Label>
                    <div
                      className="flex h-9 items-center rounded-md border border-input bg-background px-3 text-sm tabular-nums text-foreground"
                      aria-readonly
                    >
                      {onHand === null ? "—" : onHand}
                    </div>
                  </div>
                  {canAdjustStock ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="shrink-0"
                      onClick={() =>
                        onAdjustVariantStock?.({
                          variantId,
                          sku: sku?.trim() ? sku.trim() : null,
                          stockQty: variantStockById?.[variantId] ?? 0,
                        })
                      }
                    >
                      Adjust stock
                    </Button>
                  ) : null}
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  {canAdjustStock
                    ? "Read-only count — use Adjust stock or the Stock page."
                    : "Read-only · save the variant before adjusting stock."}
                </p>
              </div>
            </div>
          </>
        ) : null}

        <Separator />

        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Images
          </p>
          <VariantImageGrid
            sectionTitle={sectionTitle}
            images={images}
            onAddImages={onAddImages}
            onRemoveImage={onRemoveImage}
          />
        </div>
      </div>
    </div>
  );
}
