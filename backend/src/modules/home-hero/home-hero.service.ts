import type { HomeHeroTheme, Prisma } from "@prisma/client";
import { prisma } from "../../core/database/prisma";
import { HttpError } from "../../core/errors/http-error";
import { toImageUrl } from "../../core/utils/image-url";

const variantInclude = {
  product: true,
  images: { orderBy: { order: "asc" as const } },
} satisfies Prisma.ProductVariantInclude;

type SlideWithRelations = Prisma.HomeHeroSlideGetPayload<{
  include: {
    productVariant: { include: typeof variantInclude };
    productImage: true;
  };
}>;

function resolveSlide(slide: SlideWithRelations) {
  const v = slide.productVariant;
  const product = v?.product;
  const images = v?.images ?? [];
  const chosenImg =
    slide.productImage ??
    (images.length > 0 ? images[0] : undefined) ??
    null;
  const imageUrl = chosenImg ? toImageUrl(chosenImg.url) : null;

  const title = slide.title?.trim() || product?.name || "Untitled";
  const eyebrow = slide.eyebrow?.trim() || "Featured";
  const description = slide.description?.trim() || product?.description || null;

  return {
    id: slide.id,
    theme: slide.theme,
    usePrimaryHeading: slide.usePrimaryHeading,
    eyebrow,
    title,
    description,
    productId: product?.id ?? null,
    variantId: v?.id ?? null,
    imageUrl,
  };
}

function toSlideRecord(s: {
  id: string;
  sortOrder: number;
  isActive: boolean;
  theme: HomeHeroTheme;
  usePrimaryHeading: boolean;
  eyebrow: string | null;
  title: string | null;
  description: string | null;
  productVariantId: string | null;
  productImageId: string | null;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: s.id,
    sortOrder: s.sortOrder,
    isActive: s.isActive,
    theme: s.theme,
    usePrimaryHeading: s.usePrimaryHeading,
    eyebrow: s.eyebrow,
    title: s.title,
    description: s.description,
    productVariantId: s.productVariantId,
    productImageId: s.productImageId,
    createdAt: s.createdAt.toISOString(),
    updatedAt: s.updatedAt.toISOString(),
  };
}

async function assertVariantExists(id: string) {
  const v = await prisma.productVariant.findUnique({ where: { id } });
  if (!v) throw new HttpError(400, "Product variant not found");
}

async function assertImageBelongsToVariant(imageId: string, variantId: string) {
  const img = await prisma.productImage.findFirst({
    where: { id: imageId, productVariantId: variantId },
  });
  if (!img) {
    throw new HttpError(400, "Image does not belong to the selected variant");
  }
}

async function clearOtherPrimaryHeadings(exceptId?: string) {
  await prisma.homeHeroSlide.updateMany({
    where: exceptId ? { id: { not: exceptId } } : {},
    data: { usePrimaryHeading: false },
  });
}

export async function listResolvedPublic() {
  const slides = await prisma.homeHeroSlide.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    include: {
      productVariant: { include: variantInclude },
      productImage: true,
    },
  });
  return slides
    .map(resolveSlide)
    .filter((s) => s.imageUrl != null && s.imageUrl.length > 0);
}

export async function listAllSlideRecords() {
  const slides = await prisma.homeHeroSlide.findMany({
    orderBy: { sortOrder: "asc" },
  });
  return slides.map(toSlideRecord);
}

export async function createSlide(data: {
  sortOrder?: number;
  isActive?: boolean;
  theme: HomeHeroTheme;
  usePrimaryHeading?: boolean;
  eyebrow?: string | null;
  title?: string | null;
  description?: string | null;
  productVariantId: string;
  productImageId: string;
}) {
  const variantId = data.productVariantId.trim();
  const imageId = data.productImageId.trim();
  if (!variantId || !imageId) {
    throw new HttpError(400, "productVariantId and productImageId are required");
  }
  await assertVariantExists(variantId);
  await assertImageBelongsToVariant(imageId, variantId);

  if (data.usePrimaryHeading) {
    await clearOtherPrimaryHeadings();
  }

  const maxOrder = await prisma.homeHeroSlide.aggregate({
    _max: { sortOrder: true },
  });
  const sortOrder = data.sortOrder ?? (maxOrder._max.sortOrder ?? -1) + 1;

  const slide = await prisma.homeHeroSlide.create({
    data: {
      sortOrder,
      isActive: data.isActive ?? true,
      theme: data.theme,
      usePrimaryHeading: data.usePrimaryHeading ?? false,
      eyebrow: data.eyebrow?.trim() || null,
      title: data.title?.trim() || null,
      description: data.description?.trim() || null,
      productVariantId: variantId,
      productImageId: imageId,
    },
  });

  return toSlideRecord(slide);
}

export async function updateSlide(
  id: string,
  data: Partial<{
    sortOrder: number;
    isActive: boolean;
    theme: HomeHeroTheme;
    usePrimaryHeading: boolean;
    eyebrow: string | null;
    title: string | null;
    description: string | null;
    productVariantId: string | null;
    productImageId: string | null;
  }>,
) {
  const existing = await prisma.homeHeroSlide.findUnique({ where: { id } });
  if (!existing) throw new HttpError(404, "Slide not found");

  const variantTouched = data.productVariantId !== undefined;
  const imageTouched = data.productImageId !== undefined;

  const nextVariantId =
    data.productVariantId !== undefined
      ? data.productVariantId === null
        ? null
        : data.productVariantId.trim() || null
      : existing.productVariantId;

  const nextImageId =
    data.productImageId !== undefined
      ? data.productImageId === null
        ? null
        : data.productImageId.trim() || null
      : existing.productImageId;

  if (variantTouched || imageTouched) {
    if (!nextVariantId || !nextImageId) {
      throw new HttpError(
        400,
        "productVariantId and productImageId are required when updating variant or image",
      );
    }
    await assertVariantExists(nextVariantId);
    await assertImageBelongsToVariant(nextImageId, nextVariantId);
  }

  if (data.usePrimaryHeading === true) {
    await clearOtherPrimaryHeadings(id);
  }

  const slide = await prisma.homeHeroSlide.update({
    where: { id },
    data: {
      ...(data.sortOrder !== undefined && { sortOrder: data.sortOrder }),
      ...(data.isActive !== undefined && { isActive: data.isActive }),
      ...(data.theme !== undefined && { theme: data.theme }),
      ...(data.usePrimaryHeading !== undefined && {
        usePrimaryHeading: data.usePrimaryHeading,
      }),
      ...(data.eyebrow !== undefined && {
        eyebrow: data.eyebrow?.trim() || null,
      }),
      ...(data.title !== undefined && { title: data.title?.trim() || null }),
      ...(data.description !== undefined && {
        description: data.description?.trim() || null,
      }),
      ...(data.productVariantId !== undefined && {
        productVariantId:
          data.productVariantId === null
            ? null
            : data.productVariantId.trim() || null,
      }),
      ...(data.productImageId !== undefined && {
        productImageId:
          data.productImageId === null
            ? null
            : data.productImageId.trim() || null,
      }),
    },
  });

  return toSlideRecord(slide);
}

export async function deleteSlide(id: string) {
  await prisma.homeHeroSlide.delete({ where: { id } });
}

export async function reorderSlides(orderedIds: string[]) {
  const all = await prisma.homeHeroSlide.findMany({ select: { id: true } });
  const idSet = new Set(all.map((r) => r.id));
  if (orderedIds.length !== idSet.size) {
    throw new HttpError(
      400,
      "orderedIds must include every slide exactly once",
    );
  }
  for (const sid of orderedIds) {
    if (!idSet.has(sid)) {
      throw new HttpError(400, "Unknown slide id in orderedIds");
    }
  }

  await prisma.$transaction(
    orderedIds.map((slideId, index) =>
      prisma.homeHeroSlide.update({
        where: { id: slideId },
        data: { sortOrder: index },
      }),
    ),
  );
}
