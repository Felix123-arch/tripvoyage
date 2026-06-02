import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { config } from './config.js';
import { errorHandler } from './middleware/errorHandler.js';
import { authRoutes } from './routes/auth.routes.js';
import { destinationRoutes } from './routes/destinations.routes.js';
import { itineraryRoutes } from './routes/itineraries.routes.js';
import { checklistRoutes } from './routes/checklist.routes.js';
import { articleRoutes } from './routes/articles.routes.js';
import { reviewRoutes } from './routes/reviews.routes.js';
import { mapPinRoutes } from './routes/mapPins.routes.js';
import { pastTripRoutes } from './routes/pastTrips.routes.js';
import { wishlistRoutes } from './routes/wishlist.routes.js';
import { savedRoutes } from './routes/saved.routes.js';
import { questionnaireRoutes } from './routes/questionnaire.routes.js';
import { userRoutes } from './routes/user.routes.js';

const app = express();

app.use(cors({ origin: config.corsOrigin, credentials: true }));
app.use(express.json());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100, standardHeaders: true, legacyHeaders: false }));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/destinations', destinationRoutes);
app.use('/api/v1/itineraries', itineraryRoutes);
app.use('/api/v1/checklist', checklistRoutes);
app.use('/api/v1/articles', articleRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/map-pins', mapPinRoutes);
app.use('/api/v1/past-trips', pastTripRoutes);
app.use('/api/v1/wishlist', wishlistRoutes);
app.use('/api/v1/saved', savedRoutes);
app.use('/api/v1/questionnaire', questionnaireRoutes);
app.use('/api/v1/user', userRoutes);

app.get('/api/v1/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/v1/debug', async (_req, res) => {
  try {
    const { prisma } = await import('./lib/prisma.js');
    await prisma.$queryRaw`SELECT 1`;
    const userCount = await prisma.user.count();
    const destCount = await prisma.destination.count();
    res.json({ db: 'connected', users: userCount, destinations: destCount });
  } catch (err: any) {
    res.status(500).json({ db: 'error', message: err.message, code: err.code, meta: err.meta });
  }
});

app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`TripVoyage API running on http://localhost:${config.port}/api/v1`);
});

export default app;
