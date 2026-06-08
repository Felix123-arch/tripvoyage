import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import path from 'path';
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

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use('/images', express.static(path.join(process.cwd(), 'public', 'images')));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100, standardHeaders: true, legacyHeaders: false }));

// Image proxy with disk cache — server fetches and caches images
import * as crypto from 'crypto';
import * as fs from 'fs';
const CACHE_DIR = path.join(process.cwd(), 'public', 'images', 'cache');

app.get('/api/v1/images/proxy', async (req, res) => {
  try {
    const url = req.query.url as string;
    if (!url) { res.status(400).json({ error: 'Missing url param' }); return; }

    // Check disk cache
    const cacheKey = crypto.createHash('md5').update(url).digest('hex') + '.jpg';
    const cachePath = path.join(CACHE_DIR, cacheKey);
    if (fs.existsSync(cachePath)) {
      res.set('Content-Type', 'image/jpeg');
      res.set('Cache-Control', 'public, max-age=86400');
      fs.createReadStream(cachePath).pipe(res);
      return;
    }

    // Fetch from remote
    const proto = url.startsWith('https') ? await import('https') : await import('http');
    proto.get(url, (imgRes: any) => {
      if (imgRes.statusCode && imgRes.statusCode >= 300 && imgRes.statusCode < 400 && imgRes.headers.location) {
        const redirectProto = imgRes.headers.location.startsWith('https') ? require('https') : require('http');
        redirectProto.get(imgRes.headers.location, (redirectRes: any) => {
          const chunks: Buffer[] = [];
          redirectRes.on('data', (chunk: Buffer) => chunks.push(chunk));
          redirectRes.on('end', () => {
            const buf = Buffer.concat(chunks);
            if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });
            fs.writeFileSync(cachePath, buf);
            res.set('Content-Type', redirectRes.headers['content-type'] || 'image/jpeg');
            res.set('Cache-Control', 'public, max-age=86400');
            res.end(buf);
          });
        });
        return;
      }
      const chunks: Buffer[] = [];
      imgRes.on('data', (chunk: Buffer) => chunks.push(chunk));
      imgRes.on('end', () => {
        const buf = Buffer.concat(chunks);
        if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });
        fs.writeFileSync(cachePath, buf);
        res.set('Content-Type', imgRes.headers['content-type'] || 'image/jpeg');
        res.set('Cache-Control', 'public, max-age=86400');
        res.end(buf);
      });
    }).on('error', () => {
      res.status(502).json({ error: 'Image fetch failed' });
    });
  } catch {
    res.status(500).json({ error: 'Proxy error' });
  }
});

// Weather proxy
app.get('/api/v1/weather', async (req, res) => {
  try {
    const city = req.query.city as string;
    if (!city) { res.status(400).json({ error: 'Missing city' }); return; }
    const https = await import('https');
    https.get(`https://wttr.in/${encodeURIComponent(city)}?format=j1`, (wRes: any) => {
      let data = '';
      wRes.on('data', (chunk: string) => data += chunk);
      wRes.on('end', () => {
        try {
          const json = JSON.parse(data);
          const today = json.weather?.[0];
          res.json({
            temp: today?.avgtempC ? String(Math.round(Number(today.avgtempC))) : null,
            condition: today?.hourly?.[4]?.weatherDesc?.[0]?.value || null,
          });
        } catch { res.status(502).json({ error: 'Weather parse error' }); }
      });
    }).on('error', () => res.status(502).json({ error: 'Weather fetch failed' }));
  } catch { res.status(500).json({ error: 'Proxy error' }); }
});

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
