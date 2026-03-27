/**
 * Convert a DB image path to a full URL the client can load.
 *
 * - Relative paths like `/uploads/products/file.jpg` → `http://localhost:3000/uploads/products/file.jpg`
 * - Full URLs (future: S3, Cloudinary) pass through unchanged.
 */
export function toImageUrl(dbPath: string): string {
  if (dbPath.startsWith("http")) return dbPath;

  const origin = process.env.SERVER_URL || "http://localhost:3000";
  return `${origin.replace(/\/$/, "")}${dbPath.startsWith("/") ? "" : "/"}${dbPath}`;
}
