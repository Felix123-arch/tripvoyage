import { PastTrip, MemoryItem } from './types';

export const mockPastTrips: PastTrip[] = [
  {
    id: 'bali-2024',
    destination: 'Bali, Indonesia',
    startDate: 'Aug 12',
    endDate: 'Aug 20',
    durationDays: 8,
    year: 2024,
    gradient: ['#065F46', '#10B981'],
  },
  {
    id: 'paris-2024',
    destination: 'Paris, France',
    startDate: 'Mar 5',
    endDate: 'Mar 12',
    durationDays: 7,
    year: 2024,
    gradient: ['#7C3AED', '#A78BFA'],
  },
  {
    id: 'kyoto-2023',
    destination: 'Kyoto, Japan',
    startDate: 'Oct 20',
    endDate: 'Oct 28',
    durationDays: 8,
    year: 2023,
    gradient: ['#BE185D', '#F472B6'],
  },
];

export const mockMemories: MemoryItem[] = [
  { id: 'mem-1', title: 'Bali 2024', gradient: ['#065F46', '#10B981'] },
  { id: 'mem-2', title: 'Paris 2024', gradient: ['#7C3AED', '#A78BFA'] },
  { id: 'mem-3', title: 'Kyoto 2023', gradient: ['#BE185D', '#F472B6'] },
  { id: 'mem-4', title: 'Tokyo 2025', gradient: ['#1E40AF', '#60A5FA'] },
];
