import { Router, Request, Response, NextFunction } from 'express';
import { optionalAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import * as reviewService from '../services/review.service.js';

export const reviewRoutes = Router();

reviewRoutes.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reviews = await reviewService.getReviews(req.query.destinationId as string | undefined);
    res.json(reviews);
  } catch (err) {
    next(err);
  }
});

reviewRoutes.post('/', optionalAuth, validate(reviewService.createReviewSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const review = await reviewService.createReview(req.user?.id, req.body);
    res.status(201).json(review);
  } catch (err) {
    next(err);
  }
});
