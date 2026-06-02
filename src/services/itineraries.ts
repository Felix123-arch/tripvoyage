import api from './api';

export interface Activity {
  id: string;
  dayId: string;
  title: string;
  description?: string | null;
  time?: string | null;
  location?: string | null;
  type: string;
  status: string;
  badge?: string | null;
}

export interface ItineraryDay {
  id: string;
  itineraryId: string;
  dayNumber: number;
  date: string;
  activities: Activity[];
}

export interface Itinerary {
  id: string;
  userId: string;
  name: string;
  destination: string;
  destinationId?: string | null;
  startDate: string;
  endDate: string;
  year: number;
  status: string;
  weatherTemp?: string | null;
  weatherCond?: string | null;
  weatherDesc?: string | null;
  days: ItineraryDay[];
  createdAt: string;
  updatedAt: string;
}

export async function getItineraries(status?: string): Promise<Itinerary[]> {
  const res = await api.get('/itineraries', { params: status ? { status } : {} });
  return res.data;
}

export async function getItineraryById(id: string): Promise<Itinerary> {
  const res = await api.get(`/itineraries/${id}`);
  return res.data;
}

export async function createItinerary(data: any): Promise<Itinerary> {
  const res = await api.post('/itineraries', data);
  return res.data;
}

export async function updateItinerary(id: string, data: any): Promise<Itinerary> {
  const res = await api.put(`/itineraries/${id}`, data);
  return res.data;
}

export async function deleteItinerary(id: string): Promise<void> {
  await api.delete(`/itineraries/${id}`);
}

export async function addActivity(itineraryId: string, dayId: string, data: any): Promise<Activity> {
  const res = await api.post(`/itineraries/${itineraryId}/days/${dayId}/activities`, data);
  return res.data;
}
