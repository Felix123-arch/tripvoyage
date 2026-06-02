import { Router, Request, Response, NextFunction } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import * as savedService from '../services/saved.service.js';

export const savedRoutes = Router();

savedRoutes.use(authMiddleware);

savedRoutes.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const items = await savedService.getSavedDestinations(req.user!.id);
    res.json(items);
  } catch (err) {
    next(err);
  }
});

savedRoutes.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { destinationId } = req.body;
    if (!destinationId) {
      res.status(400).json({ error: 'destinationId is required' });
      return;
    }
    const item = await savedService.saveDestination(req.user!.id, destinationId);
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
});

savedRoutes.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deleted = await savedService.unsaveDestination(req.params.id as string, req.user!.id);
    if (!deleted) {
      res.status(404).json({ error: 'Saved destination not found' });
      return;
    }
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});
