import { z } from 'zod';
import { prisma } from '../lib/prisma.js';

export const createReviewSchema = z.object({
  authorName: z.string().min(1),
  authorRole: z.string().optional().default(''),
  text: z.string().min(1),
  location: z.string().min(1),
  destinationId: z.string().optional(),
});

export async function getReviews(destinationId?: string) {
  const where: any = {};
  if (destinationId) where.destinationId = destinationId;
  return prisma.review.findMany({ where, orderBy: { createdAt: 'desc' } });
}

export async function createReview(userId: string | undefined, data: z.infer<typeof createReviewSchema>) {
  return prisma.review.create({
    data: {
      userId: userId || null,
      authorName: data.authorName,
      authorRole: data.authorRole || '',
      text: data.text,
      location: data.location,
      destinationId: data.destinationId || null,
    },
  });
}
