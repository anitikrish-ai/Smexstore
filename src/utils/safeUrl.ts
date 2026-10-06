/**
 * Link safety helpers. API-supplied URLs are untrusted: a value such as "javascript:..." must never
 * reach an href attribute.
 */
const ALLOWED_PROTOCOLS = new Set(['http:', 'https:', 'mailto:', 'tel:']);

/** Returns a normalized URL string if it is safe to link to, otherwise null. */
export function toSafeUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;

  // Same-site relative paths are fine; protocol-relative "//host" is not.
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) return trimmed;

  try {
    const parsed = new URL(trimmed);
    return ALLOWED_PROTOCOLS.has(parsed.protocol) ? parsed.toString() : null;
  } catch {
    return null;
  }
}

export const isExternalUrl = (url: string): boolean => /^https?:\/\//i.test(url);
