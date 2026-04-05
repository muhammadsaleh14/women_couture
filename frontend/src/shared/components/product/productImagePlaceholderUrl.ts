/** Sentinel `imageUrl` when a variant has no photos (renders inline SVG in UI). */
export const PRODUCT_IMAGE_PLACEHOLDER_URL =
  "__wc_product_image_placeholder__" as const;

export function isProductImagePlaceholderUrl(url: string): boolean {
  return url === PRODUCT_IMAGE_PLACEHOLDER_URL || url.trim() === "";
}
