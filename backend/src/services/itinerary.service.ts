import { z } from 'zod';
import { prisma } from '../lib/prisma.js';

export const createItinerarySchema = z.object({
  name: z.string().min(1),
  destination: z.string().min(1),
  destinationId: z.string().optional(),
  startDate: z.string(),
  endDate: z.string(),
  year: z.number().int(),
  weatherTemp: z.string().optional(),
  weatherCond: z.string().optional(),
  weatherDesc: z.string().optional(),
  days: z.array(z.object({
    dayNumber: z.number().int(),
    date: z.string(),
    activities: z.array(z.object({
      title: z.string(),
      description: z.string().optional(),
      time: z.string().optional(),
      location: z.string().optional(),
      type: z.string(),
      status: z.string().default('confirmed'),
      badge: z.string().optional(),
    })).optional(),
  })).optional(),
});

export const createActivitySchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  time: z.string().optional(),
  location: z.string().optional(),
  type: z.string(),
  status: z.string().default('confirmed'),
  badge: z.string().optional(),
});

export async function getUserItineraries(userId: string, status?: string) {
  const where: any = { userId };
  if (status) where.status = status;
  return prisma.itinerary.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: { days: { include: { activities: true }, orderBy: { dayNumber: 'asc' } } },
  });
}

export async function getItineraryById(id: string, userId: string) {
  const itinerary = await prisma.itinerary.findFirst({
    where: { id, userId },
    include: { days: { include: { activities: true }, orderBy: { dayNumber: 'asc' } } },
  });
  return itinerary;
}

export async function createItinerary(userId: string, data: z.infer<typeof createItinerarySchema>) {
  // Auto-generate days from date range if not provided
  let daysToCreate = data.days;
  if (!daysToCreate || daysToCreate.length === 0) {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    const dayCount = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);
    daysToCreate = [];
    for (let i = 0; i < dayCount; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      daysToCreate.push({
        dayNumber: i + 1,
        date: d.toISOString().split('T')[0],
        activities: undefined,
      });
    }
  }

  return prisma.itinerary.create({
    data: {
      userId,
      name: data.name,
      destination: data.destination,
      destinationId: data.destinationId,
      startDate: data.startDate,
      endDate: data.endDate,
      year: data.year,
      weatherTemp: data.weatherTemp,
      weatherCond: data.weatherCond,
      weatherDesc: data.weatherDesc,
      days: {
        create: daysToCreate.map((day: any) => ({
          dayNumber: day.dayNumber,
          date: day.date,
          activities: day.activities ? {
            create: day.activities.map((a: any) => ({
              title: a.title,
              description: a.description,
              time: a.time,
              location: a.location,
              type: a.type,
              status: a.status,
              badge: a.badge,
            })),
          } : undefined,
        })),
      },
    },
    include: { days: { include: { activities: true } } },
  });
}

export async function updateItinerary(id: string, userId: string, data: Partial<z.infer<typeof createItinerarySchema>>) {
  const it = await prisma.itinerary.findFirst({ where: { id, userId } });
  if (!it) return null;

  return prisma.itinerary.update({
    where: { id },
    data: {
      name: data.name,
      destination: data.destination,
      startDate: data.startDate,
      endDate: data.endDate,
      weatherTemp: data.weatherTemp,
      weatherCond: data.weatherCond,
      weatherDesc: data.weatherDesc,
    },
    include: { days: { include: { activities: true } } },
  });
}

export async function deleteItinerary(id: string, userId: string) {
  const it = await prisma.itinerary.findFirst({ where: { id, userId } });
  if (!it) return false;
  await prisma.itinerary.delete({ where: { id } });
  return true;
}

export async function addActivity(dayId: string, userId: string, data: z.infer<typeof createActivitySchema>) {
  const day = await prisma.itineraryDay.findUnique({ where: { id: dayId }, include: { itinerary: true } });
  if (!day || day.itinerary.userId !== userId) return null;

  return prisma.activity.create({
    data: {
      dayId,
      title: data.title,
      description: data.description,
      time: data.time,
      location: data.location,
      type: data.type,
      status: data.status,
      badge: data.badge,
    },
  });
}

export async function updateActivity(id: string, userId: string, data: Partial<z.infer<typeof createActivitySchema>>) {
  const activity = await prisma.activity.findUnique({ where: { id }, include: { day: { include: { itinerary: true } } } });
  if (!activity || activity.day.itinerary.userId !== userId) return null;

  return prisma.activity.update({ where: { id }, data });
}

export async function deleteActivity(id: string, userId: string) {
  const activity = await prisma.activity.findUnique({ where: { id }, include: { day: { include: { itinerary: true } } } });
  if (!activity || activity.day.itinerary.userId !== userId) return false;

  await prisma.activity.delete({ where: { id } });
  return true;
}
