import { Router, Request, Response, NextFunction } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import * as checklistService from '../services/checklist.service.js';

export const checklistRoutes = Router();

checklistRoutes.use(authMiddleware);

checklistRoutes.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const items = await checklistService.getUserChecklist(req.user!.id, req.query.itineraryId as string | undefined);
    res.json(items);
  } catch (err) {
    next(err);
  }
});

checklistRoutes.post('/', validate(checklistService.createChecklistSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = await checklistService.createChecklistItem(req.user!.id, req.body);
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
});

checklistRoutes.put('/:id', validate(checklistService.updateChecklistSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = await checklistService.updateChecklistItem(req.params.id as string, req.user!.id, req.body);
    if (!item) {
      res.status(404).json({ error: 'Checklist item not found' });
      return;
    }
    res.json(item);
  } catch (err) {
    next(err);
  }
});

checklistRoutes.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deleted = await checklistService.deleteChecklistItem(req.params.id as string, req.user!.id);
    if (!deleted) {
      res.status(404).json({ error: 'Checklist item not found' });
      return;
    }
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});
