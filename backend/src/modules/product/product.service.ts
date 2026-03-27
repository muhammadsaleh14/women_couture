import * as fs from "fs/promises";
import path from "path";
import { ClothingType, StockMoveType } from "@prisma/client";
import { prisma } from "../../core/database/prisma";
import { toImageUrl } from "../../core/utils/image-url";
import type { SaveProductBody } from "./product.schema";

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
      color: string;
      sku?: string;
      salePrice: number;
      purchasePrice?: number;
    }>;
  },
  variantImages?: Map<number, string[]>,
) {
  const product = await prisma.product.create({
    data: {
      name: data.name,
      description: data.description,
      type: data.type,
      isActive: true,
      variants: data.variants
        ? {
            create: data.variants.map((v, i) => ({
              color: v.color,
              sku: v.sku,
              salePrice: v.salePrice,
              purchasePrice: v.purchasePrice,
              stockQty: 0,
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
      variants: {
        include: {
          images: {
            orderBy: { order: "asc" },
          },
        },
      },
    },
  });
  return withImageUrls(product);
}

export async function getAllProducts(query: {
  skip: number;
  take: number;
  isActive?: boolean;
}) {
  const where = query.isActive !== undefined ? { isActive: query.isActive } : {};

  const products = await prisma.product.findMany({
    where,
    skip: query.skip,
    take: query.take,
    include: {
      variants: {
        include: {
          images: {
            orderBy: { order: "asc" },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
  return products.map(withImageUrls);
}

export async function getProductById(productId: string) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      variants: {
        include: {
          images: {
            orderBy: { order: "asc" },
          },
        },
      },
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

    for (let i = 0; i < body.variants.length; i++) {
      const v = body.variants[i];
      const newUrls = variantFiles.get(i) ?? [];

      if (v.id) {
        await tx.productVariant.update({
          where: { id: v.id },
          data: {
            color: v.color,
            sku: v.sku ?? null,
            salePrice: v.salePrice,
            purchasePrice: v.purchasePrice ?? null,
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
            color: v.color,
            sku: v.sku ?? null,
            salePrice: v.salePrice,
            purchasePrice: v.purchasePrice ?? null,
            stockQty: 0,
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
