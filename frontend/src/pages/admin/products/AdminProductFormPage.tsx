import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useGetProductsProductId } from "@/core/api/generated/api";
import { ROUTES } from "@/core/routes";
import { useSaveProduct } from "@/modules/product/application/useSaveProduct";
import { mapAdminProductDetailToFormValues } from "@/modules/product/infrastructure/mapAdminProductDetailToFormValues";
import { ProductFormUI } from "@/modules/product/presentation/ProductFormUI";
import type { ProductFormValues } from "@/modules/product/domain/productFormSchema";
import {
  AdjustStockDialog,
  type StockAdjustRow,
} from "@/pages/admin/stock/AdjustStockDialog";

export function AdminProductFormPage() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const isNewProduct = !productId;
  const saveMutation = useSaveProduct();
  const [stockDialogRow, setStockDialogRow] = useState<StockAdjustRow | null>(
    null,
  );

  const { data: existing, isLoading } = useGetProductsProductId(
    productId || "",
    { query: { enabled: !isNewProduct && !!productId } },
  );

  const formValues = useMemo(
    () => (existing ? mapAdminProductDetailToFormValues(existing) : undefined),
    [existing],
  );

  const variantStockById = useMemo(() => {
    if (!existing?.variants?.length) return undefined;
    return Object.fromEntries(
      existing.variants.map((v) => [v.id, v.stockQty ?? 0]),
    );
  }, [existing]);

  const totalStockOnHand = useMemo(() => {
    if (!existing?.variants?.length) return null;
    return existing.variants.reduce((s, v) => s + (v.stockQty ?? 0), 0);
  }, [existing]);

  const handleSubmit = async (values: ProductFormValues) => {
    try {
      await saveMutation.mutateAsync({
        productId: isNewProduct ? undefined : productId,
        values,
      });
      toast.success("Product saved successfully");
      navigate(ROUTES.admin.products);
    } catch (err) {
      console.error("Failed to save product:", err);
      toast.error("Failed to save product");
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
        {totalStockOnHand !== null ? (
          <p className="mt-2 text-sm text-muted-foreground">
            Total stock on hand:{" "}
            <span className="font-semibold tabular-nums text-foreground">
              {totalStockOnHand}
            </span>{" "}
            units (read-only — adjust per variant or from Stock).
          </p>
        ) : null}
      </div>

      <ProductFormUI
        key={productId ?? "new"}
        values={isNewProduct ? undefined : formValues}
        variantStockById={isNewProduct ? undefined : variantStockById}
        onAdjustVariantStock={
          existing
            ? (p) =>
                setStockDialogRow({
                  productId: existing.id,
                  productName: existing.name,
                  variantId: p.variantId,
                  sku: p.sku,
                  stockQty: p.stockQty,
                })
            : undefined
        }
        onSubmit={(vals) => void handleSubmit(vals)}
        isSaving={saveMutation.isPending}
        onCancel={() => navigate(ROUTES.admin.products)}
      />

      {existing ? (
        <AdjustStockDialog
          row={stockDialogRow}
          onClose={() => setStockDialogRow(null)}
          invalidateProductDetailId={existing.id}
        />
      ) : null}
    </div>
  );
}
