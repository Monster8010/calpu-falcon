import type { EntrepreneurPost } from "@calpulli/domain";
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
import { StyleSheet, Text, View } from "react-native";

import { formatEntrepreneurDate } from "./entrepreneur-models";

export function EntrepreneurPostList({
  deletingId,
  onCreate,
  onDelete,
  onEdit,
  posts,
}: {
  deletingId: string | null;
  onCreate(): void;
  onDelete(post: EntrepreneurPost): void;
  onEdit(post: EntrepreneurPost): void;
  posts: readonly EntrepreneurPost[];
}) {
  const { theme } = useCalpulliTheme();
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <Text accessibilityRole="header" style={[styles.title, { color: theme.colors.textPrimary }]}>Mis publicaciones</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>Contenido del perfil y Marketplace, separado del feed institucional.</Text>
        </View>
        <Button label="Crear publicación" leading={<Ionicons color={theme.colors.textOnAccent} name="add-outline" size={19} />} onPress={onCreate} />
      </View>
      {posts.length === 0 ? (
        <EmptyState description="Crea la primera historia de tu proyecto para Marketplace." illustration={<Ionicons color={theme.colors.primary} name="newspaper-outline" size={48} />} title="Aún no hay publicaciones" />
      ) : (
        <View style={styles.list}>
          {posts.map((post) => (
            <Card key={post.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.cardCopy}>
                  <Text style={[styles.cardTitle, { color: theme.colors.textPrimary }]}>{post.title}</Text>
                  <Text style={[styles.meta, { color: theme.colors.textSecondary }]}>{formatEntrepreneurDate(post.publishedAt)} · {post.media.length} medios</Text>
                </View>
                <Badge label={post.isHiddenByModerator ? "Oculta por moderación" : post.isPublished ? "Publicada" : "Borrador"} tone={post.isHiddenByModerator ? "danger" : post.isPublished ? "success" : "neutral"} />
              </View>
              <Text numberOfLines={3} style={[styles.body, { color: theme.colors.textSecondary }]}>{post.body}</Text>
              <View style={styles.actions}>
                <Button label="Editar" onPress={() => onEdit(post)} variant="secondary" />
                <Button disabled={deletingId !== null} label="Eliminar" loading={deletingId === post.id} onPress={() => onDelete(post)} variant="ghost" />
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
  header: { alignItems: "flex-start", flexDirection: "row", flexWrap: "wrap", gap: spacing.md, justifyContent: "space-between" },
  headerCopy: { flex: 1, gap: spacing.xs, minWidth: 230 },
  title: { ...typography.title },
  subtitle: { ...typography.body },
  list: { gap: spacing.md },
  card: { gap: spacing.lg },
  cardHeader: { alignItems: "flex-start", flexDirection: "row", flexWrap: "wrap", gap: spacing.md },
  cardCopy: { flex: 1, gap: spacing.xs, minWidth: 190 },
  cardTitle: { ...typography.heading },
  meta: { ...typography.caption },
  body: { ...typography.body },
  actions: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, justifyContent: "flex-end" },
});
