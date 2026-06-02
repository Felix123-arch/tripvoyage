import api from './api';

export interface SavedDestination {
  id: string;
  userId: string;
  destinationId: string;
  destination?: {
    id: string;
    name: string;
    description: string;
    category: string;
    rating: number;
    reviewCount: number;
    gradientStart: string;
    gradientEnd: string;
    imageUrl?: string | null;
    lat: number;
    lng: number;
  };
  createdAt: string;
}

export async function getSaved(): Promise<SavedDestination[]> {
  const res = await api.get('/saved');
  return res.data;
}

export async function saveDestination(destinationId: string): Promise<SavedDestination> {
  const res = await api.post('/saved', { destinationId });
  return res.data;
}

export async function unsaveDestination(id: string): Promise<void> {
  await api.delete(`/saved/${id}`);
}
