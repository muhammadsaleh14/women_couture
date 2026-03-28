import { api } from "@/core/lib/api";
import type { ProductWithVariants } from "@/core/api/generated/api";
import type { ProductFormValues } from "../domain/productFormSchema";

function parseMoney(s: string): number {
  const n = Number(String(s).replace(",", ".").replace(/\s/g, "").trim());
  return Number.isFinite(n) ? n : 0;
}

/**
 * One request to POST/PATCH `/products` with `data` JSON and `variants[i]` file fields.
 */
export async function saveProductMultipart(
  productId: string | undefined,
  values: ProductFormValues,
): Promise<ProductWithVariants> {
  const payload = {
    name: values.name,
    description: values.description?.trim() ? values.description : undefined,
    type: values.type,
    variants: values.variants.map((v) => ({
      ...(v.isNew ? {} : { id: v.id }),
      sku: v.sku?.trim() ? v.sku : undefined,
      salePrice: parseMoney(v.salePrice),
      purchasePrice:
        v.purchasePrice?.trim() !== ""
          ? parseMoney(String(v.purchasePrice))
          : undefined,
      existingImageIds: v.images.filter((img) => !img.file).map((img) => img.uid),
    })),
  };

  const fd = new FormData();
  fd.append("data", JSON.stringify(payload));
  values.variants.forEach((v, i) => {
    for (const img of v.images) {
      if (img.file) fd.append(`variants[${i}]`, img.file);
    }
  });

  if (productId) {
    const { data } = await api.patch<ProductWithVariants>(`/products/${productId}`, fd);
    return data;
  }
  const { data } = await api.post<ProductWithVariants>("/products", fd);
  return data;
}
