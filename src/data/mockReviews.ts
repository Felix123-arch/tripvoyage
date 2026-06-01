import { Review } from './types';

export const mockReviews: Review[] = [
  {
    id: 'review-1',
    authorName: 'Sarah M.',
    authorRole: 'Tokyo Traveler',
    text: 'Get a Suica card right at the airport! It works on trains, buses, and even at convenience stores. Saved me so much time not having to buy individual tickets.',
    location: 'Tokyo, Japan',
    helpfulVotes: 234,
  },
  {
    id: 'review-2',
    authorName: 'James K.',
    authorRole: 'Bali Explorer',
    text: 'Book your temple tours early in the morning before the crowds arrive. The light is better for photos too!',
    location: 'Bali, Indonesia',
    helpfulVotes: 189,
  },
];
