import path from "path";
import { prisma } from "../lib/prisma";

export async function createVariant(
  productId: string,
  data: { color: string; sku?: string; salePrice: number; purchasePrice?: number },
) {
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
    include: {
      images: { orderBy: { order: "asc" } },
    },
  });
}

export async function updateVariant(
  variantId: string,
  data: {
    color?: string;
    sku?: string;
    salePrice?: number;
    purchasePrice?: number;
  },
) {
  return prisma.productVariant.update({
    where: { id: variantId },
    data,
    include: {
      images: { orderBy: { order: "asc" } },
    },
  });
}

export async function deleteVariant(variantId: string) {
  // Fetch images so we can clean up files from disk
  const variant = await prisma.productVariant.findUnique({
    where: { id: variantId },
    include: { images: true },
  });

  if (!variant) {
    throw new Error("Variant not found");
  }

  // Delete the variant (images + stock moves cascade via Prisma schema)
  await prisma.productVariant.delete({ where: { id: variantId } });

  // Clean up image files from disk
  const fs = await import("fs/promises");
  for (const img of variant.images) {
    if (img.url && !img.url.startsWith("http")) {
      const filePath = path.join(process.cwd(), img.url);
      await fs.unlink(filePath).catch(() => {});
    }
  }
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

export async function deleteImage(imageId: string) {
  const image = await prisma.productImage.delete({
    where: { id: imageId },
  });

  // Remove the file from disk (ignore errors if file doesn't exist)
  if (image.url && !image.url.startsWith("http")) {
    const fs = await import("fs/promises");
    const filePath = path.join(process.cwd(), image.url);
    await fs.unlink(filePath).catch(() => {});
  }

  return image;
}
