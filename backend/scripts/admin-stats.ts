import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('═══════════════════════════════════════');
  console.log('📊 TripVoyage 后台数据一览');
  console.log('═══════════════════════════════════════\n');

  // Users
  const users = await prisma.user.findMany({
    include: { preferences: true },
  });
  console.log(`👤 注册用户 (${users.length}):`);
  for (const u of users) {
    console.log(`   ${u.displayName} (${u.email})`);
    console.log(`   预算: ${u.budgetLevel} | 语言: ${u.language} | 货币: ${u.currency}`);
    console.log(`   偏好: ${u.preferences.map((p: any) => p.preference).join(', ') || '无'}`);
    console.log('');
  }

  // Questionnaire
  const responses = await prisma.questionnaireResponse.findMany({
    orderBy: { createdAt: 'desc' },
  });
  const sessions = new Set(responses.map((r: any) => r.sessionId));
  console.log(`📝 问卷回答: ${responses.length} 条 (${sessions.size} 个会话)\n`);

  // Stats by question
  const byQuestion: Record<string, string[]> = {};
  for (const r of responses) {
    if (!byQuestion[r.questionId]) byQuestion[r.questionId] = [];
    byQuestion[r.questionId].push(r.answer);
  }
  for (const [qId, answers] of Object.entries(byQuestion)) {
    console.log(`   ${qId}: ${answers.length} 个回答 → ${answers.slice(0, 5).join(', ')}${answers.length > 5 ? '...' : ''}`);
  }

  // Itineraries
  const itineraries = await prisma.itinerary.findMany({
    include: { days: { include: { activities: true } } },
  });
  console.log(`\n🗺 行程: ${itineraries.length}`);
  for (const it of itineraries) {
    const activityCount = it.days.reduce((sum: number, d: any) => sum + d.activities.length, 0);
    console.log(`   ${it.name} → ${it.destination} | ${it.status} | ${it.days.length}天 ${activityCount}活动`);
  }

  // Saved & Wishlist
  const saved = await prisma.savedDestination.findMany({ include: { destination: true } });
  const wishlist = await prisma.wishlistItem.findMany();
  console.log(`\n🔖 已保存目的地: ${saved.length}`);
  saved.forEach((s: any) => console.log(`   ${s.destination?.name || '未知'}`));
  console.log(`\n⭐ 心愿单: ${wishlist.length}`);
  wishlist.forEach((w: any) => console.log(`   ${w.destination}`));

  console.log('\n═══════════════════════════════════════');
}

main().catch(console.error).finally(() => prisma.$disconnect());
