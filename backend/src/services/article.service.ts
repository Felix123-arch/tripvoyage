import { prisma } from '../lib/prisma.js';

export async function getArticles() {
  return prisma.article.findMany({ orderBy: { createdAt: 'desc' } });
}

export async function getArticleById(id: string) {
  return prisma.article.findUnique({ where: { id } });
}
