// Get a reliable image URL for a destination or place
// Unsplash CDN works directly from China — no proxy needed
// Other external URLs go through the backend proxy to bypass GFW
export function getImageUrl(url?: string | null, _name?: string): string | null {
  if (!url) return null;
  if (url.startsWith('/images/')) return url;
  if (url.startsWith('http')) {
    // Unsplash CDN is accessible from China — use directly
    if (url.includes('images.unsplash.com') || url.includes('source.unsplash.com')) {
      return url;
    }
    // Other external URLs route through proxy
    const apiBase = process.env.EXPO_PUBLIC_API_URL || '/api/v1';
    return `${apiBase}/images/proxy?url=${encodeURIComponent(url)}`;
  }
  return url;
}
