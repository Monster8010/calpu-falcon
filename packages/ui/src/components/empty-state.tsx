import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

import { radii, spacing, typography } from "../tokens";
import { useCalpulliTheme } from "../theme";

export interface EmptyStateProps {
  action?: ReactNode;
  description: string;
  illustration?: ReactNode;
  title: string;
}

export function EmptyState({
  action,
  description,
  illustration,
  title,
}: EmptyStateProps) {
  const { theme } = useCalpulliTheme();

  return (
    <View style={styles.container}>
      {illustration ? (
        <View
          style={[
            styles.illustration,
            {
              backgroundColor: theme.colors.surfaceMuted,
              borderColor: theme.colors.borderSubtle,
            },
          ]}
        >
          {illustration}
        </View>
      ) : null}
      <View style={styles.copy}>
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
          {title}
        </Text>
        <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
          {description}
        </Text>
      </View>
      {action}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: spacing.xl,
    justifyContent: "center",
    minHeight: 280,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxxl,
  },
  illustration: {
    alignItems: "center",
    borderRadius: radii.lg,
    borderWidth: 1,
    height: 92,
    justifyContent: "center",
    transform: [{ rotate: "-2deg" }],
    width: 92,
  },
  copy: {
    alignItems: "center",
    gap: spacing.sm,
    maxWidth: 480,
  },
  title: {
    ...typography.heading,
    textAlign: "center",
  },
  description: {
    ...typography.body,
    textAlign: "center",
  },
});
