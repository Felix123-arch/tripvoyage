import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding TripVoyage database...');

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
  const passwordHash = await hash('password123', 12);
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
  const destinations = await Promise.all([
    prisma.destination.create({
      data: {
        name: 'Bali',
        description: 'Tropical paradise with stunning beaches and rich culture',
        category: 'Beach',
        rating: 4.8,
        reviewCount: 2341,
        gradientStart: '#BE185D',
        gradientEnd: '#EC4899',
      },
    }),
    prisma.destination.create({
      data: {
        name: 'Tokyo',
        description: 'Ultimate blend of tradition and futurism',
        category: 'City Break',
        rating: 4.9,
        reviewCount: 3892,
        gradientStart: '#1E40AF',
        gradientEnd: '#3B82F6',
      },
    }),
    prisma.destination.create({
      data: {
        name: 'Swiss Alps',
        description: 'Breathtaking mountain landscapes and alpine adventures',
        category: 'Mountain',
        rating: 4.7,
        reviewCount: 1856,
        gradientStart: '#065F46',
        gradientEnd: '#10B981',
      },
    }),
    prisma.destination.create({
      data: {
        name: 'Paris',
        description: 'City of lights, art, and culinary excellence',
        category: 'City Break',
        rating: 4.9,
        reviewCount: 4521,
        gradientStart: '#92400E',
        gradientEnd: '#D97706',
      },
    }),
    prisma.destination.create({
      data: {
        name: 'Kyoto',
        description: 'Ancient temples and serene Japanese gardens',
        category: 'Relaxation',
        rating: 4.7,
        reviewCount: 1678,
        gradientStart: '#6B21A8',
        gradientEnd: '#8B5CF6',
      },
    }),
  ]);
  console.log(`Created ${destinations.length} destinations`);

  const tokyo = destinations[1];

  // Create map pins for Tokyo
  const pins = await Promise.all([
    prisma.mapPin.create({
      data: {
        name: 'Senso-ji Temple',
        positionTop: '26%', positionLeft: '58%',
        color: 'blue', distance: '1.2 km',
        rating: 4.7, reviewCount: 12453,
        description: 'Iconic temple with vibrant markets',
        placeType: 'Attraction',
        destinationId: tokyo.id,
      },
    }),
    prisma.mapPin.create({
      data: {
        name: 'Tokyo Skytree',
        positionTop: '22%', positionLeft: '62%',
        color: 'blue', distance: '2.8 km',
        rating: 4.6, reviewCount: 9876,
        description: 'Tallest tower in Japan',
        placeType: 'Attraction',
        destinationId: tokyo.id,
      },
    }),
    prisma.mapPin.create({
      data: {
        name: 'Park Hyatt Tokyo',
        positionTop: '38%', positionLeft: '28%',
        color: 'green', distance: '0.5 km',
        rating: 4.8, reviewCount: 2341,
        description: 'Luxury hotel from Lost in Translation',
        placeType: 'Hotel',
        destinationId: tokyo.id,
      },
    }),
    prisma.mapPin.create({
      data: {
        name: 'Ichiran Ramen',
        positionTop: '48%', positionLeft: '55%',
        color: 'amber', distance: '3.1 km',
        rating: 4.5, reviewCount: 5678,
        description: 'Iconic solo ramen experience',
        placeType: 'Restaurant',
        destinationId: tokyo.id,
      },
    }),
    prisma.mapPin.create({
      data: {
        name: 'Tsukiji Market',
        positionTop: '52%', positionLeft: '60%',
        color: 'amber', distance: '4.2 km',
        rating: 4.6, reviewCount: 7890,
        description: 'Famous seafood and street food market',
        placeType: 'Restaurant',
        destinationId: tokyo.id,
      },
    }),
    prisma.mapPin.create({
      data: {
        name: 'Tokyo Station',
        positionTop: '60%', positionLeft: '45%',
        color: 'red', distance: '5.0 km',
        rating: 4.3, reviewCount: 3456,
        description: 'Major transit hub with character',
        placeType: 'Transit',
        destinationId: tokyo.id,
      },
    }),
  ]);
  console.log(`Created ${pins.length} map pins`);

  // Create articles
  const articles = await Promise.all([
    prisma.article.create({
      data: {
        title: 'Tokyo Food Guide',
        description: 'Discover the best ramen, sushi, and street food spots in Tokyo',
        readTimeMinutes: 5,
        gradientStart: '#BE185D',
        gradientEnd: '#EC4899',
      },
    }),
    prisma.article.create({
      data: {
        title: '10 Tips for First-Time Travelers',
        description: 'Everything you need to know before your first international trip',
        readTimeMinutes: 8,
        gradientStart: '#1E40AF',
        gradientEnd: '#3B82F6',
      },
    }),
  ]);
  console.log(`Created ${articles.length} articles`);

  // Create reviews
  const reviews = await Promise.all([
    prisma.review.create({
      data: {
        userId: user.id,
        authorName: 'Sarah M.',
        authorRole: 'Food Blogger',
        text: 'The TripVoyage app helped me find the best hidden ramen spots in Tokyo. The itinerary feature made planning each day so easy — I never felt lost or overwhelmed.',
        location: 'Tokyo',
        helpfulVotes: 42,
        destinationId: tokyo.id,
      },
    }),
    prisma.review.create({
      data: {
        authorName: 'James K.',
        authorRole: 'Adventure Traveler',
        text: 'I used TripVoyage to plan my Bali trip and it was a game changer. The map view helped me visualize all the temples and beaches I wanted to visit.',
        location: 'Bali',
        helpfulVotes: 28,
        destinationId: destinations[0].id,
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
      destinationId: tokyo.id,
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
            dayNumber: 1,
            date: 'June 15',
            activities: {
              create: [
                {
                  title: 'Arrival & Check-in',
                  description: 'Land at Narita Airport and transfer to hotel in Shinjuku',
                  time: '2:30 PM',
                  location: 'Narita Airport',
                  type: 'flight',
                  status: 'confirmed',
                  badge: 'success',
                },
                {
                  title: 'Hotel Check-in',
                  description: 'Park Hyatt Tokyo — luxury stay in Shinjuku',
                  time: '4:00 PM',
                  location: 'Shinjuku',
                  type: 'hotel',
                  status: 'confirmed',
                },
              ],
            },
          },
          {
            dayNumber: 2,
            date: 'June 16',
            activities: {
              create: [
                {
                  title: 'Senso-ji Temple',
                  description: 'Visit the oldest temple in Tokyo',
                  time: '9:00 AM',
                  location: 'Asakusa',
                  type: 'landmark',
                  status: 'confirmed',
                },
                {
                  title: 'Sushi Making Class',
                  description: 'Learn to make authentic nigiri with a master chef',
                  time: '2:00 PM',
                  location: 'Tsukiji',
                  type: 'food',
                  status: 'confirmed',
                  badge: 'info',
                },
              ],
            },
          },
          {
            dayNumber: 3,
            date: 'June 17',
            activities: {
              create: [
                {
                  title: 'Mt. Fuji Day Trip',
                  description: 'Full-day guided tour to the iconic mountain',
                  time: '7:00 AM',
                  location: 'Mt. Fuji',
                  type: 'nature',
                  status: 'action_required',
                  badge: 'warning',
                },
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
    prisma.pastTrip.create({
      data: {
        userId: user.id,
        destination: 'Bali',
        startDate: 'Mar 10',
        endDate: 'Mar 20',
        durationDays: 10,
        year: 2024,
        gradientStart: '#BE185D',
        gradientEnd: '#EC4899',
      },
    }),
    prisma.pastTrip.create({
      data: {
        userId: user.id,
        destination: 'Paris',
        startDate: 'Sep 05',
        endDate: 'Sep 15',
        durationDays: 10,
        year: 2024,
        gradientStart: '#92400E',
        gradientEnd: '#D97706',
      },
    }),
    prisma.pastTrip.create({
      data: {
        userId: user.id,
        destination: 'Kyoto',
        startDate: 'Apr 12',
        endDate: 'Apr 20',
        durationDays: 8,
        year: 2023,
        gradientStart: '#6B21A8',
        gradientEnd: '#8B5CF6',
      },
    }),
  ]);
  console.log(`Created ${pastTrips.length} past trips`);

  // Create wishlist items
  const wishlist = await Promise.all([
    prisma.wishlistItem.create({ data: { userId: user.id, destination: 'Swiss Alps', notes: 'Want to ski!' } }),
    prisma.wishlistItem.create({ data: { userId: user.id, destination: 'Santorini', notes: 'Sunset views' } }),
  ]);
  console.log(`Created ${wishlist.length} wishlist items`);

  console.log('\nSeeding complete!');
  console.log('Demo login: demo@tripvoyage.app / password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
