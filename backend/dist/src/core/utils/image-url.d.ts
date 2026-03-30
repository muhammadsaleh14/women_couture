/**
 * Convert a DB image path to a full URL the client can load.
 *
 * - Relative paths like `/uploads/products/file.jpg` → `http://localhost:3000/uploads/products/file.jpg`
 * - Full URLs (future: S3, Cloudinary) pass through unchanged.
 */
export declare function toImageUrl(dbPath: string): string;
