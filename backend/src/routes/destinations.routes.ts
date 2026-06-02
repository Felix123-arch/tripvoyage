import { Router, Request, Response, NextFunction } from 'express';
import * as destService from '../services/destination.service.js';

export const destinationRoutes = Router();

destinationRoutes.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const destinations = await destService.getDestinations({
      category: req.query.category as string | undefined,
      search: req.query.search as string | undefined,
    });
    res.json(destinations);
  } catch (err) {
    next(err);
  }
});

destinationRoutes.get('/categories', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await destService.getCategories();
    res.json(categories);
  } catch (err) {
    next(err);
  }
});

destinationRoutes.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dest = await destService.getDestinationById(req.params.id as string);
    if (!dest) {
      res.status(404).json({ error: 'Destination not found' });
      return;
    }
    res.json(dest);
  } catch (err) {
    next(err);
  }
});
