import { prisma } from '../lib/prisma.js';

export async function getDestinations(params: { category?: string; search?: string }) {
  const where: any = {};
  if (params.category && params.category !== 'All') {
    where.category = params.category;
  }
  if (params.search) {
    where.OR = [
      { name: { contains: params.search, mode: 'insensitive' } },
      { description: { contains: params.search, mode: 'insensitive' } },
    ];
  }

  return prisma.destination.findMany({ where, orderBy: { rating: 'desc' } });
}

export async function getDestinationById(id: string) {
  const dest = await prisma.destination.findUnique({ where: { id } });
  if (!dest) return null;
  return dest;
}

export async function getCategories() {
  const results = await prisma.destination.findMany({
    select: { category: true },
    distinct: ['category'],
  });
  return results.map((r) => r.category);
}
