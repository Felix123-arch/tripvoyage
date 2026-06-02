import { Router, Request, Response, NextFunction } from 'express';
import * as articleService from '../services/article.service.js';

export const articleRoutes = Router();

articleRoutes.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const articles = await articleService.getArticles();
    res.json(articles);
  } catch (err) {
    next(err);
  }
});

articleRoutes.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const article = await articleService.getArticleById(req.params.id as string);
    if (!article) {
      res.status(404).json({ error: 'Article not found' });
      return;
    }
    res.json(article);
  } catch (err) {
    next(err);
  }
});
