// Get a reliable image URL for a destination or place
// All external URLs go through the server proxy (with disk cache)
export function getImageUrl(url?: string | null, _name?: string): string | null {
  if (!url) return null;
  if (url.startsWith('/images/')) return url;
  if (url.startsWith('http')) {
    const apiBase = process.env.EXPO_PUBLIC_API_URL || '/api/v1';
    return `${apiBase}/images/proxy?url=${encodeURIComponent(url)}`;
  }
  return url;
}
