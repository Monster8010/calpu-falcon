import { StyleSheet, Text, View } from "react-native";

import { spacing, typography } from "../tokens";
import { useCalpulliTheme } from "../theme";
import { CalpulliMark } from "./calpulli-mark";
import { ThemeToggle } from "./theme-toggle";

export interface AppHeaderProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  showThemeToggle?: boolean;
}

export function AppHeader({
  eyebrow = "UPIICSA Calpulli",
  showThemeToggle = true,
  subtitle,
  title,
}: AppHeaderProps) {
  const { theme } = useCalpulliTheme();

  return (
    <View style={styles.container}>
      <View style={styles.identity}>
        <CalpulliMark />
        <View style={styles.copy}>
          <Text style={[styles.eyebrow, { color: theme.colors.primary }]}>
            {eyebrow}
          </Text>
          <Text
            accessibilityRole="header"
            style={[styles.title, { color: theme.colors.textPrimary }]}
          >
            {title}
          </Text>
        </View>
        {showThemeToggle ? <ThemeToggle /> : null}
      </View>
      {subtitle ? (
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  identity: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md,
    justifyContent: "space-between",
  },
  copy: {
    flex: 1,
    gap: spacing.xs,
    minWidth: 0,
  },
  eyebrow: {
    ...typography.caption,
    fontWeight: "800",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  title: {
    ...typography.title,
  },
  subtitle: {
    ...typography.body,
    maxWidth: 620,
  },
});
