import api from './api';

export interface Review {
  id: string;
  userId?: string | null;
  authorName: string;
  authorRole: string;
  text: string;
  location: string;
  helpfulVotes: number;
  destinationId?: string | null;
}

export async function getReviews(destinationId?: string): Promise<Review[]> {
  const res = await api.get('/reviews', { params: destinationId ? { destinationId } : {} });
  return res.data;
}

export async function createReview(data: {
  authorName: string;
  authorRole?: string;
  text: string;
  location: string;
  destinationId?: string;
}): Promise<Review> {
  const res = await api.post('/reviews', data);
  return res.data;
}
