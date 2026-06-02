import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';
import * as authService from '../services/auth';
import { setAuthToken, setOnAuthError } from '../services/api';

interface UserProfile {
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
}

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (data: authService.RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (data: any) => Promise<void>;
  skipLogin: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const TOKEN_KEY = 'tripvoyage_token';

function getStoredToken(): string | null {
  if (Platform.OS === 'web') {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
}

function storeToken(token: string | null) {
  if (Platform.OS === 'web') {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
    isAuthenticated: false,
  });

  const logout = useCallback(() => {
    setState({ user: null, token: null, isLoading: false, isAuthenticated: false });
    setAuthToken(null);
    storeToken(null);
  }, []);

  useEffect(() => {
    setOnAuthError(logout);
  }, [logout]);

  useEffect(() => {
    const token = getStoredToken();
    if (token) {
      setAuthToken(token);
      authService.getMe()
        .then((user) => {
          setState({ user, token, isLoading: false, isAuthenticated: true });
        })
        .catch(() => {
          storeToken(null);
          setAuthToken(null);
          setState({ user: null, token: null, isLoading: false, isAuthenticated: false });
        });
    } else {
      setState((s) => ({ ...s, isLoading: false }));
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const result = await authService.login({ email, password });
    setAuthToken(result.token);
    storeToken(result.token);
    setState({ user: result.user, token: result.token, isLoading: false, isAuthenticated: true });
  }, []);

  const register = useCallback(async (data: authService.RegisterData) => {
    const result = await authService.register(data);
    setAuthToken(result.token);
    storeToken(result.token);
    setState({ user: result.user, token: result.token, isLoading: false, isAuthenticated: true });
  }, []);

  const updateProfile = useCallback(async (data: any) => {
    const user = await authService.updateMe(data);
    setState((s) => ({ ...s, user }));
  }, []);

  const skipLogin = useCallback(() => {
    setState({ user: null, token: null, isLoading: false, isAuthenticated: false });
  }, []);

  return (
    <AuthContext.Provider
      value={{ ...state, login, register, logout, updateProfile, skipLogin }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
