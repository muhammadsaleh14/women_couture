import { Link, useParams } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ROUTES } from "@/core/routes";
import { useProductForm } from "../hooks/useProductForm";
import { ProductBasicsCard } from "../components/ProductBasicsCard";
import { VariantCard } from "../components/VariantCard";

export function AdminProductFormPage() {
  const { productId } = useParams<{ productId: string }>();
  const isNewProduct = !productId;

  const {
    form,
    variants,
    appendVariant,
    removeVariant,
    addImagesToVariant,
    removeVariantImage,
    save,
    saving,
    isLoading,
  } = useProductForm(productId, isNewProduct);

  if (isLoading) {
    return <div className="p-8 text-stone-500">Loading product details...</div>;
  }

  return (
    <form
      onSubmit={save}
      className="mx-auto max-w-2xl space-y-6"
    >
      <div>
        <h1 className="text-2xl font-semibold text-stone-900">
          {isNewProduct ? "Add Product" : "Edit Product"}
        </h1>
        <p className="text-sm text-stone-600">
          Fill in the product details and its variants.
        </p>
      </div>

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
              onRemove={() => removeVariant(index)}
              onAddImages={(e) => addImagesToVariant(index, e)}
              onRemoveImage={(uid) => removeVariantImage(index, uid)}
            />
          ))}
          {form.formState.errors.variants?.root && (
            <p className="text-destructive text-sm mt-2">
              {form.formState.errors.variants.root.message}
            </p>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save product"}
        </Button>
        <Button type="button" variant="outline" asChild disabled={saving}>
          <Link to={ROUTES.admin.products}>Cancel</Link>
        </Button>
      </div>
    </form>
  );
}
