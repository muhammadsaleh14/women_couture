-- CreateEnum
CREATE TYPE "HomeHeroTheme" AS ENUM ('LIGHT', 'DARK');

-- CreateTable
CREATE TABLE "HomeHeroSlide" (
    "id" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "theme" "HomeHeroTheme" NOT NULL,
    "usePrimaryHeading" BOOLEAN NOT NULL DEFAULT false,
    "eyebrow" TEXT,
    "title" TEXT,
    "description" TEXT,
    "productVariantId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HomeHeroSlide_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "HomeHeroSlide" ADD CONSTRAINT "HomeHeroSlide_productVariantId_fkey" FOREIGN KEY ("productVariantId") REFERENCES "ProductVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;
