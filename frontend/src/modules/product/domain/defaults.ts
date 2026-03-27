import type { ImageItem, ProductFormValues } from "./productFormSchema";

export function emptyVariant() {
  return {
    id: crypto.randomUUID(),
    isNew: true,
    color: "",
    sku: "",
    salePrice: "",
    purchasePrice: "",
    images: [] as ImageItem[],
  };
}

export function defaultProductFormValues(): ProductFormValues {
  return {
    name: "",
    description: "",
    type: "UNSTITCHED",
    variants: [emptyVariant()],
  };
}
