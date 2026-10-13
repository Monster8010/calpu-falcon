import type { Department, ID } from "@calpulli/domain";
import {
  radii,
  spacing,
  typography,
  useCalpulliTheme,
} from "@calpulli/ui";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  getDepartmentAccent,
  getDepartmentMonogram,
} from "./presentation";

export interface DepartmentFilterRailProps {
  departments: Department[];
  onSelect(departmentId?: ID): void;
  selectedDepartmentId?: ID;
}

export function DepartmentFilterRail({
  departments,
  onSelect,
  selectedDepartmentId,
}: DepartmentFilterRailProps) {
  return (
    <View style={styles.section}>
      <SectionHeading
        subtitle="Elige un área para enfocar los avisos."
        title="Directorio"
      />
      <ScrollView
        contentContainerStyle={styles.rail}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        <FilterChip
          icon="apps-outline"
          label="Todos"
          onPress={() => onSelect(undefined)}
          selected={selectedDepartmentId === undefined}
        />
        {departments.map((department) => (
          <FilterChip
            accent={getDepartmentAccent(department)}
            key={department.id}
            label={department.shortName ?? department.name}
            monogram={getDepartmentMonogram(department)}
            onPress={() => onSelect(department.id)}
            selected={selectedDepartmentId === department.id}
          />
        ))}
      </ScrollView>
    </View>
  );
}

function FilterChip({
  accent,
  icon,
  label,
  monogram,
  onPress,
  selected,
}: {
  accent?: string;
  icon?: "apps-outline";
  label: string;
  monogram?: string;
  onPress(): void;
  selected: boolean;
}) {
  const { theme } = useCalpulliTheme();
  const avatarAccent = accent ?? theme.colors.primary;

  return (
    <Pressable
      accessibilityLabel={`Filtrar por ${label}`}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        {
          backgroundColor: selected
            ? theme.colors.primaryMuted
            : theme.colors.surface,
          borderColor: selected
            ? theme.colors.primary
            : theme.colors.borderSubtle,
        },
        pressed && styles.pressed,
      ]}
    >
      <View
        style={[
          styles.avatar,
          {
            backgroundColor: theme.colors.surfaceElevated,
            borderColor: avatarAccent,
          },
        ]}
      >
        {icon ? (
          <Ionicons color={theme.colors.primary} name={icon} size={18} />
        ) : (
          <Text style={[styles.monogram, { color: theme.colors.textPrimary }]}>
            {monogram}
          </Text>
        )}
      </View>
      <Text
        numberOfLines={1}
        style={[
          styles.chipLabel,
          {
            color: selected
              ? theme.colors.primary
              : theme.colors.textPrimary,
          },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export function SectionHeading({
  subtitle,
  title,
}: {
  subtitle?: string;
  title: string;
}) {
  const { theme } = useCalpulliTheme();

  return (
    <View style={styles.heading}>
      <Text style={[styles.headingTitle, { color: theme.colors.textPrimary }]}>
        {title}
      </Text>
      {subtitle ? (
        <Text
          style={[styles.headingSubtitle, { color: theme.colors.textSecondary }]}
        >
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: spacing.md,
  },
  heading: {
    gap: spacing.xs,
  },
  headingTitle: {
    ...typography.heading,
  },
  headingSubtitle: {
    ...typography.body,
  },
  rail: {
    gap: spacing.sm,
    paddingRight: spacing.xl,
  },
  chip: {
    alignItems: "center",
    borderRadius: radii.pill,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.sm,
    minHeight: 46,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  avatar: {
    alignItems: "center",
    borderRadius: radii.pill,
    borderWidth: 1,
    height: 28,
    justifyContent: "center",
    width: 28,
  },
  monogram: {
    fontSize: 10,
    fontWeight: "800",
  },
  chipLabel: {
    ...typography.label,
    maxWidth: 148,
  },
  pressed: {
    opacity: 0.7,
  },
});
