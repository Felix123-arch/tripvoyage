import api from './api';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  displayName: string;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  initials: string;
  budgetLevel: string;
  language: string;
  currency: string;
  flightAlerts: boolean;
  itineraryReminders: boolean;
  darkMode: boolean;
  preferences?: { id: string; userId: string; preference: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface AuthResult {
  token: string;
  user: UserProfile;
}

export async function login(data: LoginData): Promise<AuthResult> {
  const res = await api.post('/auth/login', data);
  return res.data;
}

export async function register(data: RegisterData): Promise<AuthResult> {
  const res = await api.post('/auth/register', data);
  return res.data;
}

export async function getMe(): Promise<UserProfile> {
  const res = await api.get('/auth/me');
  return res.data;
}

export async function updateMe(data: any): Promise<UserProfile> {
  const res = await api.put('/auth/me', data);
  return res.data;
}
