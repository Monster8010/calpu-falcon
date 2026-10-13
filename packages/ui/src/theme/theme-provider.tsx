import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useColorScheme } from "react-native";

import { darkTheme, lightTheme } from "./themes";
import type {
  CalpulliTheme,
  ResolvedColorScheme,
  ThemeMode,
} from "./types";

export interface ThemeContextValue {
  mode: ThemeMode;
  theme: CalpulliTheme;
  setMode(mode: ThemeMode): void;
  toggleTheme(): void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export interface ThemeProviderProps {
  children: ReactNode;
  initialMode?: ThemeMode;
}

function resolveColorScheme(
  mode: ThemeMode,
  systemScheme: ResolvedColorScheme | null | undefined,
): ResolvedColorScheme {
  if (mode !== "system") {
    return mode;
  }

  return systemScheme === "dark" ? "dark" : "light";
}

export function ThemeProvider({
  children,
  initialMode = "system",
}: ThemeProviderProps) {
  const systemScheme = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>(initialMode);
  const colorScheme = resolveColorScheme(mode, systemScheme);
  const theme = colorScheme === "dark" ? darkTheme : lightTheme;

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      theme,
      setMode,
      toggleTheme: () => setMode(theme.isDark ? "light" : "dark"),
    }),
    [mode, theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useCalpulliTheme(): ThemeContextValue {
  const value = useContext(ThemeContext);

  if (value === undefined) {
    throw new Error("useCalpulliTheme debe usarse dentro de ThemeProvider.");
  }

  return value;
}
