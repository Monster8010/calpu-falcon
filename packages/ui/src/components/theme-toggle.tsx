import { Pressable, StyleSheet, Text } from "react-native";

import { radii, spacing, typography } from "../tokens";
import { useCalpulliTheme } from "../theme";

export function ThemeToggle() {
  const { theme, toggleTheme } = useCalpulliTheme();
  const nextTheme = theme.isDark ? "claro" : "oscuro";

  return (
    <Pressable
      accessibilityHint={`Cambia al tema ${nextTheme}`}
      accessibilityLabel={`Tema ${theme.isDark ? "oscuro" : "claro"}`}
      accessibilityRole="button"
      hitSlop={spacing.sm}
      onPress={toggleTheme}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: theme.colors.surfaceMuted,
          borderColor: theme.colors.borderSubtle,
        },
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.label, { color: theme.colors.textPrimary }]}>
        {theme.isDark ? "Oscuro" : "Claro"}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    borderRadius: radii.pill,
    borderWidth: 1,
    justifyContent: "center",
    minHeight: 44,
    minWidth: 72,
    paddingHorizontal: spacing.md,
  },
  label: {
    ...typography.caption,
    fontWeight: "700",
  },
  pressed: {
    opacity: 0.7,
  },
});
