import { prisma } from '../lib/prisma.js';

export async function getMapPins(destinationId?: string) {
  const where: any = {};
  if (destinationId) where.destinationId = destinationId;
  return prisma.mapPin.findMany({ where });
}
