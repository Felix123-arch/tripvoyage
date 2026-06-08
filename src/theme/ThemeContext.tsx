import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Platform } from 'react-native';
import { lightColors, darkColors, typography, spacing, radius, elevation, animation, touchMin } from './tokens';

type ColorScheme = typeof lightColors;

export type Theme = {
  colors: ColorScheme;
  typography: typeof typography;
  spacing: typeof spacing;
  radius: typeof radius;
  elevation: typeof elevation;
  animation: typeof animation;
  touchMin: number;
  dark: boolean;
};

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
  setDarkMode: (dark: boolean) => void;
}

const ThemeContext = createContext<ThemeState>({
  theme: {
    colors: lightColors,
    typography,
    spacing,
    radius,
    elevation,
    animation,
    touchMin,
    dark: false,
  },
  toggleTheme: () => {},
  setDarkMode: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState(() => {
    if (Platform.OS === 'web') {
      return localStorage.getItem('tripvoyage_dark') === 'true';
    }
    return false;
  });

  const theme: Theme = {
    colors: (dark ? darkColors : lightColors) as ColorScheme,
    typography,
    spacing,
    radius,
    elevation,
    animation,
    touchMin,
    dark,
  };

  const toggleTheme = useCallback(() => setDark((d) => !d), []);
  const setDarkMode = useCallback((d: boolean) => {
    setDark(d);
    if (Platform.OS === 'web') {
      localStorage.setItem('tripvoyage_dark', String(d));
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): Theme {
  return useContext(ThemeContext).theme;
}

export function useThemeActions() {
  return useContext(ThemeContext);
}

