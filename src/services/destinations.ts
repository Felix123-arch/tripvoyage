import api from './api';

export interface Destination {
  id: string;
  name: string;
  description: string;
  category: string;
  rating: number;
  reviewCount: number;
  gradientStart: string;
  gradientEnd: string;
  imageUrl?: string | null;
}

export async function getDestinations(params?: {
  category?: string;
  search?: string;
}): Promise<Destination[]> {
  const res = await api.get('/destinations', { params });
  return res.data;
}

export async function getDestinationById(id: string): Promise<Destination | null> {
  const res = await api.get(`/destinations/${id}`);
  return res.data;
}

export async function getCategories(): Promise<string[]> {
  const res = await api.get('/destinations/categories');
  return res.data;
}
