export const lightColors = {
  primary: '#2563EB',
  primaryHover: '#1D4ED8',
  primaryContainer: '#DBEAFE',
  onPrimaryContainer: '#1E40AF',
  onPrimary: '#FFFFFF',

  secondary: '#059669',
  secondaryContainer: '#D1FAE5',
  onSecondaryContainer: '#065F46',

  tertiary: '#D97706',
  tertiaryContainer: '#FEF3C7',
  onTertiaryContainer: '#92400E',

  error: '#DC2626',
  errorContainer: '#FEE2E2',

  surface: '#FFFFFF',
  surfaceVariant: '#F8FAFC',
  surfaceContainer: '#F1F5F9',
  background: '#F0F4F8',

  onSurface: '#0F172A',
  onSurfaceVariant: '#475569',
  onSurfaceMuted: '#94A3B8',

  outline: '#E2E8F0',
  outlineVariant: '#F1F5F9',
} as const;

export const darkColors = {
  primary: '#3B82F6',
  primaryHover: '#60A5FA',
  primaryContainer: '#1E3A5F',
  onPrimaryContainer: '#93C5FD',
  onPrimary: '#FFFFFF',

  secondary: '#10B981',
  secondaryContainer: '#064E3B',
  onSecondaryContainer: '#6EE7B7',

  tertiary: '#F59E0B',
  tertiaryContainer: '#78350F',
  onTertiaryContainer: '#FCD34D',

  error: '#EF4444',
  errorContainer: '#7F1D1D',

  surface: '#1E293B',
  surfaceVariant: '#1E293B',
  surfaceContainer: '#0F172A',
  background: '#0F172A',

  onSurface: '#F1F5F9',
  onSurfaceVariant: '#94A3B8',
  onSurfaceMuted: '#64748B',

  outline: '#334155',
  outlineVariant: '#1E293B',
} as const;

export const colors = lightColors;

export const typography = {
  fontFamily: 'Inter',
  fallback: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  display: { fontSize: 32, weight: '700' as const, lineHeight: 1.2 },
  headline: { fontSize: 24, weight: '600' as const, lineHeight: 1.3 },
  title: { fontSize: 20, weight: '600' as const, lineHeight: 1.3 },
  bodyLg: { fontSize: 17, weight: '400' as const, lineHeight: 1.5 },
  body: { fontSize: 15, weight: '400' as const, lineHeight: 1.5 },
  bodySm: { fontSize: 13, weight: '400' as const, lineHeight: 1.4 },
  label: { fontSize: 12, weight: '500' as const, lineHeight: 1.3 },
  caption: { fontSize: 11, weight: '400' as const, lineHeight: 1.3 },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export const elevation = {
  1: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  2: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  3: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 16,
    elevation: 8,
  },
} as const;

export const animation = {
  fast: 150,
  normal: 250,
  slow: 350,
  easeStandard: [0.2, 0, 0, 1] as const,
  easeEmphasized: [0.05, 0.7, 0.1, 1] as const,
  easeDecelerate: [0, 0, 0, 1] as const,
  easeAccelerate: [0.3, 0, 1, 1] as const,
};

export const touchMin = 44;
export const safeBottom = 0;
