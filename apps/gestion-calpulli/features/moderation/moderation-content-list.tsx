import {
  Badge,
  Button,
  Card,
  EmptyState,
  spacing,
  typography,
  useCalpulliTheme,
  type BadgeTone,
} from "@calpulli/ui";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, View } from "react-native";

import {
  getModerationKindLabel,
  getModerationStatusLabel,
  type ModerationListItem,
  type ModerationStatus,
} from "./moderation-models";

function getStatusTone(status: ModerationStatus): BadgeTone {
  if (status === "hidden") return "danger";
  if (status === "public") return "success";
  if (status === "owner-inactive") return "warning";
  return "neutral";
}

function formatDate(value: string): string {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime())
    ? "Fecha no disponible"
    : parsed.toLocaleDateString("es-MX", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
}

export function ModerationStatusBadge({
  status,
}: {
  status: ModerationStatus;
}) {
  return (
    <Badge
      label={getModerationStatusLabel(status)}
      tone={getStatusTone(status)}
    />
  );
}

export function ModerationContentList({
  items,
  mutatingKey,
  onOpen,
  onSetHidden,
}: {
  items: readonly ModerationListItem[];
  mutatingKey: string | null;
  onOpen(item: ModerationListItem): void;
  onSetHidden(item: ModerationListItem, hidden: boolean): void;
}) {
  const { theme } = useCalpulliTheme();

  if (items.length === 0) {
    return (
      <EmptyState
        description="Cambia el filtro o refresca el almacenamiento compartido."
        illustration={(
          <Ionicons
            color={theme.colors.primary}
            name="shield-checkmark-outline"
            size={48}
          />
        )}
        title="No hay contenido en este estado"
      />
    );
  }

  return (
    <View style={styles.list}>
      {items.map((item) => {
        const itemKey = `${item.kind}:${item.id}`;
        const isMutating = mutatingKey === itemKey;
        return (
          <Card elevated={item.status === "hidden"} key={itemKey} style={styles.card}>
            <View style={styles.header}>
              <View style={[styles.icon, { backgroundColor: theme.colors.primaryMuted }]}>
                <Ionicons
                  color={theme.colors.primary}
                  name={item.kind === "institutional-post" ? "document-text-outline" : "storefront-outline"}
                  size={23}
                />
              </View>
              <View style={styles.headerCopy}>
                <Text style={[styles.title, { color: theme.colors.textPrimary }]}>{item.title}</Text>
                <Text style={[styles.meta, { color: theme.colors.textSecondary }]}>
                  {item.ownerLabel} · {formatDate(item.publishedAt)}
                </Text>
              </View>
              <ModerationStatusBadge status={item.status} />
            </View>

            <View style={styles.kindRow}>
              <Badge label={getModerationKindLabel(item.kind)} tone="accent" />
              <Text style={[styles.media, { color: theme.colors.textSecondary }]}>
                {item.mediaCount === 1 ? "1 medio" : `${item.mediaCount} medios`}
              </Text>
            </View>

            <Text numberOfLines={3} style={[styles.body, { color: theme.colors.textSecondary }]}>
              {item.body}
            </Text>

            <View style={styles.actions}>
              <Button
                disabled={mutatingKey !== null}
                label="Ver detalle"
                onPress={() => onOpen(item)}
                variant="secondary"
              />
              <Button
                disabled={mutatingKey !== null}
                label={item.isHiddenByModerator ? "Restaurar" : "Ocultar"}
                loading={isMutating}
                onPress={() => onSetHidden(item, !item.isHiddenByModerator)}
                variant={item.isHiddenByModerator ? "primary" : "ghost"}
              />
            </View>
          </Card>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: spacing.md },
  card: { gap: spacing.lg },
  header: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  icon: {
    alignItems: "center",
    height: 48,
    justifyContent: "center",
    width: 48,
  },
  headerCopy: { flex: 1, gap: spacing.xs, minWidth: 180 },
  title: { ...typography.heading },
  meta: { ...typography.caption },
  kindRow: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  media: { ...typography.caption },
  body: { ...typography.body },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    justifyContent: "flex-end",
  },
});
