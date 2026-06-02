import { PrismaClient } from '@prisma/client';
import * as https from 'https';

const prisma = new PrismaClient();

// Real Unsplash photo IDs for each destination — verified landscape/travel photos
const images: Record<string, string> = {
  'Tokyo, Japan':           'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
  'Kyoto, Japan':           'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800',
  'Paris, France':          'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
  'Bali, Indonesia':        'https://images.unsplash.com/photo-1537996194471-e657f9e13f39?w=800',
  'Swiss Alps':             'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=800',
  'Santorini, Greece':      'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800',
  'New York City, USA':     'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800',
  'Beijing, China':         'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800',
  'Shanghai, China':        'https://images.unsplash.com/photo-1537531383496-f4749b88c83f?w=800',
  'Machu Picchu, Peru':     'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800',
  'Maldives':               'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800',
  'Barcelona, Spain':       'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800',
  'Queenstown, New Zealand':'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=800',
  'Dubai, UAE':             'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800',
  'Rome, Italy':            'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800',
  'Rio de Janeiro, Brazil':  'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800',
  'Amsterdam, Netherlands': 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=800',
  'Banff, Canada':          'https://images.unsplash.com/photo-1501786223405-6d024d7c3b8d?w=800',
  'Phuket, Thailand':       'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=800',
  'Istanbul, Turkey':       'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800',
  'Sydney, Australia':      'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800',
  'Reykjavik, Iceland':     'https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=800',
  'Chengdu, China':         'https://images.unsplash.com/photo-1569717785784-1bb8e7c5a317?w=800',
  'Marrakech, Morocco':     'https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=800',
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
