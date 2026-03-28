import path from "path";
import { prisma } from "../../core/database/prisma";

export async function createVariant(
  productId: string,
  data: { sku?: string; salePrice: number; purchasePrice?: number },
) {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    throw new Error("Product not found");
  }

  return prisma.productVariant.create({
    data: {
      productId,
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
  const variant = await prisma.productVariant.findUnique({
    where: { id: variantId },
    include: { images: true },
  });

  if (!variant) {
    throw new Error("Variant not found");
  }

  await prisma.productVariant.delete({ where: { id: variantId } });

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

  if (image.url && !image.url.startsWith("http")) {
    const fs = await import("fs/promises");
    const filePath = path.join(process.cwd(), image.url);
    await fs.unlink(filePath).catch(() => {});
  }

  return image;
}
