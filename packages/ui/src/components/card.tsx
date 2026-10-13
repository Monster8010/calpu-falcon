import {
  StyleSheet,
  View,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from "react-native";

import { radii, spacing } from "../tokens";
import { useCalpulliTheme } from "../theme";

export interface CardProps extends ViewProps {
  elevated?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Card({ elevated = false, style, ...viewProps }: CardProps) {
  const { theme } = useCalpulliTheme();

  return (
    <View
      style={[
        styles.base,
        {
          backgroundColor: elevated
            ? theme.colors.surfaceElevated
            : theme.colors.surface,
          borderColor: theme.colors.borderSubtle,
        },
        elevated && styles.elevated,
        elevated && {
          shadowColor: theme.colors.textPrimary,
          shadowOpacity: theme.isDark ? 0.22 : 0.1,
        },
        style,
      ]}
      {...viewProps}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radii.md,
    borderWidth: 1,
    padding: spacing.xl,
  },
  elevated: {
    elevation: 3,
    shadowOffset: { height: 6, width: 0 },
    shadowRadius: 14,
  },
});
