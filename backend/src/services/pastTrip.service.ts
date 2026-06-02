import { z } from 'zod';
import { prisma } from '../lib/prisma.js';

export const createPastTripSchema = z.object({
  destination: z.string().min(1),
  startDate: z.string(),
  endDate: z.string(),
  durationDays: z.number().int(),
  year: z.number().int(),
  gradientStart: z.string().optional(),
  gradientEnd: z.string().optional(),
});

export async function getUserPastTrips(userId: string) {
  return prisma.pastTrip.findMany({
    where: { userId },
    orderBy: { year: 'desc' },
  });
}

export async function createPastTrip(userId: string, data: z.infer<typeof createPastTripSchema>) {
  return prisma.pastTrip.create({
    data: {
      userId,
      destination: data.destination,
      startDate: data.startDate,
      endDate: data.endDate,
      durationDays: data.durationDays,
      year: data.year,
      gradientStart: data.gradientStart || '#065F46',
      gradientEnd: data.gradientEnd || '#10B981',
    },
  });
}
