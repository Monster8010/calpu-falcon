import { StyleSheet, Text, View } from "react-native";

import { radii, spacing, typography } from "../tokens";
import { useCalpulliTheme } from "../theme";

export type BadgeTone = "neutral" | "accent" | "success" | "warning" | "danger";

export interface BadgeProps {
  label: string;
  tone?: BadgeTone;
}

export function Badge({ label, tone = "neutral" }: BadgeProps) {
  const { theme } = useCalpulliTheme();
  const color =
    tone === "accent"
      ? theme.colors.primary
      : tone === "success"
        ? theme.colors.success
        : tone === "warning"
          ? theme.colors.warning
          : tone === "danger"
            ? theme.colors.danger
            : theme.colors.textSecondary;
  const backgroundColor =
    tone === "accent"
      ? theme.colors.primaryMuted
      : tone === "success"
        ? theme.colors.successMuted
        : tone === "warning"
          ? theme.colors.warningMuted
          : tone === "danger"
            ? theme.colors.dangerMuted
            : theme.colors.surfaceMuted;

  return (
    <View
      accessibilityRole="text"
      style={[styles.container, { backgroundColor, borderColor: color }]}
    >
      <Text style={[styles.label, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "flex-start",
    borderRadius: radii.pill,
    borderWidth: 1,
    minHeight: 28,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  label: {
    ...typography.caption,
    fontWeight: "700",
  },
});
