import type { UseFormReturn } from "react-hook-form";
import { Trash2 } from "lucide-react";
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
  isFirst: boolean;
  canRemove: boolean;
  variantStockById?: Record<string, number>;
  onAdjustVariantStock?: (payload: AdjustVariantStockPayload) => void;
  onRemove: () => void;
  onAddImages: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (uid: string) => void;
}

export function VariantCard({
  form,
  index,
  isFirst,
  canRemove,
  variantStockById,
  onAdjustVariantStock,
  onRemove,
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

  return (
    <div>
      {!isFirst && <Separator className="my-4" />}

      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-5 md:items-end">
        <div className="space-y-1.5 md:col-span-2">
          <Label>SKU (optional)</Label>
          <Input
            placeholder="e.g. NVY-123"
            {...register(`variants.${index}.sku`)}
          />
        </div>

        <div className="space-y-1.5 md:col-span-2">
          <Label>Sale Price (PKR)</Label>
          <Input
            inputMode="numeric"
            {...register(`variants.${index}.salePrice`)}
          />
          {variantErrors?.salePrice && (
            <p className="text-destructive text-sm">
              {variantErrors.salePrice.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5 md:col-span-2">
          <Label>Cost Price (optional)</Label>
          <Input
            inputMode="numeric"
            placeholder="e.g. 500"
            {...register(`variants.${index}.purchasePrice`)}
          />
        </div>

        <div className="flex justify-end pb-0.5 md:col-span-1">
          {canRemove && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-stone-500 hover:text-red-500"
              onClick={onRemove}
              aria-label="Remove variant"
            >
              <Trash2 className="size-4" />
            </Button>
          )}
        </div>
      </div>

      {variantStockById != null ? (
        <div className="mt-3 flex flex-wrap items-end gap-3">
          <div className="min-w-32 max-w-xs flex-1 space-y-1.5">
            <Label>On hand</Label>
            <div
              className="flex h-9 items-center rounded-md border border-input bg-muted/40 px-3 text-sm tabular-nums text-foreground"
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
          <p className="w-full text-xs text-muted-foreground">
            {canAdjustStock
              ? "Read-only count — use Adjust stock or the Stock page."
              : "Read-only · save the variant before adjusting stock."}
          </p>
        </div>
      ) : null}

      <div className="mt-3">
        <VariantImageGrid
          sectionTitle={sectionTitle}
          images={images}
          onAddImages={onAddImages}
          onRemoveImage={onRemoveImage}
        />
      </div>
    </div>
  );
}
