"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Cleanup script: sync ProductImage records with the filesystem.
 *
 * 1. DB records pointing to missing files → delete the record
 * 2. Files on disk with no matching DB record → delete the file
 *
 * Usage:  npx tsx scripts/cleanup-images.ts
 */
require("dotenv/config");
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
const prisma_1 = require("../src/core/database/prisma");
const UPLOAD_DIR = path_1.default.join(process.cwd(), "uploads", "products");
async function main() {
    console.log("🔍 Starting image cleanup...\n");
    // ── 1. Remove DB records whose files are missing ──────────────
    const allImages = await prisma_1.prisma.productImage.findMany();
    let removedRecords = 0;
    for (const img of allImages) {
        // Skip external URLs (S3, Cloudinary, etc.)
        if (img.url.startsWith("http"))
            continue;
        const filePath = path_1.default.join(process.cwd(), img.url);
        try {
            await promises_1.default.access(filePath);
        }
        catch {
            // File doesn't exist → remove the DB record
            await prisma_1.prisma.productImage.delete({ where: { id: img.id } });
            console.log(`  ❌ Removed DB record (file missing): ${img.url}`);
            removedRecords++;
        }
    }
    // ── 2. Remove orphan files with no matching DB record ─────────
    let removedFiles = 0;
    try {
        const files = await promises_1.default.readdir(UPLOAD_DIR);
        // Collect all relative URLs currently in the DB
        const dbUrls = new Set(allImages.map((img) => img.url));
        for (const file of files) {
            const relativeUrl = `/uploads/products/${file}`;
            if (!dbUrls.has(relativeUrl)) {
                const fullPath = path_1.default.join(UPLOAD_DIR, file);
                await promises_1.default.unlink(fullPath);
                console.log(`  🗑️  Removed orphan file: ${file}`);
                removedFiles++;
            }
        }
    }
    catch (err) {
        if (err.code === "ENOENT") {
            console.log("  ℹ️  Upload directory does not exist, skipping file scan.");
        }
        else {
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
    .finally(() => prisma_1.prisma.$disconnect());
//# sourceMappingURL=cleanup-images.js.map