-- AlterTable
ALTER TABLE "HomeHeroSlide" ADD COLUMN "productImageId" TEXT;

-- Backfill: first image per variant (by order) for slides that already link a variant
UPDATE "HomeHeroSlide" AS h
SET "productImageId" = sub.id
FROM (
  SELECT DISTINCT ON (pi."productVariantId") pi.id, pi."productVariantId"
  FROM "ProductImage" pi
  ORDER BY pi."productVariantId", pi."order" ASC, pi."createdAt" ASC
) AS sub
WHERE h."productVariantId" IS NOT NULL
  AND h."productVariantId" = sub."productVariantId"
  AND h."productImageId" IS NULL;

-- AddForeignKey
ALTER TABLE "HomeHeroSlide" ADD CONSTRAINT "HomeHeroSlide_productImageId_fkey" FOREIGN KEY ("productImageId") REFERENCES "ProductImage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
