import { PrismaClient } from '@prisma/client';
import * as https from 'https';
import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();
const IMAGES_DIR = path.join(__dirname, '..', 'public', 'images');

function download(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const proto = url.startsWith('https') ? https : http;
    proto.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        fs.unlinkSync(dest);
        return download(res.headers.location!, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        file.close();
        fs.unlinkSync(dest);
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', (err) => { file.close(); fs.unlinkSync(dest); reject(err); });
  });
}

async function main() {
  if (!fs.existsSync(IMAGES_DIR)) fs.mkdirSync(IMAGES_DIR, { recursive: true });

  const destinations = await prisma.destination.findMany();
  console.log(`Downloading images for ${destinations.length} destinations...\n`);

  for (const dest of destinations) {
    if (!dest.imageUrl || !dest.imageUrl.startsWith('http')) continue;

    const ext = '.jpg';
    const filename = dest.name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase() + ext;
    const localPath = path.join(IMAGES_DIR, filename);

    try {
      if (fs.existsSync(localPath)) {
        console.log(`⏭️  ${dest.name} (already exists)`);
      } else {
        console.log(`⬇️  ${dest.name}...`);
        await download(dest.imageUrl, localPath);
        console.log(`   ✅ Downloaded`);
      }

      const serverUrl = `/images/${filename}`;
      await prisma.destination.update({
        where: { id: dest.id },
        data: { imageUrl: serverUrl },
      });
      console.log(`   📝 Updated to: ${serverUrl}`);
    } catch (err: any) {
      console.log(`   ❌ ${err.message}, using gradient fallback`);
      await prisma.destination.update({
        where: { id: dest.id },
        data: { imageUrl: '' },
      });
    }
  }

  console.log('\nDone!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
