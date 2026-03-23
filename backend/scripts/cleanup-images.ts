/**
 * Cleanup script: sync ProductImage records with the filesystem.
 *
 * 1. DB records pointing to missing files → delete the record
 * 2. Files on disk with no matching DB record → delete the file
 *
 * Usage:  npx tsx scripts/cleanup-images.ts
 */
import "dotenv/config";
import path from "path";
import fs from "fs/promises";
import { prisma } from "../src/lib/prisma";
const UPLOAD_DIR = path.join(process.cwd(), "uploads", "products");

async function main() {
  console.log("🔍 Starting image cleanup...\n");

  // ── 1. Remove DB records whose files are missing ──────────────
  const allImages = await prisma.productImage.findMany();
  let removedRecords = 0;

  for (const img of allImages) {
    // Skip external URLs (S3, Cloudinary, etc.)
    if (img.url.startsWith("http")) continue;

    const filePath = path.join(process.cwd(), img.url);
    try {
      await fs.access(filePath);
    } catch {
      // File doesn't exist → remove the DB record
      await prisma.productImage.delete({ where: { id: img.id } });
      console.log(`  ❌ Removed DB record (file missing): ${img.url}`);
      removedRecords++;
    }
  }

  // ── 2. Remove orphan files with no matching DB record ─────────
  let removedFiles = 0;

  try {
    const files = await fs.readdir(UPLOAD_DIR);
    // Collect all relative URLs currently in the DB
    const dbUrls = new Set(allImages.map((img) => img.url));

    for (const file of files) {
      const relativeUrl = `/uploads/products/${file}`;
      if (!dbUrls.has(relativeUrl)) {
        const fullPath = path.join(UPLOAD_DIR, file);
        await fs.unlink(fullPath);
        console.log(`  🗑️  Removed orphan file: ${file}`);
        removedFiles++;
      }
    }
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      console.log("  ℹ️  Upload directory does not exist, skipping file scan.");
    } else {
      throw err;
    }
  }

  // ── Summary ───────────────────────────────────────────────────
  console.log(`\n✅ Cleanup complete:`);
  console.log(`   DB records removed (missing files): ${removedRecords}`);
  console.log(`   Orphan files deleted: ${removedFiles}`);
}

main()
  .catch((err) => {
    console.error("Cleanup failed:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
