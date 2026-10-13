import type {
  Entrepreneur,
  ID,
  Stand,
  StandRequest,
  StandRequestStatus,
} from "@calpulli/domain";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  radii,
  spacing,
  typography,
  useCalpulliTheme,
} from "@calpulli/ui";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, View } from "react-native";

import { formatFairDate } from "./fair-admin-models";

const STATUS_PRESENTATION: Readonly<
  Record<StandRequestStatus, { label: string; tone: "danger" | "neutral" | "success" | "warning" }>
> = {
  pending: { label: "Pendiente", tone: "warning" },
  approved: { label: "Aprobada", tone: "success" },
  rejected: { label: "Rechazada", tone: "danger" },
  cancelled: { label: "Cancelada", tone: "neutral" },
};

export function FairRequestList({
  entrepreneurs,
  onApprove,
  onReject,
  requests,
  stands,
  workingId,
}: {
  entrepreneurs: readonly Entrepreneur[];
  onApprove(request: StandRequest): void;
  onReject(request: StandRequest): void;
  requests: readonly StandRequest[];
  stands: readonly Stand[];
  workingId: string | null;
}) {
  const { theme } = useCalpulliTheme();
  const busy = workingId !== null;
  const entrepreneursById = new Map<ID, Entrepreneur>(
    entrepreneurs.map((item) => [item.id, item]),
  );
  const standsById = new Map<ID, Stand>(stands.map((item) => [item.id, item]));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text accessibilityRole="header" style={[styles.title, { color: theme.colors.textPrimary }]}>Solicitudes de stand</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>Las pendientes aparecen primero. Aprobar o rechazar actualiza solicitud y stand en una sola mutación.</Text>
      </View>

      {requests.length === 0 ? (
        <EmptyState
          description="Cuando un emprendimiento solicite una mesa, aparecerá aquí para revisión."
          illustration={<Ionicons color={theme.colors.primary} name="clipboard-outline" size={48} />}
          title="No hay solicitudes para esta edición"
        />
      ) : (
        <View style={styles.list}>
          {requests.map((request) => {
            const entrepreneur = entrepreneursById.get(request.entrepreneurId);
            const stand = standsById.get(request.standId);
            const status = STATUS_PRESENTATION[request.status];
            const working = workingId === request.id;
            return (
              <Card elevated={request.status === "pending"} key={request.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={[styles.avatar, { backgroundColor: theme.colors.primaryMuted }]}>
                    <Text style={[styles.avatarText, { color: theme.colors.primary }]}>{(entrepreneur?.displayName ?? "?").slice(0, 2).toLocaleUpperCase("es-MX")}</Text>
                  </View>
                  <View style={styles.identity}>
                    <Text style={[styles.name, { color: theme.colors.textPrimary }]}>{entrepreneur?.displayName ?? "Emprendimiento no disponible"}</Text>
                    <Text style={[styles.meta, { color: theme.colors.textSecondary }]}>{entrepreneur?.category ?? "Sin categoría"}</Text>
                  </View>
                  <Badge label={status.label} tone={status.tone} />
                </View>
                <View style={[styles.requestMeta, { backgroundColor: theme.colors.surfaceMuted }]}>
                  <Meta icon="grid-outline" label={stand ? `Mesa ${stand.number}` : "Stand no disponible"} />
                  <Meta icon="calendar-outline" label={formatFairDate(request.requestedAt)} />
                </View>
                {request.note ? <Text style={[styles.note, { color: theme.colors.textSecondary }]}>Nota: {request.note}</Text> : null}
                {request.status === "pending" ? (
                  <View style={styles.actions}>
                    <Button disabled={busy} label="Aprobar" loading={working} onPress={() => onApprove(request)} />
                    <Button disabled={busy} label="Rechazar" onPress={() => onReject(request)} variant="secondary" />
                  </View>
                ) : null}
              </Card>
            );
          })}
        </View>
      )}
    </View>
  );
}

function Meta({ icon, label }: { icon: "calendar-outline" | "grid-outline"; label: string }) {
  const { theme } = useCalpulliTheme();
  return (
    <View style={styles.metaItem}>
      <Ionicons color={theme.colors.primary} name={icon} size={18} />
      <Text style={[styles.meta, { color: theme.colors.textSecondary }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.xxl },
  header: { gap: spacing.xs },
  title: { ...typography.title },
  subtitle: { ...typography.body },
  list: { gap: spacing.md },
  card: { gap: spacing.lg },
  cardHeader: { alignItems: "center", flexDirection: "row", gap: spacing.md },
  avatar: { alignItems: "center", borderRadius: radii.pill, height: 48, justifyContent: "center", width: 48 },
  avatarText: { ...typography.label },
  identity: { flex: 1, gap: spacing.xs },
  name: { ...typography.label },
  meta: { ...typography.caption },
  requestMeta: { borderRadius: radii.sm, flexDirection: "row", flexWrap: "wrap", gap: spacing.lg, padding: spacing.md },
  metaItem: { alignItems: "center", flexDirection: "row", gap: spacing.xs },
  note: { ...typography.body },
  actions: { flexDirection: "row", flexWrap: "wrap", gap: spacing.md },
});
