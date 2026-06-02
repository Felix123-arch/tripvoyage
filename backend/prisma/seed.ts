import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const unsplash = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=800&h=600&fit=crop`;

interface DestSeed {
  name: string;
  description: string;
  category: string;
  rating: number;
  reviewCount: number;
  gradientStart: string;
  gradientEnd: string;
  imageUrl: string;
  lat: number;
  lng: number;
}

const destinationData: DestSeed[] = [
  {
    name: 'Tokyo, Japan',
    description: 'The ultimate blend of ancient tradition and futuristic innovation — neon-lit streets, serene temples, and world-class cuisine',
    category: 'City Break',
    rating: 4.9, reviewCount: 3892,
    gradientStart: '#1E40AF', gradientEnd: '#3B82F6',
    imageUrl: unsplash('1540959733332-eab4de79f93a'),
    lat: 35.6762, lng: 139.6503,
  },
  {
    name: 'Kyoto, Japan',
    description: 'Ancient temples, peaceful Zen gardens, and the timeless beauty of geisha culture in Japan\'s cultural heart',
    category: 'Relaxation',
    rating: 4.7, reviewCount: 1678,
    gradientStart: '#6B21A8', gradientEnd: '#8B5CF6',
    imageUrl: unsplash('1493976040374-85f9e3b84c0d'),
    lat: 35.0116, lng: 135.7681,
  },
  {
    name: 'Paris, France',
    description: 'City of lights, art, and culinary excellence — iconic landmarks, world-class museums, and charming sidewalk cafes',
    category: 'City Break',
    rating: 4.9, reviewCount: 4521,
    gradientStart: '#92400E', gradientEnd: '#D97706',
    imageUrl: unsplash('1502601598650-6df8742b6233'),
    lat: 48.8566, lng: 2.3522,
  },
  {
    name: 'Bali, Indonesia',
    description: 'Tropical paradise with stunning beaches, emerald rice terraces, ancient temples, and vibrant spiritual culture',
    category: 'Beach',
    rating: 4.8, reviewCount: 2341,
    gradientStart: '#BE185D', gradientEnd: '#EC4899',
    imageUrl: unsplash('1537996194471-e657f9e13f8a'),
    lat: -8.3405, lng: 115.0920,
  },
  {
    name: 'Swiss Alps',
    description: 'Breathtaking mountain landscapes, pristine lakes, charming villages, and world-class skiing in the heart of Europe',
    category: 'Mountain',
    rating: 4.7, reviewCount: 1856,
    gradientStart: '#065F46', gradientEnd: '#10B981',
    imageUrl: unsplash('1530122037865-0690def0e1e5'),
    lat: 46.6863, lng: 7.8632,
  },
  {
    name: 'Santorini, Greece',
    description: 'Iconic whitewashed villages with blue domes, stunning sunsets over the Aegean Sea, and volcanic beaches',
    category: 'Beach',
    rating: 4.8, reviewCount: 2156,
    gradientStart: '#0D9488', gradientEnd: '#2DD4BF',
    imageUrl: unsplash('1504512485720-7b48ea80a0a1'),
    lat: 36.3932, lng: 25.4615,
  },
  {
    name: 'New York City, USA',
    description: 'The city that never sleeps — iconic skyline, world-class museums, Broadway shows, and diverse culinary scene',
    category: 'City Break',
    rating: 4.7, reviewCount: 5623,
    gradientStart: '#1E293B', gradientEnd: '#64748B',
    imageUrl: unsplash('1496442229209-223f8c3f96a6'),
    lat: 40.7128, lng: -74.0060,
  },
  {
    name: 'Beijing, China',
    description: 'Ancient capital with 3000 years of history — the Forbidden City, Great Wall, and vibrant hutong culture',
    category: 'City Break',
    rating: 4.6, reviewCount: 3210,
    gradientStart: '#991B1B', gradientEnd: '#DC2626',
    imageUrl: unsplash('1508808787069-7b78b7aec0a2'),
    lat: 39.9042, lng: 116.4074,
  },
  {
    name: 'Shanghai, China',
    description: 'China\'s most cosmopolitan city — futuristic skyline along the Bund, world-class shopping, and vibrant nightlife',
    category: 'City Break',
    rating: 4.5, reviewCount: 2890,
    gradientStart: '#1E3A5F', gradientEnd: '#3B82F6',
    imageUrl: unsplash('1537538496897-2b8bd5ed2006'),
    lat: 31.2304, lng: 121.4737,
  },
  {
    name: 'Machu Picchu, Peru',
    description: 'The lost city of the Incas — ancient ruins perched high in the Andes, shrouded in mist and mystery',
    category: 'Adventure',
    rating: 4.9, reviewCount: 1850,
    gradientStart: '#374151', gradientEnd: '#6B7280',
    imageUrl: unsplash('1526392069555-7dfc08bed55c'),
    lat: -13.1631, lng: -72.5450,
  },
  {
    name: 'Maldives',
    description: 'Ultimate luxury escape — crystal-clear turquoise waters, overwater bungalows, and pristine white sand beaches',
    category: 'Beach',
    rating: 4.9, reviewCount: 1245,
    gradientStart: '#0E7490', gradientEnd: '#06B6D4',
    imageUrl: unsplash('1514282401047-d79a71a590e8'),
    lat: 4.1755, lng: 73.5093,
  },
  {
    name: 'Barcelona, Spain',
    description: 'Gaudi\'s architectural playground — stunning modernist buildings, Mediterranean beaches, and tapas culture',
    category: 'City Break',
    rating: 4.7, reviewCount: 3120,
    gradientStart: '#991B1B', gradientEnd: '#F59E0B',
    imageUrl: unsplash('1539037111047-4b6793ca73a6'),
    lat: 41.3874, lng: 2.1686,
  },
  {
    name: 'Queenstown, New Zealand',
    description: 'Adventure capital of the world — bungee jumping, skiing, and stunning lakes surrounded by majestic mountains',
    category: 'Adventure',
    rating: 4.8, reviewCount: 980,
    gradientStart: '#065F46', gradientEnd: '#34D399',
    imageUrl: unsplash('1504702520181-bfc0c6919a7d'),
    lat: -45.0312, lng: 168.6626,
  },
  {
    name: 'Dubai, UAE',
    description: 'City of superlatives — the world\'s tallest building, luxury shopping, desert safaris, and futuristic architecture',
    category: 'City Break',
    rating: 4.5, reviewCount: 2450,
    gradientStart: '#92400E', gradientEnd: '#F59E0B',
    imageUrl: unsplash('1512453979798-1f96a2e2ef66'),
    lat: 25.2048, lng: 55.2708,
  },
  {
    name: 'Rome, Italy',
    description: 'The Eternal City — ancient ruins, Vatican masterpieces, and the world\'s best pasta and gelato',
    category: 'City Break',
    rating: 4.8, reviewCount: 4100,
    gradientStart: '#7C2D12', gradientEnd: '#DC2626',
    imageUrl: unsplash('1552831388-096d383c6f0f'),
    lat: 41.9028, lng: 12.4964,
  },
  {
    name: 'Rio de Janeiro, Brazil',
    description: 'Cidade Maravilhosa — Christ the Redeemer, Copacabana Beach, samba rhythms, and lush mountain backdrops',
    category: 'Beach',
    rating: 4.6, reviewCount: 1890,
    gradientStart: '#065F46', gradientEnd: '#F59E0B',
    imageUrl: unsplash('1483729551029-6571801a20c9'),
    lat: -22.9068, lng: -43.1729,
  },
  {
    name: 'Amsterdam, Netherlands',
    description: 'Picturesque canals, world-class museums, vibrant tulip fields, and a charming bike-friendly culture',
    category: 'City Break',
    rating: 4.6, reviewCount: 2870,
    gradientStart: '#EA580C', gradientEnd: '#F97316',
    imageUrl: unsplash('1534353436294-9a6f047b67d0'),
    lat: 52.3676, lng: 4.9041,
  },
  {
    name: 'Banff, Canada',
    description: 'Crystal-clear turquoise lakes, snow-capped peaks, and abundant wildlife in the heart of the Canadian Rockies',
    category: 'Mountain',
    rating: 4.8, reviewCount: 1560,
    gradientStart: '#065F46', gradientEnd: '#06B6D4',
    imageUrl: unsplash('1504702520181-bfc0c6919a7d'),
    lat: 51.1784, lng: -115.5708,
  },
  {
    name: 'Phuket, Thailand',
    description: 'Tropical island paradise — stunning limestone karsts, emerald waters, vibrant night markets, and Thai massage',
    category: 'Beach',
    rating: 4.5, reviewCount: 2230,
    gradientStart: '#0E7490', gradientEnd: '#2DD4BF',
    imageUrl: unsplash('1506665538329-4b35a8e3d224'),
    lat: 7.8804, lng: 98.3923,
  },
  {
    name: 'Istanbul, Turkey',
    description: 'Where East meets West — grand mosques, bustling bazaars, rich Ottoman history, and incredible Turkish cuisine',
    category: 'City Break',
    rating: 4.7, reviewCount: 1980,
    gradientStart: '#7C2D12', gradientEnd: '#D97706',
    imageUrl: unsplash('1524231757912-21f4c3c92bb5'),
    lat: 41.0082, lng: 28.9784,
  },
  {
    name: 'Sydney, Australia',
    description: 'Harbour city with iconic Opera House, golden beaches, world-class dining, and laid-back coastal lifestyle',
    category: 'Beach',
    rating: 4.6, reviewCount: 2760,
    gradientStart: '#1E40AF', gradientEnd: '#06B6D4',
    imageUrl: unsplash('1506973035872-a4ec16b8e8d9'),
    lat: -33.8688, lng: 151.2093,
  },
  {
    name: 'Reykjavik, Iceland',
    description: 'Land of fire and ice — Northern Lights, geothermal hot springs, volcanic landscapes, and midnight sun',
    category: 'Adventure',
    rating: 4.7, reviewCount: 1340,
    gradientStart: '#1E293B', gradientEnd: '#22D3EE',
    imageUrl: unsplash('1504893524553-b855bce3e6dd'),
    lat: 64.1466, lng: -21.9426,
  },
  {
    name: 'Chengdu, China',
    description: 'Home of giant pandas, legendary Sichuan cuisine, relaxed teahouse culture, and 3000 years of history',
    category: 'Adventure',
    rating: 4.5, reviewCount: 1560,
    gradientStart: '#991B1B', gradientEnd: '#F97316',
    imageUrl: unsplash('1551882549868-0c7f8a5ab511'),
    lat: 30.5728, lng: 104.0668,
  },
  {
    name: 'Marrakech, Morocco',
    description: 'Sensory overload in the best way — vibrant souks, ornate palaces, aromatic spice markets, and desert excursions',
    category: 'Adventure',
    rating: 4.6, reviewCount: 1120,
    gradientStart: '#991B1B', gradientEnd: '#F59E0B',
    imageUrl: unsplash('1489749798305-4fea3a7c2d47'),
    lat: 31.6295, lng: -7.9811,
  },
];

interface PinSeed {
  name: string;
  lat: number;
  lng: number;
  color: string;
  distance: string;
  rating: number;
  reviewCount: number;
  description: string;
  placeType: string;
  imageUrl?: string;
}

const pinsByCity: Record<string, PinSeed[]> = {
  'Tokyo, Japan': [
    { name: 'Senso-ji Temple', lat: 35.7148, lng: 139.7967, color: 'blue', distance: '1.2 km', rating: 4.7, reviewCount: 12453, description: 'Tokyo\'s oldest temple with vibrant Nakamise market', placeType: 'Attraction' },
    { name: 'Tokyo Skytree', lat: 35.7101, lng: 139.8107, color: 'blue', distance: '2.8 km', rating: 4.6, reviewCount: 9876, description: 'Japan\'s tallest structure with panoramic views', placeType: 'Attraction' },
    { name: 'Park Hyatt Tokyo', lat: 35.6854, lng: 139.6917, color: 'green', distance: '0.5 km', rating: 4.8, reviewCount: 2341, description: 'Luxury hotel from Lost in Translation', placeType: 'Hotel' },
  ],
  'Kyoto, Japan': [
    { name: 'Fushimi Inari Shrine', lat: 34.9671, lng: 135.7727, color: 'blue', distance: '3.5 km', rating: 4.8, reviewCount: 15678, description: 'Iconic vermillion torii gate pathway', placeType: 'Attraction' },
    { name: 'Kinkaku-ji Temple', lat: 35.0394, lng: 135.7292, color: 'blue', distance: '2.0 km', rating: 4.7, reviewCount: 12340, description: 'The stunning Golden Pavilion temple', placeType: 'Attraction' },
    { name: 'Nishiki Market', lat: 35.0052, lng: 135.7655, color: 'amber', distance: '0.8 km', rating: 4.5, reviewCount: 8900, description: 'Kyoto\'s famous food market street', placeType: 'Restaurant' },
  ],
  'Paris, France': [
    { name: 'Eiffel Tower', lat: 48.8584, lng: 2.2945, color: 'blue', distance: '1.0 km', rating: 4.8, reviewCount: 35678, description: 'Iconic iron lattice tower and symbol of Paris', placeType: 'Attraction' },
    { name: 'Louvre Museum', lat: 48.8606, lng: 2.3376, color: 'blue', distance: '2.3 km', rating: 4.9, reviewCount: 28900, description: 'World\'s largest art museum, home of Mona Lisa', placeType: 'Attraction' },
    { name: 'Four Seasons George V', lat: 48.8688, lng: 2.3006, color: 'green', distance: '1.5 km', rating: 4.9, reviewCount: 1567, description: 'Legendary luxury hotel near Champs-Élysées', placeType: 'Hotel' },
  ],
  'Bali, Indonesia': [
    { name: 'Tanah Lot Temple', lat: -8.6213, lng: 115.0868, color: 'blue', distance: '5.2 km', rating: 4.7, reviewCount: 18900, description: 'Ancient sea temple on a rocky outcrop', placeType: 'Attraction' },
    { name: 'Ubud Rice Terraces', lat: -8.5068, lng: 115.2628, color: 'green', distance: '3.8 km', rating: 4.6, reviewCount: 11200, description: 'Lush green rice paddies in cultural heart of Bali', placeType: 'Nature' },
    { name: 'Ayana Resort', lat: -8.7943, lng: 115.1189, color: 'green', distance: '2.0 km', rating: 4.8, reviewCount: 2345, description: 'Cliff-top luxury resort with ocean views', placeType: 'Hotel' },
  ],
  'Swiss Alps': [
    { name: 'Jungfraujoch', lat: 46.5473, lng: 7.9836, color: 'blue', distance: '4.5 km', rating: 4.8, reviewCount: 15670, description: 'Top of Europe — highest railway station in Europe', placeType: 'Attraction' },
    { name: 'Matterhorn Glacier', lat: 45.9766, lng: 7.6586, color: 'green', distance: '6.0 km', rating: 4.9, reviewCount: 8900, description: 'Iconic pyramidal peak and year-round skiing', placeType: 'Nature' },
  ],
  'Santorini, Greece': [
    { name: 'Oia Village', lat: 36.4620, lng: 25.3746, color: 'blue', distance: '1.2 km', rating: 4.9, reviewCount: 23456, description: 'Famous whitewashed village with blue domes', placeType: 'Attraction' },
    { name: 'Red Beach', lat: 36.3465, lng: 25.3950, color: 'green', distance: '3.5 km', rating: 4.5, reviewCount: 6780, description: 'Unique red volcanic sand beach', placeType: 'Nature' },
    { name: 'Canaves Oia Hotel', lat: 36.4616, lng: 25.3734, color: 'green', distance: '0.3 km', rating: 4.9, reviewCount: 1234, description: 'Luxury cave suites with caldera views', placeType: 'Hotel' },
  ],
  'New York City, USA': [
    { name: 'Empire State Building', lat: 40.7484, lng: -73.9857, color: 'blue', distance: '1.0 km', rating: 4.7, reviewCount: 45678, description: 'Iconic Art Deco skyscraper with observation deck', placeType: 'Attraction' },
    { name: 'Central Park', lat: 40.7829, lng: -73.9654, color: 'green', distance: '2.5 km', rating: 4.8, reviewCount: 34560, description: 'Vast urban green space in the heart of Manhattan', placeType: 'Nature' },
    { name: 'Katz\'s Delicatessen', lat: 40.7223, lng: -73.9874, color: 'amber', distance: '1.8 km', rating: 4.6, reviewCount: 23450, description: 'Legendary NYC deli since 1888', placeType: 'Restaurant' },
  ],
  'Beijing, China': [
    { name: 'Forbidden City', lat: 39.9163, lng: 116.3972, color: 'blue', distance: '2.0 km', rating: 4.8, reviewCount: 28765, description: 'Imperial palace complex with 980 buildings', placeType: 'Attraction' },
    { name: 'Great Wall (Mutianyu)', lat: 40.4319, lng: 116.5704, color: 'blue', distance: '25 km', rating: 4.9, reviewCount: 34560, description: 'Best-preserved section of the Great Wall', placeType: 'Attraction' },
    { name: 'Da Dong Roast Duck', lat: 39.9156, lng: 116.4508, color: 'amber', distance: '1.5 km', rating: 4.7, reviewCount: 12340, description: 'Beijing\'s legendary roast duck restaurant', placeType: 'Restaurant' },
  ],
  'Shanghai, China': [
    { name: 'The Bund', lat: 31.2400, lng: 121.4904, color: 'blue', distance: '0.5 km', rating: 4.7, reviewCount: 21200, description: 'Iconic waterfront promenade with colonial architecture', placeType: 'Attraction' },
    { name: 'Shanghai Tower', lat: 31.2355, lng: 121.5016, color: 'blue', distance: '1.2 km', rating: 4.6, reviewCount: 15670, description: 'China\'s tallest skyscraper with 632m observation deck', placeType: 'Attraction' },
    { name: 'Yu Garden', lat: 31.2272, lng: 121.4924, color: 'green', distance: '1.0 km', rating: 4.5, reviewCount: 18900, description: 'Classical Chinese garden with Ming dynasty pavilions', placeType: 'Attraction' },
  ],
  'Machu Picchu, Peru': [
    { name: 'Machu Picchu Citadel', lat: -13.1631, lng: -72.5450, color: 'blue', distance: '0.0 km', rating: 4.9, reviewCount: 28900, description: 'The lost city of the Incas — one of the New 7 Wonders', placeType: 'Attraction' },
    { name: 'Huayna Picchu', lat: -13.1570, lng: -72.5470, color: 'green', distance: '1.5 km', rating: 4.8, reviewCount: 8760, description: 'Iconic peak behind the citadel with panoramic views', placeType: 'Nature' },
  ],
  'Maldives': [
    { name: 'Conrad Maldives', lat: 3.8710, lng: 72.9400, color: 'green', distance: '0.5 km', rating: 4.9, reviewCount: 1234, description: 'World\'s first underwater hotel suite', placeType: 'Hotel' },
    { name: 'Banana Reef', lat: 4.2500, lng: 73.5000, color: 'green', distance: '3.0 km', rating: 4.7, reviewCount: 5670, description: 'World-famous dive site with vibrant marine life', placeType: 'Nature' },
  ],
  'Barcelona, Spain': [
    { name: 'Sagrada Familia', lat: 41.4036, lng: 2.1744, color: 'blue', distance: '1.0 km', rating: 4.9, reviewCount: 31200, description: 'Gaudi\'s unfinished masterpiece basilica', placeType: 'Attraction' },
    { name: 'Park Güell', lat: 41.4145, lng: 2.1527, color: 'green', distance: '2.5 km', rating: 4.7, reviewCount: 23400, description: 'Whimsical park with mosaics and city views', placeType: 'Attraction' },
    { name: 'La Boqueria Market', lat: 41.3816, lng: 2.1716, color: 'amber', distance: '0.8 km', rating: 4.6, reviewCount: 15670, description: 'Iconic food market on Las Ramblas', placeType: 'Restaurant' },
  ],
  'Queenstown, New Zealand': [
    { name: 'Lake Wakatipu', lat: -45.0312, lng: 168.6626, color: 'green', distance: '0.5 km', rating: 4.8, reviewCount: 8900, description: 'Stunning alpine lake surrounded by mountains', placeType: 'Nature' },
    { name: 'Skyline Gondola', lat: -45.0200, lng: 168.6570, color: 'blue', distance: '1.0 km', rating: 4.6, reviewCount: 12340, description: 'Panoramic views and luge track', placeType: 'Attraction' },
    { name: 'Fergburger', lat: -45.0314, lng: 168.6604, color: 'amber', distance: '0.3 km', rating: 4.7, reviewCount: 18900, description: 'World-famous gourmet burger joint', placeType: 'Restaurant' },
  ],
  'Dubai, UAE': [
    { name: 'Burj Khalifa', lat: 25.1972, lng: 55.2744, color: 'blue', distance: '0.5 km', rating: 4.8, reviewCount: 45670, description: 'World\'s tallest building at 828 meters', placeType: 'Attraction' },
    { name: 'Burj Al Arab', lat: 25.1413, lng: 55.1852, color: 'green', distance: '3.5 km', rating: 4.9, reviewCount: 8900, description: 'Iconic sail-shaped 7-star luxury hotel', placeType: 'Hotel' },
    { name: 'Dubai Mall', lat: 25.1987, lng: 55.2797, color: 'red', distance: '1.0 km', rating: 4.6, reviewCount: 34560, description: 'One of the world\'s largest shopping destinations', placeType: 'Shopping' },
  ],
  'Rome, Italy': [
    { name: 'Colosseum', lat: 41.8902, lng: 12.4922, color: 'blue', distance: '1.0 km', rating: 4.8, reviewCount: 45678, description: 'Iconic ancient Roman amphitheater', placeType: 'Attraction' },
    { name: 'Vatican Museums', lat: 41.9065, lng: 12.4536, color: 'blue', distance: '2.5 km', rating: 4.8, reviewCount: 34560, description: 'Home of Sistine Chapel and Raphael Rooms', placeType: 'Attraction' },
    { name: 'Trattoria da Enzo', lat: 41.8845, lng: 12.4786, color: 'amber', distance: '0.8 km', rating: 4.6, reviewCount: 5670, description: 'Authentic Roman cuisine in Trastevere', placeType: 'Restaurant' },
  ],
  'Rio de Janeiro, Brazil': [
    { name: 'Christ the Redeemer', lat: -22.9519, lng: -43.2105, color: 'blue', distance: '3.0 km', rating: 4.8, reviewCount: 34560, description: 'Iconic Art Deco statue atop Corcovado Mountain', placeType: 'Attraction' },
    { name: 'Copacabana Beach', lat: -22.9711, lng: -43.1823, color: 'green', distance: '0.5 km', rating: 4.6, reviewCount: 23450, description: 'World-famous crescent-shaped beach', placeType: 'Nature' },
  ],
  'Amsterdam, Netherlands': [
    { name: 'Anne Frank House', lat: 52.3752, lng: 4.8840, color: 'blue', distance: '1.0 km', rating: 4.7, reviewCount: 23400, description: 'Historic house and biographical museum', placeType: 'Attraction' },
    { name: 'Van Gogh Museum', lat: 52.3584, lng: 4.8811, color: 'blue', distance: '2.0 km', rating: 4.8, reviewCount: 28900, description: 'World\'s largest collection of Van Gogh works', placeType: 'Attraction' },
    { name: 'The Seafood Bar', lat: 52.3605, lng: 4.8779, color: 'amber', distance: '0.8 km', rating: 4.6, reviewCount: 8900, description: 'Best seafood experience in Amsterdam', placeType: 'Restaurant' },
  ],
  'Banff, Canada': [
    { name: 'Lake Louise', lat: 51.4254, lng: -116.1773, color: 'green', distance: '5.0 km', rating: 4.9, reviewCount: 23400, description: 'Turquoise alpine lake with Victoria Glacier backdrop', placeType: 'Nature' },
    { name: 'Banff Gondola', lat: 51.1480, lng: -115.5554, color: 'blue', distance: '1.2 km', rating: 4.6, reviewCount: 12340, description: 'Scenic ride to Sulphur Mountain summit', placeType: 'Attraction' },
    { name: 'Fairmont Banff Springs', lat: 51.1644, lng: -115.5630, color: 'green', distance: '0.5 km', rating: 4.8, reviewCount: 3450, description: 'Canada\'s Castle in the Rockies', placeType: 'Hotel' },
  ],
  'Phuket, Thailand': [
    { name: 'Phi Phi Islands', lat: 7.7407, lng: 98.7784, color: 'green', distance: '8.0 km', rating: 4.8, reviewCount: 23450, description: 'Stunning limestone islands with crystal waters', placeType: 'Nature' },
    { name: 'Big Buddha', lat: 7.8277, lng: 98.3132, color: 'blue', distance: '2.0 km', rating: 4.5, reviewCount: 15670, description: '45-meter white marble Buddha statue', placeType: 'Attraction' },
    { name: 'Bangla Road', lat: 7.8915, lng: 98.2965, color: 'amber', distance: '1.0 km', rating: 4.2, reviewCount: 18900, description: 'Famous nightlife and entertainment street', placeType: 'Restaurant' },
  ],
  'Istanbul, Turkey': [
    { name: 'Hagia Sophia', lat: 41.0086, lng: 28.9802, color: 'blue', distance: '0.5 km', rating: 4.9, reviewCount: 34560, description: 'Magnificent mosque and former Byzantine cathedral', placeType: 'Attraction' },
    { name: 'Grand Bazaar', lat: 41.0107, lng: 28.9680, color: 'red', distance: '1.5 km', rating: 4.5, reviewCount: 27890, description: 'One of the world\'s oldest covered markets', placeType: 'Shopping' },
    { name: 'Ciya Sofrasi', lat: 41.0256, lng: 29.0347, color: 'amber', distance: '3.0 km', rating: 4.6, reviewCount: 5670, description: 'Celebrated Anatolian cuisine on the Asian side', placeType: 'Restaurant' },
  ],
  'Sydney, Australia': [
    { name: 'Sydney Opera House', lat: -33.8568, lng: 151.2153, color: 'blue', distance: '0.5 km', rating: 4.8, reviewCount: 34560, description: 'UNESCO World Heritage architectural icon', placeType: 'Attraction' },
    { name: 'Bondi Beach', lat: -33.8915, lng: 151.2767, color: 'green', distance: '3.5 km', rating: 4.6, reviewCount: 23400, description: 'Australia\'s most famous surf beach', placeType: 'Nature' },
  ],
  'Reykjavik, Iceland': [
    { name: 'Blue Lagoon', lat: 63.8803, lng: -22.4495, color: 'green', distance: '20 km', rating: 4.7, reviewCount: 23400, description: 'Famous geothermal spa with mineral-rich waters', placeType: 'Nature' },
    { name: 'Hallgrimskirkja', lat: 64.1420, lng: -21.9266, color: 'blue', distance: '0.5 km', rating: 4.5, reviewCount: 12340, description: 'Iconic expressionist church with observation tower', placeType: 'Attraction' },
  ],
  'Chengdu, China': [
    { name: 'Giant Panda Base', lat: 30.7326, lng: 104.1449, color: 'green', distance: '5.0 km', rating: 4.8, reviewCount: 21200, description: 'World-famous panda breeding and research center', placeType: 'Nature' },
    { name: 'Jinli Ancient Street', lat: 30.6485, lng: 104.0421, color: 'amber', distance: '1.0 km', rating: 4.5, reviewCount: 15670, description: 'Traditional street with snacks and crafts', placeType: 'Restaurant' },
    { name: 'Wenshu Monastery', lat: 30.6788, lng: 104.0719, color: 'blue', distance: '2.0 km', rating: 4.6, reviewCount: 8900, description: 'Tang dynasty Buddhist temple with tea house', placeType: 'Attraction' },
  ],
  'Marrakech, Morocco': [
    { name: 'Jemaa el-Fnaa', lat: 31.6258, lng: -7.9891, color: 'blue', distance: '0.3 km', rating: 4.6, reviewCount: 23400, description: 'Vibrant main square with storytellers and food stalls', placeType: 'Attraction' },
    { name: 'Majorelle Garden', lat: 31.6422, lng: -8.0030, color: 'green', distance: '2.0 km', rating: 4.7, reviewCount: 12340, description: 'Stunning blue botanical garden by Yves Saint Laurent', placeType: 'Nature' },
    { name: 'La Mamounia', lat: 31.6214, lng: -7.9969, color: 'green', distance: '0.8 km', rating: 4.9, reviewCount: 2340, description: 'Legendary luxury palace hotel', placeType: 'Hotel' },
  ],
};

async function main() {
  console.log('Seeding TripVoyage database with real data...');

  // Clean existing data
  await prisma.questionnaireResponse.deleteMany();
  await prisma.savedDestination.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.pastTrip.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.itineraryDay.deleteMany();
  await prisma.itinerary.deleteMany();
  await prisma.review.deleteMany();
  await prisma.mapPin.deleteMany();
  await prisma.destination.deleteMany();
  await prisma.checklistItem.deleteMany();
  await prisma.userPreference.deleteMany();
  await prisma.article.deleteMany();
  await prisma.user.deleteMany();

  // Create demo user
  const passwordHash = await bcrypt.hash('password123', 12);
  const user = await prisma.user.create({
    data: {
      email: 'demo@tripvoyage.app',
      passwordHash,
      displayName: 'Alex Johnson',
      initials: 'AJ',
      budgetLevel: '$$',
      language: 'English',
      currency: 'USD ($)',
      flightAlerts: true,
      itineraryReminders: true,
      darkMode: false,
      preferences: {
        create: [
          { preference: 'Adventure' },
          { preference: 'Relaxation' },
          { preference: 'Foodie' },
        ],
      },
    },
  });
  console.log(`Created demo user: ${user.email}`);

  // Create destinations
  const destMap: Record<string, string> = {};
  for (const d of destinationData) {
    const dest = await prisma.destination.create({ data: d });
    destMap[d.name] = dest.id;
  }
  console.log(`Created ${destinationData.length} destinations`);

  // Create map pins
  let pinCount = 0;
  for (const [city, pins] of Object.entries(pinsByCity)) {
    const destId = destMap[city];
    if (!destId) continue;
    for (const pin of pins) {
      await prisma.mapPin.create({
        data: { ...pin, destinationId: destId },
      });
      pinCount++;
    }
  }
  console.log(`Created ${pinCount} map pins`);

  // Create articles
  const tokyoId = destMap['Tokyo, Japan'];
  const articles = await Promise.all([
    prisma.article.create({
      data: {
        title: 'Tokyo Food Guide: Best Ramen & Sushi',
        description: 'Discover the best ramen, sushi, and street food spots in Tokyo — from Michelin stars to hidden alleyway gems',
        readTimeMinutes: 5,
        gradientStart: '#BE185D', gradientEnd: '#EC4899',
      },
    }),
    prisma.article.create({
      data: {
        title: '10 Tips for First-Time Travelers',
        description: 'Everything you need to know before your first international trip — visas, packing, safety, and cultural etiquette',
        readTimeMinutes: 8,
        gradientStart: '#1E40AF', gradientEnd: '#3B82F6',
      },
    }),
    prisma.article.create({
      data: {
        title: 'Beijing: A Journey Through Imperial China',
        description: 'Explore the Forbidden City, walk the Great Wall, and taste authentic Beijing roast duck in ancient hutongs',
        readTimeMinutes: 6,
        gradientStart: '#991B1B', gradientEnd: '#DC2626',
      },
    }),
    prisma.article.create({
      data: {
        title: 'Swiss Alps Adventure Guide',
        description: 'From skiing in Zermatt to hiking in Lauterbrunnen — the ultimate Swiss Alps outdoor guide',
        readTimeMinutes: 7,
        gradientStart: '#065F46', gradientEnd: '#10B981',
      },
    }),
  ]);
  console.log(`Created ${articles.length} articles`);

  // Create reviews
  const baliId = destMap['Bali, Indonesia'];
  const reviews = await Promise.all([
    prisma.review.create({
      data: {
        userId: user.id,
        authorName: 'Sarah M.',
        authorRole: 'Food Blogger',
        text: 'The TripVoyage app helped me find the best hidden ramen spots in Tokyo. The itinerary feature made planning each day so easy — I never felt lost or overwhelmed.',
        location: 'Tokyo',
        helpfulVotes: 42,
        destinationId: tokyoId,
      },
    }),
    prisma.review.create({
      data: {
        authorName: 'James K.',
        authorRole: 'Adventure Traveler',
        text: 'I used TripVoyage to plan my Bali trip and it was a game changer. The map view helped me visualize all the temples and beaches I wanted to visit.',
        location: 'Bali',
        helpfulVotes: 28,
        destinationId: baliId,
      },
    }),
  ]);
  console.log(`Created ${reviews.length} reviews`);

  // Create checklist for demo user
  const checklist = await Promise.all([
    prisma.checklistItem.create({ data: { userId: user.id, label: 'Check visa requirements', completed: true } }),
    prisma.checklistItem.create({ data: { userId: user.id, label: 'Pack appropriate clothing', completed: true } }),
    prisma.checklistItem.create({ data: { userId: user.id, label: 'Get travel vaccinations', completed: true } }),
    prisma.checklistItem.create({ data: { userId: user.id, label: 'Arrange travel insurance', completed: false } }),
    prisma.checklistItem.create({ data: { userId: user.id, label: 'Exchange currency', completed: false } }),
  ]);
  console.log(`Created ${checklist.length} checklist items`);

  // Create Tokyo Adventure itinerary
  const itinerary = await prisma.itinerary.create({
    data: {
      userId: user.id,
      name: 'Tokyo Adventure',
      destination: 'Tokyo',
      destinationId: tokyoId,
      startDate: 'Jun 15',
      endDate: 'Jun 22',
      year: 2025,
      status: 'upcoming',
      weatherTemp: '22',
      weatherCond: 'Sunny',
      weatherDesc: 'Perfect weather for exploring the city',
      days: {
        create: [
          {
            dayNumber: 1, date: 'June 15',
            activities: {
              create: [
                { title: 'Arrival & Check-in', description: 'Land at Narita Airport and transfer to hotel in Shinjuku', time: '2:30 PM', location: 'Narita Airport', type: 'flight', status: 'confirmed', badge: 'success' },
                { title: 'Hotel Check-in', description: 'Park Hyatt Tokyo — luxury stay in Shinjuku', time: '4:00 PM', location: 'Shinjuku', type: 'hotel', status: 'confirmed' },
              ],
            },
          },
          {
            dayNumber: 2, date: 'June 16',
            activities: {
              create: [
                { title: 'Senso-ji Temple', description: 'Visit the oldest temple in Tokyo', time: '9:00 AM', location: 'Asakusa', type: 'landmark', status: 'confirmed' },
                { title: 'Sushi Making Class', description: 'Learn to make authentic nigiri with a master chef', time: '2:00 PM', location: 'Tsukiji', type: 'food', status: 'confirmed', badge: 'info' },
              ],
            },
          },
          {
            dayNumber: 3, date: 'June 17',
            activities: {
              create: [
                { title: 'Mt. Fuji Day Trip', description: 'Full-day guided tour to the iconic mountain', time: '7:00 AM', location: 'Mt. Fuji', type: 'nature', status: 'action_required', badge: 'warning' },
              ],
            },
          },
        ],
      },
    },
  });
  console.log(`Created itinerary: ${itinerary.name} with 3 days`);

  // Create past trips
  const pastTrips = await Promise.all([
    prisma.pastTrip.create({ data: { userId: user.id, destination: 'Bali', startDate: 'Mar 10', endDate: 'Mar 20', durationDays: 10, year: 2024, gradientStart: '#BE185D', gradientEnd: '#EC4899' } }),
    prisma.pastTrip.create({ data: { userId: user.id, destination: 'Paris', startDate: 'Sep 05', endDate: 'Sep 15', durationDays: 10, year: 2024, gradientStart: '#92400E', gradientEnd: '#D97706' } }),
    prisma.pastTrip.create({ data: { userId: user.id, destination: 'Kyoto', startDate: 'Apr 12', endDate: 'Apr 20', durationDays: 8, year: 2023, gradientStart: '#6B21A8', gradientEnd: '#8B5CF6' } }),
  ]);
  console.log(`Created ${pastTrips.length} past trips`);

  // Create wishlist items
  const wishlist = await Promise.all([
    prisma.wishlistItem.create({ data: { userId: user.id, destination: 'Swiss Alps', notes: 'Want to ski the Swiss Alps!' } }),
    prisma.wishlistItem.create({ data: { userId: user.id, destination: 'Santorini', notes: 'Sunset views over the caldera' } }),
  ]);
  console.log(`Created ${wishlist.length} wishlist items`);

  console.log('\nSeeding complete!');
  console.log(`  ${destinationData.length} destinations with real photos`);
  console.log(`  ${pinCount} map pins with real coordinates`);
  console.log(`\nDemo login: demo@tripvoyage.app / password123`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
