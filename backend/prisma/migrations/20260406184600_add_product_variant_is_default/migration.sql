-- AlterTable
ALTER TABLE "ProductVariant" ADD COLUMN     "isDefault" BOOLEAN NOT NULL DEFAULT false;

-- One default variant per product (existing rows: first by sort order).
WITH ranked AS (
  SELECT
    id,
    ROW_NUMBER() OVER (
      PARTITION BY "productId"
      ORDER BY "sortOrder" ASC, "createdAt" ASC
    ) AS rn
  FROM "ProductVariant"
)
UPDATE "ProductVariant" pv
SET "isDefault" = true
FROM ranked r
WHERE pv.id = r.id AND r.rn = 1;

CREATE UNIQUE INDEX "ProductVariant_one_default_per_product"
ON "ProductVariant" ("productId")
WHERE "isDefault" = true;
