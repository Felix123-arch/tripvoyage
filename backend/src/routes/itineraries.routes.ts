import { Router, Request, Response, NextFunction } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import * as itService from '../services/itinerary.service.js';

export const itineraryRoutes = Router();

itineraryRoutes.use(authMiddleware);

itineraryRoutes.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const itineraries = await itService.getUserItineraries(req.user!.id, req.query.status as string | undefined);
    res.json(itineraries);
  } catch (err) {
    next(err);
  }
});

itineraryRoutes.post('/', validate(itService.createItinerarySchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const itinerary = await itService.createItinerary(req.user!.id, req.body);
    res.status(201).json(itinerary);
  } catch (err) {
    next(err);
  }
});

itineraryRoutes.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const itinerary = await itService.getItineraryById(req.params.id as string, req.user!.id);
    if (!itinerary) {
      res.status(404).json({ error: 'Itinerary not found' });
      return;
    }
    res.json(itinerary);
  } catch (err) {
    next(err);
  }
});

itineraryRoutes.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const itinerary = await itService.updateItinerary(req.params.id as string, req.user!.id, req.body);
    if (!itinerary) {
      res.status(404).json({ error: 'Itinerary not found' });
      return;
    }
    res.json(itinerary);
  } catch (err) {
    next(err);
  }
});

itineraryRoutes.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deleted = await itService.deleteItinerary(req.params.id as string, req.user!.id);
    if (!deleted) {
      res.status(404).json({ error: 'Itinerary not found' });
      return;
    }
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

itineraryRoutes.post('/:id/days/:dayId/activities', validate(itService.createActivitySchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const activity = await itService.addActivity(req.params.dayId as string, req.user!.id, req.body);
    if (!activity) {
      res.status(404).json({ error: 'Day not found or unauthorized' });
      return;
    }
    res.status(201).json(activity);
  } catch (err) {
    next(err);
  }
});

itineraryRoutes.put('/:id/activities/:activityId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const activity = await itService.updateActivity(req.params.activityId as string, req.user!.id, req.body);
    if (!activity) {
      res.status(404).json({ error: 'Activity not found or unauthorized' });
      return;
    }
    res.json(activity);
  } catch (err) {
    next(err);
  }
});

itineraryRoutes.delete('/:id/activities/:activityId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deleted = await itService.deleteActivity(req.params.activityId as string, req.user!.id);
    if (!deleted) {
      res.status(404).json({ error: 'Activity not found or unauthorized' });
      return;
    }
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});
