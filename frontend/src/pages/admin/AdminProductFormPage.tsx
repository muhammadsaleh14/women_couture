import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useGetProductsProductId } from "@/core/api/generated/api";
import { ROUTES } from "@/core/routes";
import { mapAdminProductDetailToFormValues } from "@/modules/product/infrastructure/mapAdminProductDetailToFormValues";
import { saveProductMultipart } from "@/modules/product/infrastructure/saveProductMultipart";
import { ProductFormUI } from "@/modules/product/presentation/ProductFormUI";
import type { ProductFormValues } from "@/modules/product/domain/productFormSchema";

export function AdminProductFormPage() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const isNewProduct = !productId;
  const [saving, setSaving] = useState(false);

  const { data: existing, isLoading } = useGetProductsProductId(
    productId || "",
    { query: { enabled: !isNewProduct && !!productId } },
  );

  const formValues = useMemo(
    () => (existing ? mapAdminProductDetailToFormValues(existing) : undefined),
    [existing],
  );

  const handleSubmit = async (values: ProductFormValues) => {
    setSaving(true);
    try {
      await saveProductMultipart(isNewProduct ? undefined : productId, values);
      toast.success("Product saved successfully");
      navigate(ROUTES.admin.products);
    } catch (err) {
      console.error("Failed to save product:", err);
      toast.error("Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  if (!isNewProduct && isLoading) {
    return (
      <div className="p-8 text-muted-foreground">Loading product details...</div>
    );
  }

  if (!isNewProduct && !existing) {
    return (
      <div className="p-8 text-muted-foreground">
        Product not found or could not be loaded.
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">
          {isNewProduct ? "Add Product" : "Edit Product"}
        </h1>
        <p className="text-sm text-muted-foreground">
          Fill in the product details and its variants.
        </p>
      </div>

      <ProductFormUI
        key={productId ?? "new"}
        values={isNewProduct ? undefined : formValues}
        onSubmit={(vals) => void handleSubmit(vals)}
        isSaving={saving}
        onCancel={() => navigate(ROUTES.admin.products)}
      />
    </div>
  );
}
