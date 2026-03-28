import type {
  ProductBaseType,
  ProductVariant as ApiProductVariant,
  ProductWithVariants,
} from "@/core/api/generated/api";
import type { CategoryId, Product } from "@/shared/model/types";

const PLACEHOLDER_IMG =
  "https://placehold.co/800x1000/f5f5f4/78716c?text=Women+Couture";

export function colorLabelToHex(label: string): string {
  let h = 0;
  for (let i = 0; i < label.length; i++) {
    h = (Math.imul(31, h) + label.charCodeAt(i)) | 0;
  }
  const hue = Math.abs(h) % 360;
  return `hsl(${hue} 42% 42%)`;
}

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
  const variants = product.variants ?? [];
  const gallery = collectGalleryImages(variants);
  const mappedVariants =
    variants.length > 0
      ? variants.map((v) => {
          const imageUrl = firstVariantImageUrl(v) || PLACEHOLDER_IMG;
          return {
            id: v.id,
            colorName: v.color,
            hex: colorLabelToHex(v.color),
            stock: v.stockQty,
            imageUrl,
          };
        })
      : [
          {
            id: `${product.id}-placeholder`,
            colorName: "—",
            hex: "#78716c",
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
