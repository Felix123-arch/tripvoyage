import api from './api';

export interface MapPinData {
  id: string;
  name: string;
  positionTop: string;
  positionLeft: string;
  color: string;
  distance: string;
  rating: number;
  reviewCount: number;
  description: string;
  placeType: string;
  destinationId?: string | null;
}

export async function getMapPins(destinationId?: string): Promise<MapPinData[]> {
  const res = await api.get('/map-pins', { params: destinationId ? { destinationId } : {} });
  return res.data;
}
