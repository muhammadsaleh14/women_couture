import type { ProductWithVariants } from "@/core/api/generated/api";
import { emptyVariant } from "../domain/defaults";
import type { ProductFormValues } from "../domain/productFormSchema";

export function mapAdminProductDetailToFormValues(
  product: ProductWithVariants,
): ProductFormValues {
  return {
    name: product.name,
    description: product.description || "",
    type: product.type,
    variants:
      product.variants && product.variants.length > 0
        ? (() => {
            const sorted = [...product.variants].sort(
              (a, b) =>
                Number(b.isDefault) - Number(a.isDefault) ||
                (a.sortOrder ?? 0) - (b.sortOrder ?? 0) ||
                new Date(a.createdAt).getTime() -
                  new Date(b.createdAt).getTime(),
            );
            const defaultId =
              sorted.find((v) => v.isDefault === true)?.id ?? sorted[0]?.id;
            return sorted.map((v) => ({
              id: v.id,
              isNew: false,
              isDefault: v.id === defaultId,
              sku: v.sku || "",
              salePrice: String(v.salePrice ?? 0),
              purchasePrice: v.purchasePrice ? String(v.purchasePrice) : "",
              images: (v.images || []).map((img) => ({
                uid: img.id,
                preview: img.url,
              })),
            }));
          })()
        : [{ ...emptyVariant(), isDefault: true }],
  };
}
