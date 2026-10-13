import type { culturalColors, semanticColors } from "../tokens";

export type ThemeMode = "system" | "light" | "dark";
export type ResolvedColorScheme = Exclude<ThemeMode, "system">;
export type CalpulliThemeColors =
  (typeof semanticColors)[ResolvedColorScheme];
export type CulturalColors = typeof culturalColors;

export interface CalpulliTheme {
  colorScheme: ResolvedColorScheme;
  isDark: boolean;
  colors: CalpulliThemeColors;
}
