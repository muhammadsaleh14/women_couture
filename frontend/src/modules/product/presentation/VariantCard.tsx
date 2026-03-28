import type { UseFormReturn } from "react-hook-form";
import { Trash2 } from "lucide-react";
import { Button } from "@/core/components/ui/button";
import { Input } from "@/core/components/ui/input";
import { Label } from "@/core/components/ui/label";
import { Separator } from "@/core/components/ui/separator";
import { type ProductFormValues } from "../domain/productFormSchema";
import { VariantImageGrid } from "./VariantImageGrid";

interface VariantCardProps {
  form: UseFormReturn<ProductFormValues>;
  index: number;
  isFirst: boolean;
  canRemove: boolean;
  onRemove: () => void;
  onAddImages: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (uid: string) => void;
}

export function VariantCard({
  form,
  index,
  isFirst,
  canRemove,
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
  const variantErrors = errors.variants?.[index];
  const sectionTitle = sku?.trim() ? `SKU ${sku.trim()}` : `Variant ${index + 1}`;

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
