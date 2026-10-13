import type { AppRole } from "@calpulli/domain";
import {
  Badge,
  Card,
  culturalColors,
  radii,
  spacing,
  typography,
  useCalpulliTheme,
} from "@calpulli/ui";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

import {
  DEMO_ROLE_DEFINITIONS,
  type DemoRoleDefinition,
} from "./role-definitions";

export function RoleSelector({
  busyRole,
  currentRole,
  onSelect,
}: {
  busyRole: AppRole | null;
  currentRole: AppRole | null;
  onSelect(role: AppRole): void;
}) {
  return (
    <View accessibilityLabel="Perfiles de demostración" style={styles.grid}>
      {DEMO_ROLE_DEFINITIONS.map((definition) => (
        <RoleCard
          busy={busyRole === definition.role}
          current={currentRole === definition.role}
          definition={definition}
          disabled={busyRole !== null}
          key={definition.role}
          onPress={() => onSelect(definition.role)}
        />
      ))}
    </View>
  );
}

function RoleCard({
  busy,
  current,
  definition,
  disabled,
  onPress,
}: {
  busy: boolean;
  current: boolean;
  definition: DemoRoleDefinition;
  disabled: boolean;
  onPress(): void;
}) {
  const { theme } = useCalpulliTheme();
  const accent = culturalColors[definition.accent];

  return (
    <Pressable
      accessibilityHint="Abre el dashboard de este perfil sin iniciar sesión"
      accessibilityLabel={definition.label}
      accessibilityRole="button"
      accessibilityState={{ busy, selected: current }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.cardPressable,
        pressed && styles.pressed,
        disabled && !busy && styles.disabled,
      ]}
    >
      <Card elevated={current} style={[styles.card, { borderLeftColor: accent }]}>
        <View style={[styles.iconWell, { backgroundColor: theme.colors.surfaceMuted, borderColor: accent }]}>
          <Ionicons color={accent} name={definition.icon} size={28} />
        </View>
        <View style={styles.copy}>
          <View style={styles.titleRow}>
            <Text style={[styles.title, { color: theme.colors.textPrimary }]}>{definition.label}</Text>
            {current ? <Badge label="Último perfil" tone="accent" /> : null}
          </View>
          <Text style={[styles.summary, { color: theme.colors.textSecondary }]}>{definition.summary}</Text>
        </View>
        {busy ? (
          <ActivityIndicator color={theme.colors.primary} />
        ) : (
          <Ionicons color={theme.colors.primary} name="chevron-forward" size={22} />
        )}
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  cardPressable: {
    flexBasis: 290,
    flexGrow: 1,
  },
  card: {
    alignItems: "center",
    borderLeftWidth: 4,
    flexDirection: "row",
    gap: spacing.md,
    minHeight: 132,
  },
  iconWell: {
    alignItems: "center",
    borderRadius: radii.sm,
    borderWidth: 1,
    height: 54,
    justifyContent: "center",
    width: 54,
  },
  copy: {
    flex: 1,
    gap: spacing.xs,
  },
  titleRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  title: {
    ...typography.heading,
    flexShrink: 1,
  },
  summary: {
    ...typography.body,
  },
  pressed: {
    opacity: 0.68,
    transform: [{ scale: 0.995 }],
  },
  disabled: {
    opacity: 0.52,
  },
});
