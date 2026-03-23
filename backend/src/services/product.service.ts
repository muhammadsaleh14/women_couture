import { ClothingType, StockMoveType } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { toImageUrl } from "../lib/image-url";

/**
 * Resolve image paths to full URLs on any product-with-variants result.
 */
function withImageUrls<T extends { variants?: Array<{ images?: Array<{ url: string; [k: string]: unknown }> ; [k: string]: unknown }> ; [k: string]: unknown }>(product: T): T {
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
  /** Map of variant index → array of image URLs */
  variantImages?: Map<number, string[]>,
) {
  const product = await prisma.product.create({
    data: {
      name: data.name,
      description: data.description,
      type: data.type,
      isActive: true,
      variants: data.variants ? {
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
      } : undefined,
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

export async function getAllProducts(query: { skip: number; take: number; isActive?: boolean }) {
  const where = query.isActive !== undefined ? { isActive: query.isActive } : {};

  const products = await prisma.product.findMany({
    where,
    skip: query.skip,
    take: query.take,
    include: {
      variants: {
        include: {
          images: {
            orderBy: { order: "asc" }
          }
        }
      }
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
            orderBy: { order: "asc" }
          }
        }
      }
    }
  });
  return product ? withImageUrls(product) : null;
}

export async function createVariant(productId: string, data: { color: string; sku?: string; salePrice: number; purchasePrice?: number }) {
  // Ensure product exists
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    throw new Error("Product not found");
  }

  // Prevent duplicate colors for the same product
  const existing = await prisma.productVariant.findUnique({
    where: { productId_color: { productId, color: data.color } },
  });
  if (existing) {
    throw new Error(`Variant with color '${data.color}' already exists for this product.`);
  }

  return prisma.productVariant.create({
    data: {
      productId,
      color: data.color,
      sku: data.sku,
      salePrice: data.salePrice,
      purchasePrice: data.purchasePrice,
      stockQty: 0,
    },
  });
}

export async function adjustStock(variantId: string, type: StockMoveType, quantity: number, notes?: string) {
  // Use a Prisma transaction to ensure StockMove insertion and stockQty update happen atomically
  return prisma.$transaction(async (tx) => {
    const variant = await tx.productVariant.findUnique({ where: { id: variantId } });
    if (!variant) {
      throw new Error("Variant not found");
    }

    // Determine the actual delta amount
    let stockDelta = 0;
    if (type === "IN") {
      stockDelta = quantity;
    } else if (type === "OUT") {
      stockDelta = -quantity;
    } else if (type === "ADJUSTMENT") {
      // Assuming 'ADJUSTMENT' with a positive value means replacing/setting exact, 
      // or just adjusting wildly. Let's assume ADJUSTMENT means replacing current stock.
      // E.g., if quantity = 5, we set stock to 5. 
      // Delta = new quantity - current quantity.
      stockDelta = quantity - variant.stockQty;
    }

    // In a strict financial system, OUT shouldn't go below 0 unless backordered. 
    // We'll allow it for now or check.
    if (variant.stockQty + stockDelta < 0) {
      throw new Error("Insufficient stock for this OUT operation.");
    }

    // 1. Create StockMove
    await tx.stockMove.create({
      data: {
        productVariantId: variantId,
        type,
        quantity: Math.abs(quantity), // Keep quantity positive in history
        notes,
      },
    });

    // 2. Update stockQty cache
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

export async function addImage(variantId: string, url: string, order = 0) {
  return prisma.productImage.create({
    data: {
      productVariantId: variantId,
      url,
      order,
    },
  });
}

export async function updateProduct(
  productId: string,
  data: {
    name?: string;
    description?: string;
    type?: ClothingType;
    isActive?: boolean;
  }
) {
  return prisma.product.update({
    where: { id: productId },
    data,
  });
}
