-- AlterTable
ALTER TABLE "ProductVariant" ADD COLUMN "sortOrder" INTEGER NOT NULL DEFAULT 0;

-- Backfill from creation time so existing products keep a stable order
WITH ranked AS (
  SELECT
    id,
    ROW_NUMBER() OVER (PARTITION BY "productId" ORDER BY "createdAt" ASC) - 1 AS ord
  FROM "ProductVariant"
)
UPDATE "ProductVariant" AS v
SET "sortOrder" = ranked.ord
FROM ranked
WHERE v.id = ranked.id;

-- CreateIndex
CREATE INDEX "ProductVariant_productId_sortOrder_idx" ON "ProductVariant"("productId", "sortOrder");
