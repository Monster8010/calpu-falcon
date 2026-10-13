import type { InstitutionalPost } from "@calpulli/domain";
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

import {
  formatManagementDate,
  getPriorityLabel,
  getPriorityTone,
} from "./department-presentation";

export function DepartmentPostList({
  deletingId,
  onCreate,
  onDelete,
  onEdit,
  posts,
}: {
  deletingId: string | null;
  onCreate(): void;
  onDelete(post: InstitutionalPost): void;
  onEdit(post: InstitutionalPost): void;
  posts: readonly InstitutionalPost[];
}) {
  const { theme } = useCalpulliTheme();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <Text accessibilityRole="header" style={[styles.title, { color: theme.colors.textPrimary }]}>Mis publicaciones</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>Publica directamente en Inicio o conserva un borrador visual.</Text>
        </View>
        <Button label="Crear publicación" onPress={onCreate} />
      </View>

      {posts.length === 0 ? (
        <EmptyState
          action={<Button label="Crear primera publicación" onPress={onCreate} />}
          description="Los avisos publicados aparecerán en la app pública después de refrescar."
          title="Todavía no hay publicaciones"
        />
      ) : (
        <View style={styles.list}>
          {posts.map((post) => (
            <Card elevated={post.priority === "urgent"} key={post.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.badges}>
                  <Badge label={getPriorityLabel(post.priority)} tone={getPriorityTone(post.priority)} />
                  <Badge
                    label={post.isHiddenByModerator ? "Oculta por moderación" : post.isPublished ? "Publicada" : "Borrador"}
                    tone={post.isHiddenByModerator ? "danger" : post.isPublished ? "success" : "neutral"}
                  />
                </View>
                <View style={styles.views}>
                  <Ionicons color={theme.colors.textSecondary} name="eye-outline" size={17} />
                  <Text style={[styles.meta, { color: theme.colors.textSecondary }]}>{post.views.toLocaleString("es-MX")}</Text>
                </View>
              </View>
              <View style={styles.copy}>
                <Text style={[styles.postTitle, { color: theme.colors.textPrimary }]}>{post.title}</Text>
                <Text numberOfLines={2} style={[styles.body, { color: theme.colors.textSecondary }]}>{post.body}</Text>
                <Text style={[styles.meta, { color: theme.colors.textSecondary }]}>{formatManagementDate(post.publishedAt)}</Text>
              </View>
              <View style={[styles.actions, { borderTopColor: theme.colors.borderSubtle }]}>
                <Pressable accessibilityLabel={`Editar ${post.title}`} accessibilityRole="button" onPress={() => onEdit(post)} style={({ pressed }) => [styles.textAction, pressed && styles.pressed]}>
                  <Ionicons color={theme.colors.primary} name="create-outline" size={19} />
                  <Text style={[styles.actionLabel, { color: theme.colors.primary }]}>Editar</Text>
                </Pressable>
                <Pressable
                  accessibilityLabel={`Eliminar ${post.title}`}
                  accessibilityRole="button"
                  accessibilityState={{ busy: deletingId === post.id, disabled: deletingId !== null }}
                  disabled={deletingId !== null}
                  onPress={() => onDelete(post)}
                  style={({ pressed }) => [styles.textAction, pressed && styles.pressed, deletingId !== null && styles.disabled]}
                >
                  <Ionicons color={theme.colors.danger} name="trash-outline" size={19} />
                  <Text style={[styles.actionLabel, { color: theme.colors.danger }]}>{deletingId === post.id ? "Eliminando…" : "Eliminar"}</Text>
                </Pressable>
              </View>
            </Card>
          ))}
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
  cardHeader: { alignItems: "flex-start", flexDirection: "row", gap: spacing.md, justifyContent: "space-between" },
  badges: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  views: { alignItems: "center", flexDirection: "row", gap: spacing.xs },
  meta: { ...typography.caption },
  copy: { gap: spacing.sm },
  postTitle: { ...typography.heading },
  body: { ...typography.body },
  actions: { borderTopWidth: 1, flexDirection: "row", flexWrap: "wrap", gap: spacing.xl, paddingTop: spacing.md },
  textAction: { alignItems: "center", flexDirection: "row", gap: spacing.xs, minHeight: 38 },
  actionLabel: { ...typography.label },
  pressed: { opacity: 0.62 },
  disabled: { opacity: 0.45 },
});
