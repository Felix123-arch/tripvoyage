import api from './api';

export interface Article {
  id: string;
  title: string;
  description: string;
  readTimeMinutes: number;
  gradientStart: string;
  gradientEnd: string;
  body?: string | null;
}

export async function getArticles(): Promise<Article[]> {
  const res = await api.get('/articles');
  return res.data;
}

export async function getArticleById(id: string): Promise<Article | null> {
  const res = await api.get(`/articles/${id}`);
  return res.data;
}
