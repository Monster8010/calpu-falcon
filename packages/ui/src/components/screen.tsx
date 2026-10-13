import type { ReactNode } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import {
  SafeAreaView,
  type Edge,
} from "react-native-safe-area-context";

import { spacing } from "../tokens";
import { useCalpulliTheme } from "../theme";

export interface ScreenProps {
  children: ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
  edges?: Edge[];
  scroll?: boolean;
}

export function Screen({
  children,
  contentStyle,
  edges = ["top", "left", "right"],
  scroll = true,
}: ScreenProps) {
  const { theme } = useCalpulliTheme();

  return (
    <SafeAreaView
      edges={edges}
      style={[styles.safeArea, { backgroundColor: theme.colors.background }]}
    >
      {scroll ? (
        <ScrollView
          contentContainerStyle={[styles.content, contentStyle]}
          keyboardShouldPersistTaps="handled"
          style={styles.flex}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.content, styles.flex, contentStyle]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
});
