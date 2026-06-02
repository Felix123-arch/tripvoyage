import { z } from 'zod';
import { prisma } from '../lib/prisma.js';

export const submitResponseSchema = z.object({
  sessionId: z.string().min(1),
  responses: z.array(z.object({
    questionId: z.string().min(1),
    answer: z.string(),
  })),
});

export async function submitResponses(userId: string | undefined, data: z.infer<typeof submitResponseSchema>) {
  const responses = data.responses.map((r) => ({
    userId: userId || null,
    sessionId: data.sessionId,
    questionId: r.questionId,
    answer: r.answer,
  }));

  await prisma.questionnaireResponse.createMany({ data: responses });
  return { count: responses.length };
}

export async function getStats() {
  const all = await prisma.questionnaireResponse.findMany();

  const byQuestion: Record<string, string[]> = {};
  for (const r of all) {
    if (!byQuestion[r.questionId]) byQuestion[r.questionId] = [];
    byQuestion[r.questionId].push(r.answer);
  }

  const stats: Record<string, any> = {};
  for (const [qId, answers] of Object.entries(byQuestion)) {
    const numeric = answers.map(Number).filter((n) => !isNaN(n));
    if (numeric.length > 0) {
      const sum = numeric.reduce((a, b) => a + b, 0);
      stats[qId] = {
        count: numeric.length,
        average: Math.round((sum / numeric.length) * 100) / 100,
        distribution: countDistribution(numeric, 5),
      };
    } else {
      stats[qId] = { count: answers.length, responses: answers };
    }
  }

  return {
    totalResponses: all.length,
    uniqueSessions: new Set(all.map((r: any) => r.sessionId)).size,
    byQuestion: stats,
  };
}

function countDistribution(values: number[], max: number): Record<number, number> {
  const dist: Record<number, number> = {};
  for (let i = 1; i <= max; i++) dist[i] = 0;
  for (const v of values) {
    if (dist[v] !== undefined) dist[v]++;
  }
  return dist;
}
