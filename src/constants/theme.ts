export interface Palette {
  readonly text: string;
  readonly textSecondary: string;
  readonly background: string;
  readonly card: string;
  readonly border: string;
  readonly borderStrong: string;
  readonly primary: string;
  readonly onPrimary: string;
  readonly danger: string;
  readonly success: string;
  readonly favorite: string;
  readonly skeleton: string;
}

export const Colors: Readonly<Record<'light' | 'dark', Palette>> = {
  light: {
    text: '#11181C',
    textSecondary: '#5B6470',
    background: '#F5F6F8',
    card: '#FFFFFF',
    border: '#DDE1E6',
    borderStrong: '#7E8792',
    primary: '#1D63D6',
    onPrimary: '#FFFFFF',
    danger: '#B42318',
    success: '#1B7F3B',
    favorite: '#D7263D',
    skeleton: '#E6E9ED',
  },
  dark: {
    text: '#ECEDEE',
    textSecondary: '#A3AAB3',
    background: '#0E1013',
    card: '#1A1D21',
    border: '#2C3036',
    borderStrong: '#6B737E',
    primary: '#6EA8FF',
    onPrimary: '#0E1013',
    danger: '#FF7A70',
    success: '#4CC77A',
    favorite: '#FF5C74',
    skeleton: '#262A30',
  },
};

export type ThemeColor = keyof Palette;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const Radius = {
  sm: 8,
  md: 12,
  pill: 999,
} as const;

export const MIN_TOUCH_TARGET = 44;

export const MAX_CONTENT_WIDTH = 720;

export const TABLET_BREAKPOINT = 768;
