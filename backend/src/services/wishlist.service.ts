import { z } from 'zod';
import { prisma } from '../lib/prisma.js';

export const createWishlistSchema = z.object({
  destination: z.string().optional(),
  notes: z.string().optional(),
});

export async function getUserWishlist(userId: string) {
  return prisma.wishlistItem.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
}

export async function addToWishlist(userId: string, data: z.infer<typeof createWishlistSchema>) {
  return prisma.wishlistItem.create({
    data: { userId, destination: data.destination, notes: data.notes },
  });
}

export async function removeFromWishlist(id: string, userId: string) {
  const item = await prisma.wishlistItem.findFirst({ where: { id, userId } });
  if (!item) return false;
  await prisma.wishlistItem.delete({ where: { id } });
  return true;
}
