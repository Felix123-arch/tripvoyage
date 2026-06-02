import api from './api';

export interface MapPinData {
  id: string;
  name: string;
  lat: number;
  lng: number;
  color: string;
  distance: string;
  rating: number;
  reviewCount: number;
  description: string;
  placeType: string;
  imageUrl?: string | null;
  destinationId?: string | null;
}

export async function getMapPins(destinationId?: string): Promise<MapPinData[]> {
  const res = await api.get('/map-pins', { params: destinationId ? { destinationId } : {} });
  return res.data;
}
