import { Router, Request, Response, NextFunction } from 'express';
import { optionalAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import * as questionnaireService from '../services/questionnaire.service.js';

export const questionnaireRoutes = Router();

questionnaireRoutes.post('/', optionalAuth, validate(questionnaireService.submitResponseSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await questionnaireService.submitResponses(req.user?.id, req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

questionnaireRoutes.get('/stats', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await questionnaireService.getStats();
    res.json(stats);
  } catch (err) {
    next(err);
  }
});
