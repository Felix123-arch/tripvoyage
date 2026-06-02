import { Router, Request, Response, NextFunction } from 'express';
import * as mapPinService from '../services/mapPin.service.js';

export const mapPinRoutes = Router();

mapPinRoutes.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const pins = await mapPinService.getMapPins(req.query.destinationId as string | undefined);
    res.json(pins);
  } catch (err) {
    next(err);
  }
});
