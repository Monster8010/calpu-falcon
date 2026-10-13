import type {
  Entrepreneur,
  ID,
  Stand,
  StandRequest,
  StandStatus,
} from "@calpulli/domain";
import {
  Badge,
  Button,
  Card,
  culturalColors,
  radii,
  spacing,
  typography,
  useCalpulliTheme,
} from "@calpulli/ui";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import { InlineNotice } from "../forms/management-form-controls";

const MAP_GAP = spacing.sm;
const STATUS_LABEL: Readonly<Record<StandStatus, string>> = {
  available: "Disponible",
  requested: "Solicitud pendiente",
  assigned: "Asignado",
};

export function FairAdminMap({
  busy,
  entrepreneurs,
  onApprove,
  onReject,
  onRelease,
  requests,
  stands,
  workingId,
}: {
  busy: boolean;
  entrepreneurs: readonly Entrepreneur[];
  onApprove(request: StandRequest): void;
  onReject(request: StandRequest): void;
  onRelease(stand: Stand): void;
  requests: readonly StandRequest[];
  stands: readonly Stand[];
  workingId: string | null;
}) {
  const { theme } = useCalpulliTheme();
  const { width: viewportWidth } = useWindowDimensions();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const cellSize = Math.max(44, Math.min(56, (viewportWidth - spacing.xl * 2 - MAP_GAP * 6) / 7));
  const columns = Math.max(1, ...stands.map(({ coordinate }) => coordinate.column + 1));
  const rows = Math.max(1, ...stands.map(({ coordinate }) => coordinate.row + 1));
  const mapWidth = columns * cellSize + Math.max(0, columns - 1) * MAP_GAP;
  const mapHeight = rows * cellSize + Math.max(0, rows - 1) * MAP_GAP;
  const branchColumns = useMemo(
    () => [...new Set(stands.filter(({ coordinate }) => coordinate.branch !== "top").map(({ coordinate }) => coordinate.column))].sort((a, b) => a - b),
    [stands],
  );
  const entrepreneursById = useMemo(
    () => new Map<ID, Entrepreneur>(entrepreneurs.map((item) => [item.id, item])),
    [entrepreneurs],
  );
  const requestsById = useMemo(
    () => new Map<ID, StandRequest>(requests.map((item) => [item.id, item])),
    [requests],
  );
  const selected = stands.find(({ id }) => id === selectedId);
  const selectedRequest = selected?.activeRequestId
    ? requestsById.get(selected.activeRequestId)
    : undefined;
  const selectedEntrepreneurId = selected?.assignedEntrepreneurId ?? selectedRequest?.entrepreneurId;
  const selectedEntrepreneur = selectedEntrepreneurId
    ? entrepreneursById.get(selectedEntrepreneurId)
    : undefined;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text accessibilityRole="header" style={[styles.title, { color: theme.colors.textPrimary }]}>Mapa administrativo</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>Toca una mesa para revisar su solicitud, emprendimiento y acciones disponibles.</Text>
      </View>
      <View accessibilityLabel="Simbología del mapa" style={styles.legend}>
        <Legend color={theme.colors.textSecondary} label="Disponible" />
        <Legend color={theme.colors.warning} label="Solicitado" />
        <Legend color={culturalColors.mayaBlue} label="Asignado" />
      </View>

      {stands.length !== 40 ? <InlineNotice message={`La edición contiene ${stands.length} de 40 stands; revisa el estado compartido.`} /> : null}
      <Card style={styles.mapCard}>
        <ScrollView contentContainerStyle={styles.horizontalContent} horizontal showsHorizontalScrollIndicator={false}>
          <View accessibilityLabel={`Mapa administrativo con ${stands.length} mesas`} style={{ height: mapHeight, position: "relative", width: mapWidth }}>
            {branchColumns.map((column) => (
              <View
                key={column}
                pointerEvents="none"
                style={[
                  styles.branchLine,
                  {
                    backgroundColor: theme.colors.borderSubtle,
                    height: Math.max(0, mapHeight - cellSize),
                    left: column * (cellSize + MAP_GAP) + cellSize / 2 - 2,
                    top: cellSize,
                  },
                ]}
              />
            ))}
            {stands.map((stand) => (
              <AdminStandButton
                cellSize={cellSize}
                entrepreneur={stand.assignedEntrepreneurId ? entrepreneursById.get(stand.assignedEntrepreneurId) : undefined}
                key={stand.id}
                onPress={() => setSelectedId(stand.id)}
                selected={stand.id === selectedId}
                stand={stand}
              />
            ))}
          </View>
        </ScrollView>
      </Card>

      {selected ? (
        <StandAdminDetail
          entrepreneur={selectedEntrepreneur}
          busy={busy}
          onApprove={() => selectedRequest && onApprove(selectedRequest)}
          onReject={() => selectedRequest && onReject(selectedRequest)}
          onRelease={() => onRelease(selected)}
          request={selectedRequest}
          stand={selected}
          working={workingId === selected.id || workingId === selectedRequest?.id}
        />
      ) : (
        <InlineNotice message="Selecciona una mesa del mapa para abrir su ficha administrativa." tone="info" />
      )}
    </View>
  );
}

function AdminStandButton({
  cellSize,
  entrepreneur,
  onPress,
  selected,
  stand,
}: {
  cellSize: number;
  entrepreneur?: Entrepreneur;
  onPress(): void;
  selected: boolean;
  stand: Stand;
}) {
  const { theme } = useCalpulliTheme();
  const color = stand.status === "available"
    ? theme.colors.textSecondary
    : stand.status === "requested"
      ? theme.colors.warning
      : culturalColors.mayaBlue;
  const left = stand.coordinate.column * (cellSize + MAP_GAP);
  const top = stand.coordinate.row * (cellSize + MAP_GAP);

  return (
    <Pressable
      accessibilityLabel={`Mesa ${stand.number}, ${STATUS_LABEL[stand.status]}${entrepreneur ? `, ${entrepreneur.displayName}` : ""}`}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.stand,
        {
          backgroundColor: selected ? theme.colors.primaryMuted : theme.colors.surfaceElevated,
          borderColor: selected ? theme.colors.primary : color,
          height: cellSize,
          left,
          top,
          width: cellSize,
        },
        pressed && styles.pressed,
      ]}
    >
      <Ionicons color={color} name={stand.status === "assigned" ? "storefront-outline" : stand.status === "requested" ? "time-outline" : "add-outline"} size={20} />
      <View style={[styles.numberBadge, { backgroundColor: color }]}>
        <Text style={[styles.number, { color: theme.colors.textOnAccent }]}>{stand.number}</Text>
      </View>
    </Pressable>
  );
}

function StandAdminDetail({
  busy,
  entrepreneur,
  onApprove,
  onReject,
  onRelease,
  request,
  stand,
  working,
}: {
  busy: boolean;
  entrepreneur?: Entrepreneur;
  onApprove(): void;
  onReject(): void;
  onRelease(): void;
  request?: StandRequest;
  stand: Stand;
  working: boolean;
}) {
  const { theme } = useCalpulliTheme();
  return (
    <Card elevated style={styles.detail}>
      <View style={styles.detailHeader}>
        <View>
          <Text style={[styles.detailEyebrow, { color: theme.colors.textSecondary }]}>Ficha administrativa</Text>
          <Text style={[styles.detailTitle, { color: theme.colors.textPrimary }]}>Mesa {stand.number}</Text>
        </View>
        <Badge label={STATUS_LABEL[stand.status]} tone={stand.status === "assigned" ? "success" : stand.status === "requested" ? "warning" : "neutral"} />
      </View>
      {entrepreneur ? (
        <View style={styles.entrepreneur}>
          <View style={[styles.avatar, { backgroundColor: theme.colors.primaryMuted }]}>
            <Text style={[styles.avatarText, { color: theme.colors.primary }]}>{entrepreneur.displayName.slice(0, 2).toLocaleUpperCase("es-MX")}</Text>
          </View>
          <View style={styles.entrepreneurCopy}>
            <Text style={[styles.entrepreneurName, { color: theme.colors.textPrimary }]}>{entrepreneur.displayName}</Text>
            <Text style={[styles.meta, { color: theme.colors.textSecondary }]}>{entrepreneur.category}</Text>
          </View>
        </View>
      ) : (
        <Text style={[styles.body, { color: theme.colors.textSecondary }]}>No hay un emprendimiento asociado.</Text>
      )}
      {request ? <Text style={[styles.meta, { color: theme.colors.textSecondary }]}>Solicitud: {request.status} · {request.id}</Text> : null}
      {stand.status === "requested" && request?.status === "pending" ? (
        <View style={styles.detailActions}>
          <Button disabled={busy} label="Aprobar" loading={working} onPress={onApprove} />
          <Button disabled={busy} label="Rechazar" onPress={onReject} variant="secondary" />
        </View>
      ) : null}
      {stand.status === "assigned" ? <Button disabled={busy} label="Liberar stand" loading={working} onPress={onRelease} variant="secondary" /> : null}
      {stand.status === "requested" && request === undefined ? <InlineNotice message="El stand está solicitado, pero no conserva una solicitud activa válida." /> : null}
    </Card>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  const { theme } = useCalpulliTheme();
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendSwatch, { borderColor: color }]} />
      <Text style={[styles.meta, { color: theme.colors.textSecondary }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.xxl },
  header: { gap: spacing.xs },
  title: { ...typography.title },
  subtitle: { ...typography.body },
  legend: { flexDirection: "row", flexWrap: "wrap", gap: spacing.lg },
  legendItem: { alignItems: "center", flexDirection: "row", gap: spacing.sm },
  legendSwatch: { borderRadius: radii.xs, borderWidth: 2, height: 18, width: 18 },
  meta: { ...typography.caption },
  mapCard: { padding: spacing.md },
  horizontalContent: { minWidth: "100%" },
  branchLine: { position: "absolute", width: 4 },
  stand: { alignItems: "center", borderRadius: radii.sm, borderWidth: 2, justifyContent: "center", position: "absolute" },
  pressed: { opacity: 0.68, transform: [{ scale: 0.94 }] },
  numberBadge: { alignItems: "center", borderRadius: radii.pill, justifyContent: "center", left: -4, minHeight: 18, minWidth: 18, paddingHorizontal: 3, position: "absolute", top: -5 },
  number: { fontSize: 9, fontWeight: "800", lineHeight: 12 },
  detail: { gap: spacing.lg },
  detailHeader: { alignItems: "flex-start", flexDirection: "row", gap: spacing.md, justifyContent: "space-between" },
  detailEyebrow: { ...typography.caption },
  detailTitle: { ...typography.heading },
  entrepreneur: { alignItems: "center", flexDirection: "row", gap: spacing.md },
  avatar: { alignItems: "center", borderRadius: radii.pill, height: 48, justifyContent: "center", width: 48 },
  avatarText: { ...typography.label },
  entrepreneurCopy: { flex: 1, gap: spacing.xs },
  entrepreneurName: { ...typography.label },
  body: { ...typography.body },
  detailActions: { flexDirection: "row", flexWrap: "wrap", gap: spacing.md },
});
