import { Router, Request, Response, NextFunction } from 'express';
import { validate } from '../middleware/validate.js';
import { authMiddleware } from '../middleware/auth.js';
import * as authService from '../services/auth.service.js';

export const authRoutes = Router();

authRoutes.post('/register', validate(authService.registerSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

authRoutes.post('/login', validate(authService.loginSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.login(req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

authRoutes.get('/me', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await authService.getMe(req.user!.id);
    res.json(user);
  } catch (err) {
    next(err);
  }
});

authRoutes.put('/me', authMiddleware, validate(authService.updateProfileSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await authService.updateMe(req.user!.id, req.body);
    res.json(user);
  } catch (err) {
    next(err);
  }
});
