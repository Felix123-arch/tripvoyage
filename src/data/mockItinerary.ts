import { Itinerary } from './types';

export const mockItinerary: Itinerary = {
  id: 'tokyo-adventure',
  name: 'Tokyo Adventure',
  destination: 'Tokyo, Japan',
  startDate: 'Jun 15',
  endDate: 'Jun 22',
  year: 2025,
  weather: {
    location: 'Tokyo, Japan',
    temperature: '22°C',
    condition: 'Sunny',
    description: 'Clear skies',
  },
  days: [
    {
      dayNumber: 1,
      date: 'June 15',
      activities: [
        {
          id: 'flight-ua882',
          title: 'Flight UA-882',
          description: 'Los Angeles to Tokyo Narita',
          time: '11:30 AM',
          location: 'LAX → NRT',
          type: 'flight',
          status: 'confirmed',
          badge: 'success',
        },
        {
          id: 'hotel-checkin',
          title: 'Hotel Check-in',
          description: 'Park Hyatt Tokyo',
          time: '3:00 PM',
          location: 'Shinjuku, Tokyo',
          type: 'hotel',
          status: 'confirmed',
          badge: 'success',
        },
      ],
    },
    {
      dayNumber: 2,
      date: 'June 16',
      activities: [
        {
          id: 'sensoji',
          title: 'Senso-ji Temple',
          description: "Tokyo's oldest Buddhist temple",
          time: '9:00 AM',
          location: 'Asakusa, Taito City',
          type: 'landmark',
          status: 'confirmed',
        },
        {
          id: 'sushi-class',
          title: 'Sushi Making Class',
          description: 'Learn to make authentic nigiri & maki',
          time: '2:00 PM',
          location: 'Tsukiji Cooking Studio',
          type: 'food',
          status: 'confirmed',
        },
      ],
    },
    {
      dayNumber: 3,
      date: 'June 17',
      activities: [
        {
          id: 'mt-fuji',
          title: 'Mt. Fuji Day Trip',
          description: 'Bus departs Shinjuku Station',
          time: '8:00 AM',
          location: 'Shinjuku Station, Tokyo',
          type: 'nature',
          status: 'action_required',
          badge: 'warning',
        },
      ],
    },
  ],
};
