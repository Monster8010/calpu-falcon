import type { Department, ID, Story } from "@calpulli/domain";
import {
  radii,
  spacing,
  typography,
  useCalpulliTheme,
} from "@calpulli/ui";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { SectionHeading } from "../home/department-filter-rail";
import {
  getDepartmentAccent,
  getDepartmentMonogram,
} from "../home/presentation";

export interface DepartmentStoriesRailProps {
  departmentsById: ReadonlyMap<ID, Department>;
  onOpen(index: number): void;
  stories: Story[];
}

export function DepartmentStoriesRail({
  departmentsById,
  onOpen,
  stories,
}: DepartmentStoriesRailProps) {
  if (stories.length === 0) {
    return null;
  }

  return (
    <View style={styles.section}>
      <SectionHeading title="Historias" />
      <ScrollView
        contentContainerStyle={styles.rail}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {stories.map((story, index) => {
          const department = departmentsById.get(story.departmentId);
          return (
            <StoryItem
              accent={getDepartmentAccent(department)}
              departmentName={department?.shortName ?? department?.name ?? "Calpulli"}
              key={story.id}
              monogram={getDepartmentMonogram(department)}
              onPress={() => onOpen(index)}
            />
          );
        })}
      </ScrollView>
    </View>
  );
}

function StoryItem({
  accent,
  departmentName,
  monogram,
  onPress,
}: {
  accent: string;
  departmentName: string;
  monogram: string;
  onPress(): void;
}) {
  const { theme } = useCalpulliTheme();

  return (
    <Pressable
      accessibilityHint="Abre la historia temporal"
      accessibilityLabel={`Historia de ${departmentName}`}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.item, pressed && styles.pressed]}
    >
      <View style={[styles.ring, { borderColor: accent }]}>
        <View
          style={[
            styles.avatar,
            {
              backgroundColor: theme.colors.surfaceElevated,
              borderColor: theme.colors.background,
            },
          ]}
        >
          <Text style={[styles.monogram, { color: theme.colors.textPrimary }]}>
            {monogram}
          </Text>
        </View>
      </View>
      <Text
        numberOfLines={2}
        style={[styles.name, { color: theme.colors.textPrimary }]}
      >
        {departmentName}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: spacing.md,
  },
  rail: {
    gap: spacing.md,
    paddingRight: spacing.xl,
  },
  item: {
    alignItems: "center",
    gap: spacing.sm,
    width: 78,
  },
  ring: {
    alignItems: "center",
    borderRadius: radii.pill,
    borderWidth: 3,
    height: 68,
    justifyContent: "center",
    width: 68,
  },
  avatar: {
    alignItems: "center",
    borderRadius: radii.pill,
    borderWidth: 2,
    height: 58,
    justifyContent: "center",
    width: 58,
  },
  monogram: {
    fontSize: 18,
    fontWeight: "800",
  },
  name: {
    ...typography.caption,
    textAlign: "center",
  },
  pressed: {
    opacity: 0.65,
    transform: [{ scale: 0.98 }],
  },
});
