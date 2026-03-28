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
        ? [...product.variants]
            .sort(
              (a, b) =>
                (a.sortOrder ?? 0) - (b.sortOrder ?? 0) ||
                new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
            )
            .map((v) => ({
            id: v.id,
            isNew: false,
            sku: v.sku || "",
            salePrice: String(v.salePrice ?? 0),
            purchasePrice: v.purchasePrice ? String(v.purchasePrice) : "",
            images: (v.images || []).map((img) => ({
              uid: img.id,
              preview: img.url,
            })),
          }))
        : [emptyVariant()],
  };
}
