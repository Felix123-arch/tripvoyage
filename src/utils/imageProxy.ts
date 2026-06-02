// Get a reliable image URL for a destination or place
// External URLs (Wikipedia etc.) are routed through the backend proxy to bypass GFW
export function getImageUrl(url?: string | null, _name?: string): string | null {
  if (!url) return null;
  if (url.startsWith('/images/')) return url;
  if (url.startsWith('http')) {
    // Route external URLs through the backend image proxy
    const apiBase = process.env.EXPO_PUBLIC_API_URL || '/api/v1';
    return `${apiBase}/images/proxy?url=${encodeURIComponent(url)}`;
  }
  return url;
}
