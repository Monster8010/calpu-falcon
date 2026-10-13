import type { Department, ID, Story } from "@calpulli/domain";
import {
  Button,
  radii,
  spacing,
  typography,
  useCalpulliTheme,
} from "@calpulli/ui";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  getDepartmentAccent,
  getDepartmentMonogram,
} from "../home/presentation";

export interface StoryViewerProps {
  departmentsById: ReadonlyMap<ID, Department>;
  index: number | null;
  onChangeIndex(index: number): void;
  onClose(): void;
  stories: Story[];
}

export function StoryViewer({
  departmentsById,
  index,
  onChangeIndex,
  onClose,
  stories,
}: StoryViewerProps) {
  const { theme } = useCalpulliTheme();
  const story = index === null ? undefined : stories[index];

  if (story === undefined || index === null) {
    return null;
  }

  const department = departmentsById.get(story.departmentId);
  const departmentName = department?.name ?? "UPIICSA Calpulli";
  const accent = getDepartmentAccent(department);
  const hasPrevious = index > 0;
  const hasNext = index < stories.length - 1;

  return (
    <Modal
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
      transparent
      visible
    >
      <SafeAreaView
        edges={["top", "bottom", "left", "right"]}
        style={[styles.overlay, { backgroundColor: theme.colors.overlay }]}
      >
        <View
          style={[
            styles.viewer,
            {
              backgroundColor: theme.colors.surfaceElevated,
              borderColor: theme.colors.borderSubtle,
            },
          ]}
        >
          <View style={styles.progress}>
            {stories.map(({ id }, progressIndex) => (
              <View
                key={id}
                style={[
                  styles.progressSegment,
                  {
                    backgroundColor:
                      progressIndex <= index
                        ? accent
                        : theme.colors.surfaceMuted,
                  },
                ]}
              />
            ))}
          </View>

          <View style={styles.header}>
            <View style={[styles.avatar, { borderColor: accent }]}>
              <Text style={[styles.monogram, { color: theme.colors.textPrimary }]}>
                {getDepartmentMonogram(department)}
              </Text>
            </View>
            <View style={styles.headerCopy}>
              <Text
                numberOfLines={1}
                style={[styles.departmentName, { color: theme.colors.textPrimary }]}
              >
                {departmentName}
              </Text>
              <Text style={[styles.counter, { color: theme.colors.textSecondary }]}>
                Historia {index + 1} de {stories.length}
              </Text>
            </View>
            <Pressable
              accessibilityLabel="Cerrar historia"
              accessibilityRole="button"
              hitSlop={spacing.sm}
              onPress={onClose}
              style={({ pressed }) => [
                styles.close,
                { backgroundColor: theme.colors.surfaceMuted },
                pressed && styles.pressed,
              ]}
            >
              <Ionicons
                color={theme.colors.textPrimary}
                name="close"
                size={24}
              />
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={styles.storyContent}>
            <View
              style={[
                styles.media,
                { backgroundColor: theme.colors.primaryMuted },
              ]}
            >
              <Ionicons
                color={theme.colors.primary}
                name="sparkles-outline"
                size={54}
              />
              <View style={styles.mediaPattern}>
                <View style={[styles.patternLong, { backgroundColor: accent }]} />
                <View style={[styles.patternMedium, { backgroundColor: accent }]} />
                <View style={[styles.patternShort, { backgroundColor: accent }]} />
              </View>
            </View>

            <View style={styles.copy}>
              {story.title ? (
                <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
                  {story.title}
                </Text>
              ) : null}
              {story.body ? (
                <Text style={[styles.body, { color: theme.colors.textSecondary }]}>
                  {story.body}
                </Text>
              ) : null}
              <View style={styles.views}>
                <Ionicons
                  color={theme.colors.textSecondary}
                  name="eye-outline"
                  size={18}
                />
                <Text style={[styles.counter, { color: theme.colors.textSecondary }]}>
                  {story.views.toLocaleString("es-MX")} visualizaciones
                </Text>
              </View>
            </View>
          </ScrollView>

          <View style={styles.actions}>
            {hasPrevious ? (
              <Button
                label="Anterior"
                onPress={() => onChangeIndex(index - 1)}
                variant="ghost"
              />
            ) : (
              <View />
            )}
            <Button
              label={hasNext ? "Siguiente" : "Cerrar"}
              onPress={hasNext ? () => onChangeIndex(index + 1) : onClose}
              variant={hasNext ? "primary" : "secondary"}
            />
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    padding: spacing.lg,
  },
  viewer: {
    borderRadius: radii.lg,
    borderWidth: 1,
    flex: 1,
    maxHeight: 760,
    maxWidth: 560,
    overflow: "hidden",
    padding: spacing.lg,
    width: "100%",
    alignSelf: "center",
  },
  progress: {
    flexDirection: "row",
    gap: spacing.xs,
  },
  progressSegment: {
    borderRadius: radii.pill,
    flex: 1,
    height: 4,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md,
    paddingVertical: spacing.lg,
  },
  avatar: {
    alignItems: "center",
    borderRadius: radii.pill,
    borderWidth: 2,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  monogram: {
    fontSize: 13,
    fontWeight: "800",
  },
  headerCopy: {
    flex: 1,
  },
  departmentName: {
    ...typography.label,
  },
  counter: {
    ...typography.caption,
  },
  close: {
    alignItems: "center",
    borderRadius: radii.pill,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  storyContent: {
    gap: spacing.xxl,
    paddingBottom: spacing.xxl,
  },
  media: {
    alignItems: "center",
    aspectRatio: 1.12,
    borderRadius: radii.md,
    justifyContent: "center",
    overflow: "hidden",
  },
  mediaPattern: {
    alignItems: "flex-end",
    bottom: spacing.xxl,
    gap: spacing.xs,
    position: "absolute",
    right: spacing.xxl,
  },
  patternLong: {
    height: 10,
    width: 100,
  },
  patternMedium: {
    height: 10,
    width: 72,
  },
  patternShort: {
    height: 10,
    width: 44,
  },
  copy: {
    gap: spacing.md,
  },
  title: {
    ...typography.title,
  },
  body: {
    ...typography.body,
  },
  views: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
  },
  actions: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: spacing.md,
  },
  pressed: {
    opacity: 0.65,
  },
});
