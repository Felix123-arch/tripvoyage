// Get a reliable image URL for a destination or place
// Uses picsum.photos (free, no API key) with consistent seed-based images
export function getImageUrl(url?: string | null, name?: string): string | null {
  // If we have a stored URL, use it (through proxy for external URLs)
  if (url) {
    if (url.startsWith('/images/') || url.startsWith('/api/')) return url;
    if (url.startsWith('http')) {
      const apiBase = process.env.EXPO_PUBLIC_API_URL || '';
      return `${apiBase}/images/proxy?url=${encodeURIComponent(url)}`;
    }
    return url;
  }
  // Fallback: generate a consistent landscape photo from picsum
  if (name) {
    const seed = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    return `https://picsum.photos/seed/${seed}/800/400`;
  }
  return null;
}
