/**
 * Cleanup script: sync ProductImage records with the filesystem.
 *
 * 1. DB records pointing to missing files → delete the record
 * 2. Files on disk with no matching DB record → delete the file
 *
 * Usage:  npx tsx scripts/cleanup-images.ts
 */
import "dotenv/config";
