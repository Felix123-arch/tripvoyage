import { PrismaClient } from '@prisma/client';
import * as https from 'https';

const prisma = new PrismaClient();

// Fetch the final image URL from source.unsplash.com redirect
function resolveUnsplashUrl(search: string): Promise<string | null> {
  return new Promise((resolve) => {
    const url = `https://source.unsplash.com/400x200/?${encodeURIComponent(search)}`;
    https.get(url, (res) => {
      if (res.headers.location) {
        resolve(res.headers.location);
      } else {
        resolve(null);
      }
      res.resume(); // consume response data
    }).on('error', () => resolve(null));
  });
}

async function main() {
  const pins = await prisma.mapPin.findMany();
  console.log(`Resolving Unsplash images for ${pins.length} map pins...\n`);

  for (const pin of pins) {
    const url = await resolveUnsplashUrl(pin.name);
    if (url) {
      await prisma.mapPin.update({
        where: { id: pin.id },
        data: { imageUrl: url },
      });
      console.log(`✅ ${pin.name} → ${url.substring(0, 60)}...`);
    } else {
      // Try with destination context
      const altUrl = await resolveUnsplashUrl(`${pin.name} landmark`);
      if (altUrl) {
        await prisma.mapPin.update({
          where: { id: pin.id },
          data: { imageUrl: altUrl },
        });
        console.log(`✅ ${pin.name} (alt) → ${altUrl.substring(0, 60)}...`);
      } else {
        console.log(`❌ ${pin.name}`);
      }
    }
  }

  const count = await prisma.mapPin.count({ where: { imageUrl: { not: '' } } });
  console.log(`\nDone! ${count}/${pins.length} pins have images.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
