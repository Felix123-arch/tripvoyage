import { PrismaClient } from '@prisma/client';
import * as https from 'https';
import * as http from 'http';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();
const CACHE_DIR = path.join(__dirname, '..', 'public', 'images', 'cache');

function fetchAndCache(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const cacheKey = crypto.createHash('md5').update(url).digest('hex') + '.jpg';
    const cachePath = path.join(CACHE_DIR, cacheKey);
    if (fs.existsSync(cachePath)) { resolve(true); return; }

    const proto = url.startsWith('https') ? https : http;
    proto.get(url, (res) => {
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const redirectProto = res.headers.location.startsWith('https') ? https : http;
        redirectProto.get(res.headers.location, (redirectRes) => {
          const chunks: Buffer[] = [];
          redirectRes.on('data', (c: Buffer) => chunks.push(c));
          redirectRes.on('end', () => {
            fs.writeFileSync(cachePath, Buffer.concat(chunks));
            resolve(true);
          });
        }).on('error', () => resolve(false));
        return;
      }
      const chunks: Buffer[] = [];
      res.on('data', (c: Buffer) => chunks.push(c));
      res.on('end', () => {
        fs.writeFileSync(cachePath, Buffer.concat(chunks));
        resolve(true);
      });
    }).on('error', () => resolve(false));
  });
}

async function main() {
  if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });

  // 1. Cache destination images (24 fixed Unsplash URLs)
  const destinations = await prisma.destination.findMany({ where: { imageUrl: { not: '' } } });
  console.log(`Caching ${destinations.length} destination images...`);
  for (const d of destinations) {
    if (d.imageUrl) {
      const ok = await fetchAndCache(d.imageUrl);
      console.log(ok ? `✅ ${d.name}` : `❌ ${d.name}`);
    }
  }

  // 2. Cache map pin images (dynamic Unsplash search URLs)
  const pins = await prisma.mapPin.findMany();
  console.log(`\nCaching ${pins.length} map pin images...`);
  for (const pin of pins) {
    const query = encodeURIComponent(pin.name.replace(/,/g, ''));
    const url = `https://source.unsplash.com/400x200/?${query}`;
    const ok = await fetchAndCache(url);
    console.log(ok ? `✅ ${pin.name}` : `❌ ${pin.name}`);
  }

  console.log('\n✅ Cache warm-up complete!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
