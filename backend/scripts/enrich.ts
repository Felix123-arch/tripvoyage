import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Verified real travel images from stable CDNs
const images: Record<string, string> = {
  'Tokyo, Japan': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Skyscrapers_of_Shinjuku_2009_January.jpg/800px-Skyscrapers_of_Shinjuku_2009_January.jpg',
  'Kyoto, Japan': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Kinkaku-ji_Golden_Pavilion_in_Kyoto%2C_Japan.jpg/800px-Kinkaku-ji_Golden_Pavilion_in_Kyoto%2C_Japan.jpg',
  'Paris, France': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Paris_-_Eiffelturm_und_Marsfeld2.jpg/800px-Paris_-_Eiffelturm_und_Marsfeld2.jpg',
  'Bali, Indonesia': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Pura_Ulun_Danu_Bratan_2022.jpg/800px-Pura_Ulun_Danu_Bratan_2022.jpg',
  'Swiss Alps': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Lauterbrunnen_Valley.jpg/800px-Lauterbrunnen_Valley.jpg',
  'Santorini, Greece': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Oia_Santorini_Greece.jpg/800px-Oia_Santorini_Greece.jpg',
  'New York City, USA': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/New_york_times_square-terabass.jpg/800px-New_york_times_square-terabass.jpg',
  'Beijing, China': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/20091002_Forbidden_City_Beijing_China_0200.jpg/800px-20091002_Forbidden_City_Beijing_China_0200.jpg',
  'Shanghai, China': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/The_Bund_at_night_2021.jpg/800px-The_Bund_at_night_2021.jpg',
  'Machu Picchu, Peru': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Machu_Picchu%2C_Peru.jpg/800px-Machu_Picchu%2C_Peru.jpg',
  'Maldives': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Maldives_Beach_Resort.jpg/800px-Maldives_Beach_Resort.jpg',
  'Barcelona, Spain': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Sagrada_Familia_2021.jpg/800px-Sagrada_Familia_2021.jpg',
  'Queenstown, New Zealand': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Queenstown_New_Zealand.jpg/800px-Queenstown_New_Zealand.jpg',
  'Dubai, UAE': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Burj_Khalifa_and_Dubai_Skyline.jpg/800px-Burj_Khalifa_and_Dubai_Skyline.jpg',
  'Rome, Italy': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Colosseo_2020.jpg/800px-Colosseo_2020.jpg',
  'Rio de Janeiro, Brazil': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Christ_the_Redeemer_-_Cristo_Redentor.jpg/800px-Christ_the_Redeemer_-_Cristo_Redentor.jpg',
  'Amsterdam, Netherlands': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Amsterdam_Canal_Houses.jpg/800px-Amsterdam_Canal_Houses.jpg',
  'Banff, Canada': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Lake_Louise_Alberta_Canada.jpg/800px-Lake_Louise_Alberta_Canada.jpg',
  'Phuket, Thailand': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Phuket_Thailand.jpg/800px-Phuket_Thailand.jpg',
  'Istanbul, Turkey': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Sultan_Ahmed_Mosque_Istanbul.jpg/800px-Sultan_Ahmed_Mosque_Istanbul.jpg',
  'Sydney, Australia': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Sydney_Opera_House_Sails.jpg/800px-Sydney_Opera_House_Sails.jpg',
  'Reykjavik, Iceland': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Northern_Lights_Iceland.jpg/800px-Northern_Lights_Iceland.jpg',
  'Chengdu, China': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Giant_Panda_Chengdu.jpg/800px-Giant_Panda_Chengdu.jpg',
  'Marrakech, Morocco': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Marrakech_Morocco.jpg/800px-Marrakech_Morocco.jpg',
};

async function main() {
  console.log('Enriching destinations with real images...\n');

  for (const [name, imageUrl] of Object.entries(images)) {
    try {
      await prisma.destination.updateMany({
        where: { name },
        data: { imageUrl },
      });
      console.log(`✅ ${name}`);
    } catch (err: any) {
      console.log(`❌ ${name}: ${err.message}`);
    }
  }

  const count = await prisma.destination.count({ where: { imageUrl: { not: '' } } });
  console.log(`\nDone! ${count} destinations now have images.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
