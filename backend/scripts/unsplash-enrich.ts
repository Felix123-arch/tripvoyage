import { PrismaClient } from '@prisma/client';
import * as https from 'https';

const prisma = new PrismaClient();

// Real Unsplash photo IDs for each destination — verified landscape/travel photos
const images: Record<string, string> = {
  'Tokyo, Japan':           'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200',
  'Kyoto, Japan':           'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200',
  'Paris, France':          'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200',
  'Bali, Indonesia':        'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=1200',
  'Swiss Alps':             'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=1200',
  'Santorini, Greece':      'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1200',
  'New York City, USA':     'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1200',
  'Beijing, China':         'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=1200',
  'Shanghai, China':        'https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?w=1200',
  'Machu Picchu, Peru':     'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=1200',
  'Maldives':               'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1200',
  'Barcelona, Spain':       'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=1200',
  'Queenstown, New Zealand':'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=1200',
  'Dubai, UAE':             'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200',
  'Rome, Italy':            'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1200',
  'Rio de Janeiro, Brazil':  'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=1200',
  'Amsterdam, Netherlands': 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=1200',
  'Banff, Canada':          'https://images.unsplash.com/photo-1501786223405-6d024d7c3b8d?w=1200',
  'Phuket, Thailand':       'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=1200',
  'Istanbul, Turkey':       'https://images.unsplash.com/photo-1527838832700-5059252407fa?w=1200',
  'Sydney, Australia':      'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=1200',
  'Reykjavik, Iceland':     'https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=1200',
  'Chengdu, China':         'https://images.unsplash.com/photo-1525382455947-f319bc05fb35?w=1200',
  'Marrakech, Morocco':     'https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=1200',
};

async function main() {
  console.log('Setting Unsplash real photos for all destinations...\n');

  for (const [name, imageUrl] of Object.entries(images)) {
    // Verify image exists
    const ok = await new Promise<boolean>((resolve) => {
      https.get(imageUrl, (res) => resolve(res.statusCode === 200))
        .on('error', () => resolve(false));
    });

    if (ok) {
      await prisma.destination.updateMany({ where: { name }, data: { imageUrl } });
      console.log(`✅ ${name}`);
    } else {
      console.log(`❌ ${name} (image not found, keeping current)`);
    }
  }

  console.log('\nDone!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
