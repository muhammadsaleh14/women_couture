import type {
  ProductBaseType,
  ProductVariant as ApiProductVariant,
  ProductWithVariants,
} from "@/core/api/generated/api";
import type { CategoryId, Product } from "@/shared/model/types";

const PLACEHOLDER_IMG =
  "https://placehold.co/800x1000/f5f5f4/78716c?text=Women+Couture";

function apiTypeToCategoryId(type: ProductBaseType): CategoryId {
  switch (type) {
    case "THREE_PC":
      return "three-piece";
    case "TWO_PC":
      return "two-piece";
    case "SEPARATE":
      return "separates";
    case "UNSTITCHED":
    default:
      return "three-piece";
  }
}

function apiTypeToSubCategory(type: ProductBaseType): Product["subCategory"] {
  switch (type) {
    case "THREE_PC":
      return "3 PC";
    case "TWO_PC":
      return "2 PC";
    case "SEPARATE":
      return "Separates";
    case "UNSTITCHED":
    default:
      return "3 PC";
  }
}

function firstVariantImageUrl(v: ApiProductVariant): string {
  const sorted = [...(v.images ?? [])].sort((a, b) => a.order - b.order);
  return sorted[0]?.url ?? "";
}

function collectGalleryImages(variants: ApiProductVariant[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const v of variants) {
    const sorted = [...(v.images ?? [])].sort((a, b) => a.order - b.order);
    for (const img of sorted) {
      if (!seen.has(img.url)) {
        seen.add(img.url);
        out.push(img.url);
      }
    }
  }
  return out;
}

function variantPrices(variants: ApiProductVariant[]): {
  regularPrice: number;
  salePrice?: number;
} {
  const nums = variants
    .map((v) => Number(v.salePrice ?? 0))
    .filter((n) => n > 0 && Number.isFinite(n));
  if (nums.length === 0) return { regularPrice: 0 };
  const low = Math.min(...nums);
  const high = Math.max(...nums);
  if (high > low) return { regularPrice: high, salePrice: low };
  return { regularPrice: low };
}

function isRecentlyCreated(createdAt: string): boolean {
  return Date.now() - new Date(createdAt).getTime() < 14 * 24 * 60 * 60 * 1000;
}

export function mapProductWithVariantsToStorefront(
  product: ProductWithVariants,
): Product {
  const variants = [...(product.variants ?? [])].sort(
    (a, b) =>
      (a.sortOrder ?? 0) - (b.sortOrder ?? 0) ||
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );
  const gallery = collectGalleryImages(variants);
  const mappedVariants =
    variants.length > 0
      ? variants.map((v) => {
          const imageUrl = firstVariantImageUrl(v) || PLACEHOLDER_IMG;
          return {
            id: v.id,
            sku: v.sku,
            stock: v.stockQty,
            imageUrl,
          };
        })
      : [
          {
            id: `${product.id}-placeholder`,
            sku: null,
            stock: 0,
            imageUrl: PLACEHOLDER_IMG,
          },
        ];

  const cover = mappedVariants[0]?.imageUrl ?? PLACEHOLDER_IMG;
  const images = gallery.length > 0 ? gallery : [cover];
  const { regularPrice, salePrice } = variantPrices(variants);

  return {
    id: product.id,
    name: product.name,
    description: product.description ?? "",
    mainCategory: "Unstitched",
    subCategory: apiTypeToSubCategory(product.type),
    categoryId: apiTypeToCategoryId(product.type),
    regularPrice,
    salePrice,
    isNew: isRecentlyCreated(product.createdAt),
    variants: mappedVariants,
    images,
  };
}
