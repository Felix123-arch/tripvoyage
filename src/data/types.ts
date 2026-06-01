export type ActivityType = 'flight' | 'hotel' | 'landmark' | 'food' | 'nature' | 'transport';
export type BadgeVariant = 'success' | 'warning' | 'info';
export type PinColor = 'blue' | 'green' | 'amber' | 'red';
export type DestinationCategory = 'Beach' | 'Mountain' | 'City Break' | 'Family' | 'Adventure' | 'Relaxation';
export type BudgetLevel = '$' | '$$' | '$$$';
export type TripStatus = 'upcoming' | 'completed' | 'draft';

export interface Destination {
  id: string;
  name: string;
  description: string;
  category: DestinationCategory;
  rating: number;
  reviewCount: number;
  gradient: string[];
}

export interface Activity {
  id: string;
  title: string;
  description?: string;
  time?: string;
  location?: string;
  type: ActivityType;
  status: 'confirmed' | 'action_required' | 'pending';
  badge?: BadgeVariant;
}

export interface Day {
  dayNumber: number;
  date: string;
  activities: Activity[];
}

export interface Weather {
  location: string;
  temperature: string;
  condition: string;
  description: string;
}

export interface Itinerary {
  id: string;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  year: number;
  days: Day[];
  weather: Weather;
}

export interface PastTrip {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
  durationDays: number;
  year: number;
  gradient: string[];
}

export interface MemoryItem {
  id: string;
  title: string;
  gradient: string[];
}

export interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
}

export interface Article {
  id: string;
  title: string;
  description: string;
  readTimeMinutes: number;
  gradient: string[];
}

export interface Review {
  id: string;
  authorName: string;
  authorRole: string;
  text: string;
  location: string;
  helpfulVotes: number;
}

export interface MapPinData {
  id: string;
  name: string;
  position: { top: string; left: string };
  color: PinColor;
  distance: string;
  rating: number;
  reviewCount: number;
  description: string;
  placeType: string;
}

export interface UserProfile {
  initials: string;
  displayName: string;
  email: string;
  preferences: string[];
  budgetLevel: BudgetLevel;
  settings: {
    language: string;
    currency: string;
    flightAlerts: boolean;
    itineraryReminders: boolean;
    darkMode: boolean;
  };
}
