export type ThemeMode = "light" | "dark";

export type SeasonalThemeId = 
  | "default"
  | "halloween"
  | "christmas"
  | "easter"
  | "promotional"
  | (string & {});

export interface ThemeColors {
  primary: string;
  primaryHover: string;
  primaryContrast: string;
  accent: string;
  gold: string;
  goldLight: string;
  goldDark: string;
  bg: string;
  surface: string;
  surfaceElevated: string;
  border: string;
  text: string;
  textMuted: string;
}

export interface SeasonalTheme {
  id: SeasonalThemeId;
  name: {
    ar: string;
    en: string;
  };
  description: {
    ar: string;
    en: string;
  };
  light: ThemeColors;
  dark: ThemeColors;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  bannerMessage?: {
    ar: string;
    en: string;
  };
}
