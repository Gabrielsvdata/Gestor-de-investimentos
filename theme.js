import { Appearance } from 'react-native';

const scheme = Appearance.getColorScheme(); // 'light' | 'dark'

const base = {
  radius: { sm: 8, md: 12, lg: 16, pill: 9999 },
  spacing: { xs: 6, sm: 10, md: 14, lg: 18, xl: 24 },
  shadow: {
    card: { shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 3 },
    float: { shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 6 },
  },
  font: {
    regular: undefined, medium: undefined, bold: undefined,
  },
};

const light = {
  colors: {
    primary: '#7c3aed',
    primaryMuted: '#ede9fe',
    bg: '#0f172a',
    screen: '#f8fafc',
    surface: '#ffffff',
    border: '#e2e8f0',
    text: '#0f172a',
    textSoft: '#475569',
    success: '#16a34a',
    danger: '#ef4444',
    info: '#2563eb',
    badgeBg: '#eef2ff',
  },
};

const dark = {
  colors: {
    primary: '#a78bfa',
    primaryMuted: '#2b2543',
    bg: '#0b1020',
    screen: '#0b1020',
    surface: '#12172a',
    border: '#1f2942',
    text: '#e5e7eb',
    textSoft: '#9aa6c1',
    success: '#22c55e',
    danger: '#f87171',
    info: '#60a5fa',
    badgeBg: '#1c2340',
  },
};

export const theme = { ...base, ...(scheme === 'dark' ? dark : light) };
