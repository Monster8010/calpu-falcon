import {
  AppHeader,
  Badge,
  Button,
  Card,
  spacing,
  typography,
  useCalpulliTheme,
} from "@calpulli/ui";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, View } from "react-native";

import {
  getModerationKindLabel,
  type ModerationListItem,
} from "./moderation-models";
import { ModerationStatusBadge } from "./moderation-content-list";

function formatDateTime(value: string): string {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime())
    ? "Fecha no disponible"
    : parsed.toLocaleString("es-MX", {
      dateStyle: "medium",
      timeStyle: "short",
    });
}

export function ModerationContentDetail({
  item,
  mutating,
  onSetHidden,
}: {
  item: ModerationListItem;
  mutating: boolean;
  onSetHidden(hidden: boolean): void;
}) {
  const { theme } = useCalpulliTheme();

  return (
    <View style={styles.container}>
      <AppHeader
        eyebrow="Detalle de moderación"
        subtitle="Revisa el contenido completo antes de cambiar su visibilidad."
        title={item.title}
      />

      <Card elevated style={styles.card}>
        <View style={styles.badges}>
          <ModerationStatusBadge status={item.status} />
          <Badge label={getModerationKindLabel(item.kind)} tone="accent" />
        </View>

        <DetailRow icon="person-outline" label="Propietario" value={item.ownerLabel} />
        <DetailRow icon="calendar-outline" label="Publicación" value={formatDateTime(item.publishedAt)} />
        <DetailRow icon="refresh-outline" label="Último cambio" value={formatDateTime(item.updatedAt)} />
        <DetailRow icon="images-outline" label="Medios referenciados" value={String(item.mediaCount)} />

        <View style={[styles.bodyBlock, { borderTopColor: theme.colors.borderSubtle }]}>
          <Text style={[styles.bodyLabel, { color: theme.colors.textPrimary }]}>Contenido</Text>
          <Text style={[styles.body, { color: theme.colors.textSecondary }]}>{item.body}</Text>
        </View>
      </Card>

      <Card style={styles.policyCard}>
        <Ionicons color={theme.colors.primary} name="information-circle-outline" size={22} />
        <Text style={[styles.policyText, { color: theme.colors.textSecondary }]}>
          Ocultar no elimina la publicación. Restaurar sólo quita la marca de moderación y no publica un borrador ni reactiva a su propietario.
        </Text>
      </Card>

      <Button
        label={item.isHiddenByModerator ? "Restaurar publicación" : "Ocultar publicación"}
        loading={mutating}
        onPress={() => onSetHidden(!item.isHiddenByModerator)}
        variant={item.isHiddenByModerator ? "primary" : "secondary"}
      />
    </View>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  const { theme } = useCalpulliTheme();
  return (
    <View style={styles.detailRow}>
      <Ionicons color={theme.colors.primary} name={icon} size={20} />
      <View style={styles.detailCopy}>
        <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>{label}</Text>
        <Text style={[styles.detailValue, { color: theme.colors.textPrimary }]}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.xxl },
  card: { gap: spacing.lg },
  badges: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  detailRow: { alignItems: "center", flexDirection: "row", gap: spacing.md },
  detailCopy: { flex: 1, gap: spacing.xs },
  detailLabel: { ...typography.caption },
  detailValue: { ...typography.body, fontWeight: "600" },
  bodyBlock: { borderTopWidth: 1, gap: spacing.sm, paddingTop: spacing.lg },
  bodyLabel: { ...typography.label },
  body: { ...typography.body },
  policyCard: { alignItems: "flex-start", flexDirection: "row", gap: spacing.md },
  policyText: { ...typography.caption, flex: 1 },
});
