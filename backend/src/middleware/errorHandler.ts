import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  console.error(`[ERROR] ${err.name}: ${err.message}`);

  if (err instanceof ZodError) {
    res.status(400).json({
      error: 'Validation failed',
      details: err.errors.map((e: any) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    });
    return;
  }

  // Prisma known request errors
  if (err.code === 'P2002') {
    res.status(409).json({ error: 'A record with this value already exists' });
    return;
  }
  if (err.code === 'P2025') {
    res.status(404).json({ error: 'Record not found' });
    return;
  }

  const message = process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message;
  res.status(500).json({ error: 'Internal server error', detail: err.message, stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined });
}
