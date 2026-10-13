import { semanticColors } from "../tokens";
import type { CalpulliTheme } from "./types";

export const lightTheme: CalpulliTheme = {
  colorScheme: "light",
  isDark: false,
  colors: semanticColors.light,
};

export const darkTheme: CalpulliTheme = {
  colorScheme: "dark",
  isDark: true,
  colors: semanticColors.dark,
};
