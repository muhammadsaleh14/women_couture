import * as fs from "fs/promises";
import path from "path";
import { ClothingType, Prisma, StockMoveType } from "@prisma/client";

export type StorefrontCategorySlug = "three-piece" | "two-piece" | "separates";

function whereForStorefrontCategory(
  category: StorefrontCategorySlug,
): Prisma.ProductWhereInput {
  if (category === "three-piece") {
    return {
      type: { in: [ClothingType.UNSTITCHED, ClothingType.THREE_PC] },
    };
  }
  if (category === "two-piece") {
    return { type: ClothingType.TWO_PC };
  }
  return { type: ClothingType.SEPARATE };
}
import { prisma } from "../../core/database/prisma";
import { toImageUrl } from "../../core/utils/image-url";
import type { SaveProductBody } from "./product.schema";

const variantsBySortOrder = {
  orderBy: [
    { isDefault: "desc" as const },
    { sortOrder: "asc" as const },
    { createdAt: "asc" as const },
  ],
  include: {
    images: {
      orderBy: { order: "asc" as const },
    },
  },
} satisfies NonNullable<Prisma.ProductInclude["variants"]>;

/** Single default: first variant with `isDefault: true`, else index 0. */
function indexOfDefaultVariant<T extends { isDefault?: boolean }>(variants: T[]): number {
  const idx = variants.findIndex((v) => v.isDefault === true);
  return idx >= 0 ? idx : 0;
}

function withImageUrls<
  T extends {
    variants?: Array<{
      images?: Array<{ url: string; [k: string]: unknown }>;
      [k: string]: unknown;
    }>;
    [k: string]: unknown;
  },
>(product: T): T {
  if (!product.variants) return product;
  return {
    ...product,
    variants: product.variants.map((v) => ({
      ...v,
      images: v.images?.map((img) => ({ ...img, url: toImageUrl(img.url) })),
    })),
  };
}

export async function createProduct(
  data: {
    name: string;
    description?: string;
    type: ClothingType;
    variants?: Array<{
      sku?: string;
      salePrice: number;
      purchasePrice?: number;
      isDefault?: boolean;
    }>;
  },
  variantImages?: Map<number, string[]>,
) {
  const defaultIdx =
    data.variants && data.variants.length > 0
      ? indexOfDefaultVariant(data.variants)
      : 0;

  const product = await prisma.product.create({
    data: {
      name: data.name,
      description: data.description,
      type: data.type,
      isActive: true,
      variants: data.variants
        ? {
            create: data.variants.map((v, i) => ({
              sku: v.sku,
              salePrice: v.salePrice,
              purchasePrice: v.purchasePrice,
              stockQty: 0,
              sortOrder: i,
              isDefault: i === defaultIdx,
              images: variantImages?.has(i)
                ? {
                    create: variantImages.get(i)!.map((url, order) => ({
                      url,
                      order,
                    })),
                  }
                : undefined,
            })),
          }
        : undefined,
    },
    include: {
      variants: variantsBySortOrder,
    },
  });
  return withImageUrls(product);
}

export async function getAllProducts(query: {
  skip: number;
  take: number;
  isActive?: boolean;
  category?: StorefrontCategorySlug;
}) {
  const base: Prisma.ProductWhereInput =
    query.isActive !== undefined ? { isActive: query.isActive } : {};
  const typeWhere = query.category
    ? whereForStorefrontCategory(query.category)
    : {};
  const where: Prisma.ProductWhereInput = { ...base, ...typeWhere };

  const [total, products] = await prisma.$transaction([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      skip: query.skip,
      take: query.take,
      include: {
        variants: variantsBySortOrder,
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return { items: products.map(withImageUrls), total };
}

export async function getProductById(productId: string) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      variants: variantsBySortOrder,
    },
  });
  return product ? withImageUrls(product) : null;
}

export async function adjustStock(
  variantId: string,
  type: StockMoveType,
  quantity: number,
  notes?: string,
) {
  return prisma.$transaction(async (tx) => {
    const variant = await tx.productVariant.findUnique({ where: { id: variantId } });
    if (!variant) {
      throw new Error("Variant not found");
    }

    let stockDelta = 0;
    if (type === "IN") {
      stockDelta = quantity;
    } else if (type === "OUT") {
      stockDelta = -quantity;
    } else if (type === "ADJUSTMENT") {
      stockDelta = quantity - variant.stockQty;
    }

    if (variant.stockQty + stockDelta < 0) {
      throw new Error("Insufficient stock for this OUT operation.");
    }

    await tx.stockMove.create({
      data: {
        productVariantId: variantId,
        type,
        quantity: Math.abs(quantity),
        notes,
      },
    });

    const updatedVariant = await tx.productVariant.update({
      where: { id: variantId },
      data: {
        stockQty: {
          increment: stockDelta,
        },
      },
    });

    return updatedVariant;
  });
}

export async function updateProduct(
  productId: string,
  data: {
    name?: string;
    description?: string;
    type?: ClothingType;
    isActive?: boolean;
  },
) {
  return prisma.product.update({
    where: { id: productId },
    data,
  });
}

async function unlinkStoredImage(url: string) {
  if (!url || url.startsWith("http")) return;
  const filePath = path.join(process.cwd(), url);
  await fs.unlink(filePath).catch(() => {});
}

/**
 * Replace product + variants + images in one transaction (multipart full save).
 * `variantFiles` maps variant index in `body.variants` to uploaded file paths (disk URLs).
 */
export async function replaceProductFull(
  productId: string,
  body: SaveProductBody,
  variantFiles: Map<number, string[]>,
) {
  const existingProduct = await prisma.product.findUnique({ where: { id: productId } });
  if (!existingProduct) {
    throw new Error("Record to update not found");
  }

  const defaultIdx = indexOfDefaultVariant(body.variants);

  await prisma.$transaction(async (tx) => {
    await tx.product.update({
      where: { id: productId },
      data: {
        name: body.name,
        description: body.description ?? null,
        type: body.type,
      },
    });

    const existingVariants = await tx.productVariant.findMany({
      where: { productId },
      include: { images: true },
    });

    const payloadIds = new Set(
      body.variants.map((v) => v.id).filter((id): id is string => !!id),
    );

    for (const ev of existingVariants) {
      if (!payloadIds.has(ev.id)) {
        for (const img of ev.images) {
          await unlinkStoredImage(img.url);
        }
        await tx.productVariant.delete({ where: { id: ev.id } });
      }
    }

    await tx.productVariant.updateMany({
      where: { productId },
      data: { isDefault: false },
    });

    for (let i = 0; i < body.variants.length; i++) {
      const v = body.variants[i];
      const newUrls = variantFiles.get(i) ?? [];

      if (v.id) {
        await tx.productVariant.update({
          where: { id: v.id },
          data: {
            sku: v.sku ?? null,
            salePrice: v.salePrice,
            purchasePrice: v.purchasePrice ?? null,
            sortOrder: i,
            isDefault: i === defaultIdx,
          },
        });

        const keep = new Set(v.existingImageIds ?? []);
        const imgs = await tx.productImage.findMany({
          where: { productVariantId: v.id },
        });
        for (const img of imgs) {
          if (!keep.has(img.id)) {
            await unlinkStoredImage(img.url);
            await tx.productImage.delete({ where: { id: img.id } });
          }
        }

        const agg = await tx.productImage.aggregate({
          where: { productVariantId: v.id },
          _max: { order: true },
        });
        let nextOrder = (agg._max.order ?? -1) + 1;
        for (const url of newUrls) {
          await tx.productImage.create({
            data: { productVariantId: v.id, url, order: nextOrder++ },
          });
        }
      } else {
        await tx.productVariant.create({
          data: {
            productId,
            sku: v.sku ?? null,
            salePrice: v.salePrice,
            purchasePrice: v.purchasePrice ?? null,
            stockQty: 0,
            sortOrder: i,
            isDefault: i === defaultIdx,
            images:
              newUrls.length > 0
                ? {
                    create: newUrls.map((url, order) => ({ url, order })),
                  }
                : undefined,
          },
        });
      }
    }
  });

  const full = await getProductById(productId);
  if (!full) throw new Error("Record to update not found");
  return full;
}
