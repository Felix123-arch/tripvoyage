import { Router, Request, Response, NextFunction } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import * as authService from '../services/auth.service.js';

export const userRoutes = Router();

userRoutes.use(authMiddleware);

userRoutes.put('/profile', validate(authService.updateProfileSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await authService.updateMe(req.user!.id, req.body);
    res.json(user);
  } catch (err) {
    next(err);
  }
});
