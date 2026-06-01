import { Destination, DestinationCategory } from './types';

export const mockDestinations: Destination[] = [
  {
    id: 'bali',
    name: 'Bali, Indonesia',
    description: 'Paradise beaches & ancient temples',
    category: 'Beach',
    rating: 4.8,
    reviewCount: 2341,
    gradient: ['#BE185D', '#EC4899'],
  },
  {
    id: 'tokyo',
    name: 'Tokyo, Japan',
    description: 'Futuristic city meets ancient tradition',
    category: 'City Break',
    rating: 4.9,
    reviewCount: 5120,
    gradient: ['#BE185D', '#F472B6'],
  },
  {
    id: 'swiss',
    name: 'Swiss Alps',
    description: 'Snow-capped peaks & alpine villages',
    category: 'Mountain',
    rating: 4.7,
    reviewCount: 1890,
    gradient: ['#065F46', '#10B981'],
  },
  {
    id: 'paris',
    name: 'Paris, France',
    description: 'Romance, art & world-class cuisine',
    category: 'City Break',
    rating: 4.8,
    reviewCount: 6780,
    gradient: ['#7C3AED', '#A78BFA'],
  },
  {
    id: 'kyoto',
    name: 'Kyoto, Japan',
    description: 'Ancient temples & cherry blossoms',
    category: 'Adventure',
    rating: 4.9,
    reviewCount: 4520,
    gradient: ['#BE185D', '#EC4899'],
  },
];

export const destinationCategories: DestinationCategory[] = [
  'Beach', 'Mountain', 'City Break', 'Family', 'Adventure', 'Relaxation',
];
