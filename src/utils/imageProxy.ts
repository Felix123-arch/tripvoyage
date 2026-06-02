// If image is an external URL (Wikipedia etc.), route through server proxy to bypass GFW
export function getImageUrl(url?: string | null): string | null {
  if (!url) return null;
  if (url.startsWith('/images/') || url.startsWith('/api/')) return url;
  if (url.startsWith('http')) {
    // Route external URLs through the backend image proxy
    const apiBase = process.env.EXPO_PUBLIC_API_URL || '';
    return `${apiBase}/images/proxy?url=${encodeURIComponent(url)}`;
  }
  return url;
}
