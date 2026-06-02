import api from './api';

export interface WishlistItem {
  id: string;
  userId: string;
  destination: string;
  notes?: string | null;
  createdAt: string;
}

export async function getWishlist(): Promise<WishlistItem[]> {
  const res = await api.get('/wishlist');
  return res.data;
}

export async function addToWishlist(data: { destination: string; notes?: string }): Promise<WishlistItem> {
  const res = await api.post('/wishlist', data);
  return res.data;
}

export async function removeFromWishlist(id: string): Promise<void> {
  await api.delete(`/wishlist/${id}`);
}
