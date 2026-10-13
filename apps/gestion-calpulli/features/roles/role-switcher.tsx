import {
  Badge,
  ThemeToggle,
  culturalColors,
  radii,
  spacing,
  typography,
  useCalpulliTheme,
} from "@calpulli/ui";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import type { DemoRoleDefinition } from "./role-definitions";

export function RoleSwitcher({
  definition,
  onChangeRole,
}: {
  definition: DemoRoleDefinition;
  onChangeRole(): void;
}) {
  const { theme } = useCalpulliTheme();
  const accent = culturalColors[definition.accent];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surfaceElevated,
          borderBottomColor: theme.colors.borderSubtle,
        },
      ]}
    >
      <View style={[styles.roleIcon, { backgroundColor: theme.colors.surfaceMuted, borderColor: accent }]}>
        <Ionicons color={accent} name={definition.icon} size={23} />
      </View>
      <View style={styles.copy}>
        <View style={styles.labelRow}>
          <Text numberOfLines={1} style={[styles.roleName, { color: theme.colors.textPrimary }]}>{definition.label}</Text>
          <Badge label="Modo demo" tone="accent" />
        </View>
        <Pressable
          accessibilityLabel="Cambiar perfil demo"
          accessibilityRole="button"
          hitSlop={8}
          onPress={onChangeRole}
          style={({ pressed }) => [styles.changeButton, pressed && styles.pressed]}
        >
          <Ionicons color={theme.colors.primary} name="swap-horizontal-outline" size={18} />
          <Text style={[styles.changeLabel, { color: theme.colors.primary }]}>Cambiar perfil demo</Text>
        </Pressable>
      </View>
      <ThemeToggle />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    borderBottomWidth: 1,
    flexDirection: "row",
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  roleIcon: {
    alignItems: "center",
    borderRadius: radii.sm,
    borderWidth: 1,
    height: 46,
    justifyContent: "center",
    width: 46,
  },
  copy: {
    flex: 1,
    gap: spacing.xs,
  },
  labelRow: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  roleName: {
    ...typography.label,
    flexShrink: 1,
  },
  changeButton: {
    alignItems: "center",
    alignSelf: "flex-start",
    flexDirection: "row",
    gap: spacing.xs,
    minHeight: 24,
  },
  changeLabel: {
    ...typography.caption,
    fontWeight: "700",
  },
  pressed: {
    opacity: 0.62,
  },
});
