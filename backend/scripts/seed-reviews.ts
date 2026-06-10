import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const reviewData: { dest: string; author: string; role: string; text: string; votes: number }[] = [
  // Tokyo
  { dest: 'Tokyo, Japan', author: 'Emily R.', role: 'Solo Traveler', text: 'The interactive map in TripVoyage made exploring Tokyo so easy! Found hidden ramen spots in Shinjuku I would have never discovered otherwise. The route planning between destinations saved me hours.', votes: 47 },
  { dest: 'Tokyo, Japan', author: 'Marcus T.', role: 'Business Traveler', text: 'Used TripVoyage for a 3-day business trip to Tokyo. The itinerary timeline kept me on track between meetings and sightseeing. Weather alerts were surprisingly accurate for June.', votes: 23 },
  { dest: 'Tokyo, Japan', author: 'Yuki H.', role: 'Local Guide', text: 'As a Tokyo local, I was impressed by the accuracy of the map pins. Even lesser-known spots like Yanaka Ginza are marked correctly. The Chinese translation is spot-on for Chinese tourists.', votes: 38 },

  // Paris
  { dest: 'Paris, France', author: 'Sophie L.', role: 'Culture Enthusiast', text: 'Planned my entire Paris itinerary with TripVoyage. The ability to save museums and restaurants to wishlist then drag them into the itinerary was genius. Montmartre recommendations were perfect.', votes: 56 },
  { dest: 'Paris, France', author: 'David C.', role: 'Honeymooner', text: 'Used TripVoyage for our honeymoon. The "dark mode" was beautiful for late-night planning in our hotel room. Added all our romantic dinner spots with notes like "window seat requested" — so helpful!', votes: 42 },

  // Bali
  { dest: 'Bali, Indonesia', author: 'Ashley K.', role: 'Yoga Retreat Organizer', text: 'TripVoyage helped me organize a 12-person retreat in Ubud. The shared itinerary feature meant everyone knew where to be. The map view showing all temple locations saved us from logistical nightmares.', votes: 63 },
  { dest: 'Bali, Indonesia', author: 'Ryan P.', role: 'Surfer', text: 'The weather feature cycling through different beach spots in Bali was super useful. Knew exactly which coast to hit based on real-time conditions. Saved destinations for my next trip already.', votes: 29 },

  // New York
  { dest: 'New York City, USA', author: 'Jessica M.', role: 'Food Blogger', text: 'TripVoyage turned my chaotic NYC food crawl into a perfectly organized journey. Categorized restaurants by neighborhood, added tasting notes to each stop. The timeline view was incredibly satisfying.', votes: 51 },
  { dest: 'New York City, USA', author: 'Tom W.', role: 'First-Time Visitor', text: 'First time in NYC and TripVoyage made it less overwhelming. The recommended destinations matched my interests perfectly. The "Book Transport" button was a nice touch for booking airport transfers.', votes: 18 },

  // Beijing
  { dest: 'Beijing, China', author: 'Li Wei', role: 'Domestic Tourist', text: '作为一个经常国内游的人，TripVoyage 的地图功能让我在胡同里找到了很多惊喜小店。行程时间线功能很直观，天气轮播让我知道每天该穿什么。', votes: 45 },
  { dest: 'Beijing, China', author: 'Anna S.', role: 'Exchange Student', text: 'Used TripVoyage during my exchange semester. The bilingual support helped me navigate Beijing with zero Chinese skills. Great Wall hike was perfectly scheduled thanks to the weather forecast feature.', votes: 31 },

  // Maldives
  { dest: 'Maldives', author: 'Priya R.', role: 'Luxury Traveler', text: 'TripVoyage made planning our Maldives resort-hopping trip effortless. Saved 5 different overwater villas to wishlist, compared them side by side with notes on pricing and amenities. Dream vacation planner!', votes: 67 },
  { dest: 'Maldives', author: 'Chris B.', role: 'Scuba Diver', text: 'The interactive map showing dive sites around each atoll was a game-changer. Marked our favorite spots with custom notes like "saw manta rays here!" The dark mode was great for late-night trip planning.', votes: 34 },

  // More destinations
  { dest: 'Barcelona, Spain', author: 'Maria G.', role: 'Architecture Student', text: 'TripVoyage helped me plan the ultimate Gaudi tour. Added Sagrada Familia, Park Guell, and Casa Batllo to my itinerary with time estimates. The route feature showed me the most efficient walking path between them.', votes: 44 },
  { dest: 'Swiss Alps', author: 'Hans M.', role: 'Ski Instructor', text: 'Used TripVoyage to plan a multi-resort ski trip across the Swiss Alps. Added each ski area to the itinerary with difficulty ratings in the notes. Weather carousel helped us chase the best powder days!', votes: 39 },
  { dest: 'Dubai, UAE', author: 'Omar A.', role: 'Photographer', text: 'TripVoyage was essential for my Dubai photography trip. Marked Burj Khalifa, Dubai Frame, and Palm Jumeirah on the map for golden hour shots. The route planning showed me the best order to visit for optimal lighting.', votes: 27 },
  { dest: 'Rome, Italy', author: 'Francesca R.', role: 'History Teacher', text: 'Planned my class field trip to Rome with TripVoyage. The timeline view with status tags (Confirmed/Action Required) kept 30 students organized. Students loved seeing the map with all the ancient sites marked.', votes: 33 },
  { dest: 'Phuket, Thailand', author: 'Nina W.', role: 'Digital Nomad', text: 'TripVoyage made island-hopping in Thailand so organized. Added Phi Phi, James Bond Island, and Coral Island to my itinerary with ferry times in the notes. The guest mode let my travel buddy view the plan without an account.', votes: 22 },
  { dest: 'Sydney, Australia', author: 'Jack H.', role: 'Backpacker', text: 'Used the free guest mode while backpacking. Planned my Sydney stay in 10 minutes flat — Bondi Beach walk, Opera House tour, Harbour Bridge climb all perfectly timed. Will create an account for my next trip!', votes: 15 },
];

async function main() {
  console.log('Seeding reviews...');

  const destinations = await prisma.destination.findMany();
  const destMap = new Map(destinations.map((d) => [d.name, d.id]));

  let count = 0;
  for (const r of reviewData) {
    const destId = destMap.get(r.dest);
    if (!destId) { console.log(`❌ Destination not found: ${r.dest}`); continue; }
    await prisma.review.create({
      data: {
        authorName: r.author,
        authorRole: r.role,
        text: r.text,
        location: r.dest,
        helpfulVotes: r.votes,
        destinationId: destId,
      },
    });
    count++;
    console.log(`✅ ${r.author} → ${r.dest}`);
  }
  console.log(`\n${count} reviews created!`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
