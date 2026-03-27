import { Plus } from "lucide-react";
import { toast } from "sonner";
import type { FieldErrors } from "react-hook-form";
import { Button } from "@/core/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/core/components/ui/card";
import type { ProductFormValues } from "../domain/productFormSchema";
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

export interface ProductFormUIProps {
  values?: ProductFormValues;
  onSubmit: (values: ProductFormValues) => void | Promise<void>;
  isSaving: boolean;
  onCancel: () => void;
  onDeleteExistingImage?: (imageId: string) => Promise<void>;
  onDeleteExistingVariant?: (variantId: string) => Promise<void>;
}

export function ProductFormUI({
  values,
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
      className="mx-auto max-w-2xl space-y-6"
    >
      <ProductBasicsCard form={form} />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">Variants</CardTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1"
            onClick={appendVariant}
          >
            <Plus className="size-4" />
            Add Variant
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {variants.map((field, index) => (
            <VariantCard
              key={field.id}
              form={form}
              index={index}
              isFirst={index === 0}
              canRemove={variants.length > 1}
              onRemove={() => void removeVariant(index)}
              onAddImages={(e) => addImagesToVariant(index, e)}
              onRemoveImage={(uid) => void removeVariantImage(index, uid)}
            />
          ))}
          {form.formState.errors.variants?.root && (
            <p className="mt-2 text-sm text-destructive">
              {form.formState.errors.variants.root.message}
            </p>
          )}
        </CardContent>
      </Card>

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
