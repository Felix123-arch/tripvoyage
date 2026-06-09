import axios from 'axios';
import { Platform } from 'react-native';

const API_URL = process.env.EXPO_PUBLIC_API_URL || '/api/v1';

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

let authToken: string | null = null;
let onAuthError: (() => void) | null = null;
let isGuestUser = false;

export function setAuthToken(token: string | null) {
  authToken = token;
}

export function setOnAuthError(callback: () => void) {
  onAuthError = callback;
}

export function setGuestMode(guest: boolean) {
  isGuestUser = guest;
}

api.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && onAuthError && !isGuestUser) {
      onAuthError();
    }
    return Promise.reject(error);
  }
);

export default api;
