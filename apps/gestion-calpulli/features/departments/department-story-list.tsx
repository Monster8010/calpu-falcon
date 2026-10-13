import { isStoryVisibleAt, type Story } from "@calpulli/domain";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  spacing,
  typography,
  useCalpulliTheme,
} from "@calpulli/ui";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { formatManagementDate } from "./department-presentation";

function storyStatus(story: Story, now: string): { label: string; tone: "danger" | "neutral" | "success" | "warning" } {
  if (!story.isActive) return { label: "Inactiva", tone: "neutral" };
  if (isStoryVisibleAt(story, now)) return { label: "Activa", tone: "success" };
  if (Date.parse(story.startsAt) > Date.parse(now)) return { label: "Programada", tone: "warning" };
  return { label: "Expirada", tone: "danger" };
}

export function DepartmentStoryList({
  deletingId,
  now,
  onCreate,
  onDelete,
  onEdit,
  stories,
}: {
  deletingId: string | null;
  now: string;
  onCreate(): void;
  onDelete(story: Story): void;
  onEdit(story: Story): void;
  stories: readonly Story[];
}) {
  const { theme } = useCalpulliTheme();
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <Text accessibilityRole="header" style={[styles.title, { color: theme.colors.textPrimary }]}>Mis historias</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>Avisos temporales con media empaquetada y expiración sencilla.</Text>
        </View>
        <Button label="Crear historia" onPress={onCreate} />
      </View>

      {stories.length === 0 ? (
        <EmptyState action={<Button label="Crear primera historia" onPress={onCreate} />} description="Las historias activas aparecerán en el carrusel público." title="Todavía no hay historias" />
      ) : (
        <View style={styles.list}>
          {stories.map((story) => {
            const status = storyStatus(story, now);
            return (
              <Card key={story.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Badge label={status.label} tone={status.tone} />
                  <View style={styles.views}>
                    <Ionicons color={theme.colors.textSecondary} name="eye-outline" size={17} />
                    <Text style={[styles.meta, { color: theme.colors.textSecondary }]}>{story.views.toLocaleString("es-MX")}</Text>
                  </View>
                </View>
                <View style={styles.copy}>
                  <Text style={[styles.storyTitle, { color: theme.colors.textPrimary }]}>{story.title ?? "Historia sin título"}</Text>
                  {story.body ? <Text numberOfLines={2} style={[styles.body, { color: theme.colors.textSecondary }]}>{story.body}</Text> : null}
                  <Text style={[styles.meta, { color: theme.colors.textSecondary }]}>Expira: {formatManagementDate(story.expiresAt)}</Text>
                </View>
                <View style={[styles.actions, { borderTopColor: theme.colors.borderSubtle }]}>
                  <Pressable accessibilityLabel={`Editar ${story.title ?? "historia"}`} accessibilityRole="button" onPress={() => onEdit(story)} style={({ pressed }) => [styles.textAction, pressed && styles.pressed]}>
                    <Ionicons color={theme.colors.primary} name="create-outline" size={19} />
                    <Text style={[styles.actionLabel, { color: theme.colors.primary }]}>Editar</Text>
                  </Pressable>
                  <Pressable
                    accessibilityLabel={`Eliminar ${story.title ?? "historia"}`}
                    accessibilityRole="button"
                    accessibilityState={{ busy: deletingId === story.id, disabled: deletingId !== null }}
                    disabled={deletingId !== null}
                    onPress={() => onDelete(story)}
                    style={({ pressed }) => [styles.textAction, pressed && styles.pressed, deletingId !== null && styles.disabled]}
                  >
                    <Ionicons color={theme.colors.danger} name="trash-outline" size={19} />
                    <Text style={[styles.actionLabel, { color: theme.colors.danger }]}>{deletingId === story.id ? "Eliminando…" : "Eliminar"}</Text>
                  </Pressable>
                </View>
              </Card>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.xxl },
  header: { alignItems: "flex-start", flexDirection: "row", flexWrap: "wrap", gap: spacing.lg, justifyContent: "space-between" },
  headerCopy: { flex: 1, gap: spacing.xs, minWidth: 230 },
  title: { ...typography.title },
  subtitle: { ...typography.body },
  list: { gap: spacing.md },
  card: { gap: spacing.lg },
  cardHeader: { alignItems: "center", flexDirection: "row", justifyContent: "space-between" },
  views: { alignItems: "center", flexDirection: "row", gap: spacing.xs },
  meta: { ...typography.caption },
  copy: { gap: spacing.sm },
  storyTitle: { ...typography.heading },
  body: { ...typography.body },
  actions: { borderTopWidth: 1, flexDirection: "row", flexWrap: "wrap", gap: spacing.xl, paddingTop: spacing.md },
  textAction: { alignItems: "center", flexDirection: "row", gap: spacing.xs, minHeight: 38 },
  actionLabel: { ...typography.label },
  pressed: { opacity: 0.62 },
  disabled: { opacity: 0.45 },
});
