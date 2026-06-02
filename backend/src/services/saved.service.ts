import { prisma } from '../lib/prisma.js';

export async function getSavedDestinations(userId: string) {
  return prisma.savedDestination.findMany({
    where: { userId },
    include: { destination: true },
    orderBy: { createdAt: 'desc' },
  });
}

export async function saveDestination(userId: string, destinationId: string) {
  const existing = await prisma.savedDestination.findUnique({
    where: { userId_destinationId: { userId, destinationId } },
  });
  if (existing) return existing;

  return prisma.savedDestination.create({
    data: { userId, destinationId },
    include: { destination: true },
  });
}

export async function unsaveDestination(id: string, userId: string) {
  const item = await prisma.savedDestination.findFirst({ where: { id, userId } });
  if (!item) return false;
  await prisma.savedDestination.delete({ where: { id } });
  return true;
}
