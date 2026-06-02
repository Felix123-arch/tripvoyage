import { Router, Request, Response, NextFunction } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import * as wishlistService from '../services/wishlist.service.js';

export const wishlistRoutes = Router();

wishlistRoutes.use(authMiddleware);

wishlistRoutes.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const items = await wishlistService.getUserWishlist(req.user!.id);
    res.json(items);
  } catch (err) {
    next(err);
  }
});

wishlistRoutes.post('/', validate(wishlistService.createWishlistSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = await wishlistService.addToWishlist(req.user!.id, req.body);
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
});

wishlistRoutes.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deleted = await wishlistService.removeFromWishlist(req.params.id as string, req.user!.id);
    if (!deleted) {
      res.status(404).json({ error: 'Wishlist item not found' });
      return;
    }
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});
