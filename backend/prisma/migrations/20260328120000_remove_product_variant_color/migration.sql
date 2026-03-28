-- Drop unique constraint on (productId, color); variants are identified by id only.
DROP INDEX IF EXISTS "ProductVariant_productId_color_key";

ALTER TABLE "ProductVariant" DROP COLUMN IF EXISTS "color";
