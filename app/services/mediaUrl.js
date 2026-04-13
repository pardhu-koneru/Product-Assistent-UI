/**
 * Backend base URL for resolving media file paths.
 * DRF ImageField returns paths like "/media/products/2025/01/img.jpg"
 * which need to be prefixed with the backend origin.
 */
const BACKEND_URL = "http://localhost:8000";

/**
 * Resolve a media URL from the backend to an absolute URL.
 * Handles: null/undefined, already-absolute URLs, and relative paths.
 *
 * @param {string|null} url — raw URL from API response
 * @returns {string|null}
 */
export function resolveMediaUrl(url) {
  if (!url) return null;
  // Already absolute (http:// or https://)
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  // Relative path from backend — prepend origin
  return `${BACKEND_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}
