import type { HomeHeroTheme, Prisma } from "@prisma/client";
import { prisma } from "../../core/database/prisma";
import { HttpError } from "../../core/errors/http-error";
import { toImageUrl } from "../../core/utils/image-url";

const variantInclude = {
  product: true,
  images: { orderBy: { order: "asc" as const } },
} satisfies Prisma.ProductVariantInclude;

type SlideWithVariant = Prisma.HomeHeroSlideGetPayload<{
  include: {
    productVariant: { include: typeof variantInclude };
  };
}>;

function resolveSlide(slide: SlideWithVariant) {
  const v = slide.productVariant;
  const product = v?.product;
  const images = v?.images ?? [];
  const firstImg = images[0];
  const imageUrl = firstImg ? toImageUrl(firstImg.url) : null;

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
    createdAt: s.createdAt.toISOString(),
    updatedAt: s.updatedAt.toISOString(),
  };
}

async function assertVariantExists(id: string) {
  const v = await prisma.productVariant.findUnique({ where: { id } });
  if (!v) throw new HttpError(400, "Product variant not found");
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
    },
  });
  return slides.map(resolveSlide);
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
  productVariantId?: string | null;
}) {
  const variantId = data.productVariantId?.trim() || null;
  if (!variantId) {
    if (!data.title?.trim()) {
      throw new HttpError(
        400,
        "title is required when productVariantId is not set",
      );
    }
  } else {
    await assertVariantExists(variantId);
  }

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
  }>,
) {
  const existing = await prisma.homeHeroSlide.findUnique({ where: { id } });
  if (!existing) throw new HttpError(404, "Slide not found");

  const nextVariantId =
    data.productVariantId !== undefined
      ? data.productVariantId?.trim() || null
      : existing.productVariantId;

  const nextTitle =
    data.title !== undefined ? data.title?.trim() || null : existing.title;

  if (!nextVariantId && !nextTitle) {
    throw new HttpError(
      400,
      "title is required when productVariantId is not set",
    );
  }

  if (data.productVariantId !== undefined && data.productVariantId?.trim()) {
    await assertVariantExists(data.productVariantId.trim());
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
