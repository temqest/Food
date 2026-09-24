import '@/global.css';
import { Platform } from 'react-native';

export const IOSTokens = {
  colors: {
    bg: '#F2F2F7',                      // grouped background
    surface: '#FFFFFF',                 // cards, list groups
    label: '#000000',                   // primary text
    labelSecondary: 'rgba(60, 60, 67, 0.60)', // secondary text / meta
    labelTertiary: 'rgba(60, 60, 67, 0.30)',  // placeholders, disabled
    separator: 'rgba(60, 60, 67, 0.29)',      // 0.5px hairlines
    fill: 'rgba(118, 118, 128, 0.12)',  // search field, subtle fills
    inactive: '#8E8E93',                // inactive tab icons
    tint: '#D42F13',                    // single accent: sili red, 5:1 on white
    tintSoft: 'rgba(212, 47, 19, 0.10)',
    green: '#34C759',                   // iOS system green
    red: '#FF3B30',                     // iOS system red
    barBg: 'rgba(249, 249, 249, 0.82)',
  },
  shape: {
    card: 16,
    thumb: 12,
    field: 10,
    sheet: 24,
    pill: 9999,
  },
  spacing: {
    margin: 16,
    gapSection: 28,
  },
  typography: {
    largeTitle: {
      fontSize: 34,
      lineHeight: 41,
      fontWeight: '700' as const,
      letterSpacing: 0.37,
    },
    title2: {
      fontSize: 22,
      lineHeight: 28,
      fontWeight: '700' as const,
      letterSpacing: -0.26,
    },
    headline: {
      fontSize: 17,
      lineHeight: 22,
      fontWeight: '600' as const,
      letterSpacing: -0.41,
    },
    body: {
      fontSize: 17,
      lineHeight: 22,
      fontWeight: '400' as const,
      letterSpacing: -0.41,
    },
    subhead: {
      fontSize: 15,
      lineHeight: 20,
      fontWeight: '400' as const,
      letterSpacing: -0.24,
    },
    footnote: {
      fontSize: 13,
      lineHeight: 18,
      fontWeight: '400' as const,
      letterSpacing: -0.08,
    },
    caption: {
      fontSize: 12,
      lineHeight: 16,
      fontWeight: '400' as const,
      letterSpacing: 0,
    },
    tabLabel: {
      fontSize: 10,
      lineHeight: 12,
      fontWeight: '500' as const,
    },
  },
} as const;

// Backward-compatibility bridge mapped to iOS tokens
export const BrandColors = {
  primary: IOSTokens.colors.tint,
  primaryHover: '#B9280F',
  primarySoft: IOSTokens.colors.tintSoft,
  canvas: IOSTokens.colors.bg,
  surface: IOSTokens.colors.surface,
  surfaceSubtle: IOSTokens.colors.fill,
  border: IOSTokens.colors.separator,
  borderSubtle: 'rgba(60, 60, 67, 0.15)',
  textPrimary: IOSTokens.colors.label,
  textSecondary: IOSTokens.colors.labelSecondary,
  textMuted: IOSTokens.colors.labelSecondary,
  green: IOSTokens.colors.green,
  greenSoft: 'rgba(52, 199, 89, 0.12)',
  amber: '#FF9500',
  amberSoft: 'rgba(255, 149, 0, 0.12)',
  cardShadow: 'transparent',
  inactive: IOSTokens.colors.inactive,
};

export const Colors = {
  light: {
    text: IOSTokens.colors.label,
    background: IOSTokens.colors.bg,
    backgroundElement: IOSTokens.colors.fill,
    backgroundSelected: IOSTokens.colors.tintSoft,
    textSecondary: IOSTokens.colors.labelSecondary,
    border: IOSTokens.colors.separator,
    primary: IOSTokens.colors.tint,
  },
  dark: {
    text: '#FFFFFF',
    background: '#000000',
    backgroundElement: 'rgba(118, 118, 128, 0.24)',
    backgroundSelected: 'rgba(255, 90, 60, 0.15)',
    textSecondary: 'rgba(235, 235, 245, 0.60)',
    border: 'rgba(84, 84, 88, 0.60)',
    primary: '#FF5A3C',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Inter", system-ui, sans-serif',
    serif: 'Georgia, serif',
    rounded: '"SF Pro Rounded", system-ui, sans-serif',
    mono: 'SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 28,
  six: 32,
  seven: 48,
} as const;

export const BorderRadius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 16,
  sheet: 24,
  full: 9999,
};

export const BottomTabInset = Platform.select({ ios: 49, android: 56, default: 49 });
export const MaxContentWidth = 600; // Constrain to native mobile column on large screens
