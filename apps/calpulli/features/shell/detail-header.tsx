import { ThemeToggle, radii, spacing, typography, useCalpulliTheme } from "@calpulli/ui";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export function DetailHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  const { theme } = useCalpulliTheme();

  return (
    <View style={styles.header}>
      <Pressable
        accessibilityLabel="Volver"
        accessibilityRole="button"
        hitSlop={8}
        onPress={() => router.back()}
        style={({ pressed }) => [
          styles.back,
          { backgroundColor: theme.colors.surfaceElevated },
          pressed && styles.pressed,
        ]}
      >
        <Ionicons color={theme.colors.textPrimary} name="arrow-back" size={24} />
      </Pressable>
      <View style={styles.copy}>
        <Text style={[styles.eyebrow, { color: theme.colors.primary }]}>{eyebrow}</Text>
        <Text numberOfLines={1} style={[styles.title, { color: theme.colors.textPrimary }]}>{title}</Text>
      </View>
      <ThemeToggle />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md,
  },
  back: {
    alignItems: "center",
    borderRadius: radii.pill,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  copy: {
    flex: 1,
  },
  eyebrow: {
    ...typography.caption,
    fontWeight: "800",
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  title: {
    ...typography.heading,
  },
  pressed: {
    opacity: 0.65,
  },
});
