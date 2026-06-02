import { Router, Request, Response, NextFunction } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import * as pastTripService from '../services/pastTrip.service.js';

export const pastTripRoutes = Router();

pastTripRoutes.use(authMiddleware);

pastTripRoutes.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const trips = await pastTripService.getUserPastTrips(req.user!.id);
    res.json(trips);
  } catch (err) {
    next(err);
  }
});

pastTripRoutes.post('/', validate(pastTripService.createPastTripSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const trip = await pastTripService.createPastTrip(req.user!.id, req.body);
    res.status(201).json(trip);
  } catch (err) {
    next(err);
  }
});
