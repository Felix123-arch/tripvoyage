import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { hashPassword, comparePassword } from '../lib/hash.js';
import { signToken } from '../lib/jwt.js';

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  displayName: z.string().min(1).max(50),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const updateProfileSchema = z.object({
  displayName: z.string().min(1).max(50).optional(),
  initials: z.string().max(2).optional(),
  budgetLevel: z.string().optional(),
  language: z.string().optional(),
  currency: z.string().optional(),
  flightAlerts: z.boolean().optional(),
  itineraryReminders: z.boolean().optional(),
  darkMode: z.boolean().optional(),
  preferences: z.array(z.string()).optional(),
});

function getInitials(name: string): string {
  const parts = name.split(' ').filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

export async function register(data: z.infer<typeof registerSchema>) {
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) throw new ConflictError('Email already registered');

  const passwordHash = await hashPassword(data.password);
  const user = await prisma.user.create({
    data: {
      email: data.email,
      passwordHash,
      displayName: data.displayName,
      initials: getInitials(data.displayName),
    },
  });

  const token = signToken({ userId: user.id, email: user.email });
  return { token, user: sanitizeUser(user) };
}

export async function login(data: z.infer<typeof loginSchema>) {
  const user = await prisma.user.findUnique({ where: { email: data.email } });
  if (!user) throw new UnauthorizedError('Invalid email or password');

  const valid = await comparePassword(data.password, user.passwordHash);
  if (!valid) throw new UnauthorizedError('Invalid email or password');

  const token = signToken({ userId: user.id, email: user.email });
  return { token, user: sanitizeUser(user) };
}

export async function getMe(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { preferences: true },
  });
  if (!user) throw new NotFoundError('User not found');
  return sanitizeUser(user);
}

export async function updateMe(userId: string, data: z.infer<typeof updateProfileSchema>) {
  const { preferences, ...profileData } = data;

  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      ...profileData,
      ...(profileData.displayName && { initials: getInitials(profileData.displayName) }),
    },
  });

  if (preferences !== undefined) {
    await prisma.userPreference.deleteMany({ where: { userId } });
    if (preferences.length > 0) {
      await prisma.userPreference.createMany({
        data: preferences.map((p) => ({ userId, preference: p })),
      });
    }
  }

  const updated = await prisma.user.findUnique({
    where: { id: userId },
    include: { preferences: true },
  });
  return sanitizeUser(updated!);
}

function sanitizeUser(user: any) {
  const { passwordHash, ...safe } = user;
  return safe;
}

export class ConflictError extends Error {
  constructor(message: string) { super(message); this.name = 'ConflictError'; }
}
export class UnauthorizedError extends Error {
  constructor(message: string) { super(message); this.name = 'UnauthorizedError'; }
}
export class NotFoundError extends Error {
  constructor(message: string) { super(message); this.name = 'NotFoundError'; }
}
