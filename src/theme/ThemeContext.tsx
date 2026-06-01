import { createContext, useContext } from 'react';
import { colors, typography, spacing, radius, elevation, animation, touchMin } from './tokens';

export type Theme = {
  colors: typeof colors;
  typography: typeof typography;
  spacing: typeof spacing;
  radius: typeof radius;
  elevation: typeof elevation;
  animation: typeof animation;
  touchMin: number;
};

const theme: Theme = {
  colors,
  typography,
  spacing,
  radius,
  elevation,
  animation,
  touchMin,
};

const ThemeContext = createContext<Theme>(theme);

export function useTheme() {
  return useContext(ThemeContext);
}

export { theme };
