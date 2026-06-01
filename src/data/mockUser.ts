import { UserProfile } from './types';

export const mockUser: UserProfile = {
  initials: 'AJ',
  displayName: 'Alex Johnson',
  email: 'alex.johnson@email.com',
  preferences: ['Adventure', 'Relaxation', 'Foodie'],
  budgetLevel: '$$',
  settings: {
    language: 'English',
    currency: 'USD ($)',
    flightAlerts: true,
    itineraryReminders: true,
    darkMode: false,
  },
};

export const allPreferences = [
  'Adventure', 'Relaxation', 'Foodie', 'Culture', 'Nature', 'Shopping',
];
