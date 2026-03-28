import { Plus } from "lucide-react";
import { toast } from "sonner";
import type { FieldErrors } from "react-hook-form";
import { Button } from "@/core/components/ui/button";
import type {
  AdjustVariantStockPayload,
  ProductFormValues,
} from "../domain/productFormSchema";
import { useProductForm } from "../application/useProductForm";
import { ProductBasicsCard } from "./ProductBasicsCard";
import { VariantCard } from "./VariantCard";

function firstFieldErrorMessage(errors: FieldErrors<ProductFormValues>): string | null {
  for (const node of Object.values(errors)) {
    if (!node) continue;
    if (
      typeof node === "object" &&
      "message" in node &&
      typeof node.message === "string" &&
      node.message
    ) {
      return node.message;
    }
    if (typeof node === "object" && node !== null) {
      const inner = firstFieldErrorMessage(node as FieldErrors<ProductFormValues>);
      if (inner) return inner;
    }
  }
  return null;
}

export type { AdjustVariantStockPayload };

export interface ProductFormUIProps {
  values?: ProductFormValues;
  /** When set (edit mode), each saved variant shows read-only on-hand qty from the server. */
  variantStockById?: Record<string, number>;
  /** Edit mode: open stock adjustment for a saved variant. */
  onAdjustVariantStock?: (payload: AdjustVariantStockPayload) => void;
  onSubmit: (values: ProductFormValues) => void | Promise<void>;
  isSaving: boolean;
  onCancel: () => void;
  onDeleteExistingImage?: (imageId: string) => Promise<void>;
  onDeleteExistingVariant?: (variantId: string) => Promise<void>;
}

export function ProductFormUI({
  values,
  variantStockById,
  onAdjustVariantStock,
  onSubmit,
  isSaving,
  onCancel,
  onDeleteExistingImage,
  onDeleteExistingVariant,
}: ProductFormUIProps) {
  const {
    form,
    variants,
    appendVariant,
    removeVariant,
    addImagesToVariant,
    removeVariantImage,
  } = useProductForm({
    values,
    onDeleteExistingImage,
    onDeleteExistingVariant,
  });

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit, (errs) => {
        toast.error(firstFieldErrorMessage(errs) ?? "Please fix the form errors");
      })}
      className="mx-auto w-full max-w-4xl space-y-8 xl:max-w-5xl"
    >
      <ProductBasicsCard form={form} />

      <section className="space-y-4">
        <div className="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              Variants
            </h2>
            <p className="text-sm text-muted-foreground">
              Each variant can have its own SKU, price, and photos. At least one
              is required.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="shrink-0 gap-1.5 self-start sm:self-auto"
            onClick={appendVariant}
          >
            <Plus className="size-4" />
            Add variant
          </Button>
        </div>

        <div className="space-y-6">
          {variants.map((field, index) => (
            <VariantCard
              key={field.id}
              form={form}
              index={index}
              canRemove={variants.length > 1}
              variantStockById={variantStockById}
              onAdjustVariantStock={onAdjustVariantStock}
              onRemove={() => void removeVariant(index)}
              onAddImages={(e) => addImagesToVariant(index, e)}
              onRemoveImage={(uid) => void removeVariantImage(index, uid)}
            />
          ))}
        </div>
        {form.formState.errors.variants?.root && (
          <p className="text-sm text-destructive">
            {form.formState.errors.variants.root.message}
          </p>
        )}
      </section>

      <div className="flex gap-2">
        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save product"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSaving}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
