import type { ReactNode } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { radii, spacing, typography } from "../tokens";
import { useCalpulliTheme } from "../theme";

export type ButtonVariant = "primary" | "secondary" | "ghost";

export interface ButtonProps
  extends Omit<PressableProps, "children" | "style"> {
  label: string;
  leading?: ReactNode;
  loading?: boolean;
  variant?: ButtonVariant;
  style?: StyleProp<ViewStyle>;
}

export function Button({
  disabled,
  label,
  leading,
  loading = false,
  variant = "primary",
  style,
  ...pressableProps
}: ButtonProps) {
  const { theme } = useCalpulliTheme();
  const isDisabled = disabled || loading;
  const backgroundColor =
    variant === "primary"
      ? theme.colors.primary
      : variant === "secondary"
        ? theme.colors.surfaceElevated
        : "transparent";
  const borderColor =
    variant === "ghost" ? "transparent" : theme.colors.primary;
  const textColor =
    variant === "primary"
      ? theme.colors.textOnAccent
      : theme.colors.primary;

  return (
    <Pressable
      accessibilityRole="button"
      android_ripple={{ color: theme.colors.primaryMuted, foreground: true }}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor, borderColor },
        variant === "primary" && styles.primary,
        variant === "primary" && { shadowColor: theme.colors.textPrimary },
        pressed && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
      {...pressableProps}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <>
          {leading}
          <Text style={[styles.label, { color: textColor }]}>{label}</Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    borderRadius: radii.sm,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.sm,
    justifyContent: "center",
    minHeight: 52,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  label: {
    ...typography.label,
  },
  primary: {
    elevation: 2,
    shadowOffset: { height: 3, width: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
  },
  pressed: {
    opacity: 0.72,
    transform: [{ scale: 0.99 }],
  },
  disabled: {
    opacity: 0.48,
  },
});
