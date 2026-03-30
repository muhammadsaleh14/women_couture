"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listResolvedPublic = listResolvedPublic;
exports.listAllSlideRecords = listAllSlideRecords;
exports.createSlide = createSlide;
exports.updateSlide = updateSlide;
exports.deleteSlide = deleteSlide;
exports.reorderSlides = reorderSlides;
const prisma_1 = require("../../core/database/prisma");
const http_error_1 = require("../../core/errors/http-error");
const image_url_1 = require("../../core/utils/image-url");
const variantInclude = {
    product: true,
    images: { orderBy: { order: "asc" } },
};
function resolveSlide(slide) {
    const v = slide.productVariant;
    const product = v?.product;
    const images = v?.images ?? [];
    const firstImg = images[0];
    const imageUrl = firstImg ? (0, image_url_1.toImageUrl)(firstImg.url) : null;
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
function toSlideRecord(s) {
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
async function assertVariantExists(id) {
    const v = await prisma_1.prisma.productVariant.findUnique({ where: { id } });
    if (!v)
        throw new http_error_1.HttpError(400, "Product variant not found");
}
async function clearOtherPrimaryHeadings(exceptId) {
    await prisma_1.prisma.homeHeroSlide.updateMany({
        where: exceptId ? { id: { not: exceptId } } : {},
        data: { usePrimaryHeading: false },
    });
}
async function listResolvedPublic() {
    const slides = await prisma_1.prisma.homeHeroSlide.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
        include: {
            productVariant: { include: variantInclude },
        },
    });
    return slides.map(resolveSlide);
}
async function listAllSlideRecords() {
    const slides = await prisma_1.prisma.homeHeroSlide.findMany({
        orderBy: { sortOrder: "asc" },
    });
    return slides.map(toSlideRecord);
}
async function createSlide(data) {
    const variantId = data.productVariantId?.trim() || null;
    if (!variantId) {
        if (!data.title?.trim()) {
            throw new http_error_1.HttpError(400, "title is required when productVariantId is not set");
        }
    }
    else {
        await assertVariantExists(variantId);
    }
    if (data.usePrimaryHeading) {
        await clearOtherPrimaryHeadings();
    }
    const maxOrder = await prisma_1.prisma.homeHeroSlide.aggregate({
        _max: { sortOrder: true },
    });
    const sortOrder = data.sortOrder ?? (maxOrder._max.sortOrder ?? -1) + 1;
    const slide = await prisma_1.prisma.homeHeroSlide.create({
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
async function updateSlide(id, data) {
    const existing = await prisma_1.prisma.homeHeroSlide.findUnique({ where: { id } });
    if (!existing)
        throw new http_error_1.HttpError(404, "Slide not found");
    const nextVariantId = data.productVariantId !== undefined
        ? data.productVariantId?.trim() || null
        : existing.productVariantId;
    const nextTitle = data.title !== undefined ? data.title?.trim() || null : existing.title;
    if (!nextVariantId && !nextTitle) {
        throw new http_error_1.HttpError(400, "title is required when productVariantId is not set");
    }
    if (data.productVariantId !== undefined && data.productVariantId?.trim()) {
        await assertVariantExists(data.productVariantId.trim());
    }
    if (data.usePrimaryHeading === true) {
        await clearOtherPrimaryHeadings(id);
    }
    const slide = await prisma_1.prisma.homeHeroSlide.update({
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
                productVariantId: data.productVariantId === null
                    ? null
                    : data.productVariantId.trim() || null,
            }),
        },
    });
    return toSlideRecord(slide);
}
async function deleteSlide(id) {
    await prisma_1.prisma.homeHeroSlide.delete({ where: { id } });
}
async function reorderSlides(orderedIds) {
    const all = await prisma_1.prisma.homeHeroSlide.findMany({ select: { id: true } });
    const idSet = new Set(all.map((r) => r.id));
    if (orderedIds.length !== idSet.size) {
        throw new http_error_1.HttpError(400, "orderedIds must include every slide exactly once");
    }
    for (const sid of orderedIds) {
        if (!idSet.has(sid)) {
            throw new http_error_1.HttpError(400, "Unknown slide id in orderedIds");
        }
    }
    await prisma_1.prisma.$transaction(orderedIds.map((slideId, index) => prisma_1.prisma.homeHeroSlide.update({
        where: { id: slideId },
        data: { sortOrder: index },
    })));
}
//# sourceMappingURL=home-hero.service.js.map