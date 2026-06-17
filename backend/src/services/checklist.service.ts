import { z } from 'zod';
import { prisma } from '../lib/prisma.js';

export const createChecklistSchema = z.object({
  label: z.string().min(1),
  itineraryId: z.string().optional(),
  category: z.string().optional(),
});

export const updateChecklistSchema = z.object({
  label: z.string().optional(),
  completed: z.boolean().optional(),
});

export async function getUserChecklist(userId: string, itineraryId?: string) {
  const where: any = { userId };
  if (itineraryId) where.itineraryId = itineraryId;
  return prisma.checklistItem.findMany({ where, orderBy: { createdAt: 'asc' } });
}

export async function createChecklistItem(userId: string, data: z.infer<typeof createChecklistSchema>) {
  return prisma.checklistItem.create({
    data: { userId, label: data.label, itineraryId: data.itineraryId, category: data.category || 'other' },
  });
}

export async function updateChecklistItem(id: string, userId: string, data: z.infer<typeof updateChecklistSchema>) {
  const item = await prisma.checklistItem.findFirst({ where: { id, userId } });
  if (!item) return null;
  return prisma.checklistItem.update({ where: { id }, data });
}

export async function deleteChecklistItem(id: string, userId: string) {
  const item = await prisma.checklistItem.findFirst({ where: { id, userId } });
  if (!item) return false;
  await prisma.checklistItem.delete({ where: { id } });
  return true;
}
