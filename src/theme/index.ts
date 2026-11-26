import type { TextStyle } from 'react-native';

export const colors = {
  primary: '#2563FF',
  surface: '#E4E9FF',
  surfaceSoft: '#F1F4FF',
  background: '#FFFFFF',
  white: '#FFFFFF',
  text: '#1C1F3A',
  muted: '#8A90AB',
  error: '#E5484D',
  overlay: 'rgba(28, 31, 58, 0.5)',
};

export const fonts: Record<'regular' | 'medium' | 'semiBold' | 'bold', TextStyle> = {
  regular: { fontWeight: '400' },
  medium: { fontWeight: '500' },
  semiBold: { fontWeight: '600' },
  bold: { fontWeight: '700' },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 20,
  pill: 999,
};
