import {
  isActiveStandRequest,
  type Fair,
  type Stand,
  type StandRequest,
  type StandStatus,
} from "@calpulli/domain";
import {
  Badge,
  Button,
  Card,
  EmptyState,
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
import {
  formatEntrepreneurDate,
  getCurrentStandRequest,
} from "./entrepreneur-models";
import { REQUEST_PRESENTATION } from "./entrepreneur-presentation";

const MAP_GAP = spacing.sm;
const STATUS_LABEL: Readonly<Record<StandStatus, string>> = {
  available: "Disponible",
  requested: "Solicitada",
  assigned: "Asignada",
};

export function EntrepreneurFair({
  fair,
  onRequest,
  requestingStandId,
  requests,
  stands,
}: {
  fair?: Fair;
  onRequest(stand: Stand): void;
  requestingStandId: string | null;
  requests: readonly StandRequest[];
  stands: readonly Stand[];
}) {
  const { theme } = useCalpulliTheme();
  const { width: viewportWidth } = useWindowDimensions();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const branchColumns = useMemo(
    () => [...new Set(stands.filter(({ coordinate }) => coordinate.branch !== "top").map(({ coordinate }) => coordinate.column))].sort((a, b) => a - b),
    [stands],
  );

  if (fair === undefined) {
    return (
      <EmptyState
        description="El estado compartido no contiene una feria próxima o activa."
        illustration={<Ionicons color={theme.colors.primary} name="calendar-outline" size={48} />}
        title="No hay feria disponible"
      />
    );
  }

  const activeRequest = requests.find(isActiveStandRequest);
  const currentRequest = getCurrentStandRequest(requests);
  const requestStand = currentRequest
    ? stands.find(({ id }) => id === currentRequest.standId)
    : undefined;
  const selected = stands.find(({ id }) => id === selectedId);
  const selectionEnabled = activeRequest === undefined;
  const cellSize = Math.max(44, Math.min(56, (viewportWidth - spacing.xl * 2 - MAP_GAP * 6) / 7));
  const columns = Math.max(1, ...stands.map(({ coordinate }) => coordinate.column + 1));
  const rows = Math.max(1, ...stands.map(({ coordinate }) => coordinate.row + 1));
  const mapWidth = columns * cellSize + Math.max(0, columns - 1) * MAP_GAP;
  const mapHeight = rows * cellSize + Math.max(0, rows - 1) * MAP_GAP;
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <Text accessibilityRole="header" style={[styles.title, { color: theme.colors.textPrimary }]}>Feria y selección de mesa</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>{fair.name} · {fair.status === "active" ? "Feria activa" : `Próxima: ${formatEntrepreneurDate(fair.nextDate)}`}</Text>
        </View>
        <Badge label={fair.status === "active" ? "Activa" : "Próxima"} tone={fair.status === "active" ? "success" : "accent"} />
      </View>

      {currentRequest ? (
        <RequestStatusCard request={currentRequest} stand={requestStand} />
      ) : (
        <InlineNotice message="Selecciona una mesa disponible. La solicitud quedará pendiente hasta que el Administrador de Feria la revise." tone="info" />
      )}
      {activeRequest ? <InlineNotice message="Ya existe una solicitud activa para esta feria. No puedes elegir otra mesa ni aprobarla desde este perfil." tone="info" /> : null}

      <View accessibilityLabel="Simbología del mapa" style={styles.legend}>
        <Legend color={theme.colors.success} label="Disponible" />
        <Legend color={theme.colors.warning} label="Solicitada" />
        <Legend color={culturalColors.mayaBlue} label="Asignada" />
      </View>
      {stands.length !== 40 ? <InlineNotice message={`La edición contiene ${stands.length} de 40 stands; el mapa refleja exactamente el estado compartido.`} /> : null}

      <Card style={styles.mapCard}>
        <ScrollView contentContainerStyle={styles.horizontalContent} horizontal showsHorizontalScrollIndicator={false}>
          <View accessibilityLabel={`Mapa de selección con ${stands.length} mesas`} style={{ height: mapHeight, position: "relative", width: mapWidth }}>
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
              <StandChoice
                cellSize={cellSize}
                current={stand.id === activeRequest?.standId}
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
        <Card elevated style={styles.detail}>
          <View style={styles.detailHeader}>
            <View>
              <Text style={[styles.detailEyebrow, { color: theme.colors.textSecondary }]}>Detalle del mapa</Text>
              <Text style={[styles.detailTitle, { color: theme.colors.textPrimary }]}>Mesa {selected.number}</Text>
            </View>
            <Badge label={STATUS_LABEL[selected.status]} tone={selected.status === "available" ? "success" : selected.status === "requested" ? "warning" : "accent"} />
          </View>
          {selected.status === "available" && selectionEnabled ? (
            <Button disabled={requestingStandId !== null} label="Solicitar esta mesa" leading={<Ionicons color={theme.colors.textOnAccent} name="paper-plane-outline" size={19} />} loading={requestingStandId === selected.id} onPress={() => onRequest(selected)} />
          ) : (
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>{selected.status !== "available" ? "Esta mesa no puede solicitarse porque ya tiene una asociación." : "No puedes solicitar otra mesa mientras exista una solicitud activa."}</Text>
          )}
        </Card>
      ) : (
        <InlineNotice message="Toca una mesa para consultar su estado." tone="info" />
      )}
    </View>
  );
}

function RequestStatusCard({ request, stand }: { request: StandRequest; stand?: Stand }) {
  const { theme } = useCalpulliTheme();
  const presentation = REQUEST_PRESENTATION[request.status];
  return (
    <Card elevated style={styles.requestCard}>
      <View style={styles.detailHeader}>
        <View style={styles.requestCopy}>
          <Text style={[styles.detailEyebrow, { color: theme.colors.textSecondary }]}>Estado de solicitud</Text>
          <Text style={[styles.detailTitle, { color: theme.colors.textPrimary }]}>Mesa {stand?.number ?? "—"}</Text>
        </View>
        <Badge label={presentation.label} tone={presentation.tone} />
      </View>
      <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>Enviada {formatEntrepreneurDate(request.requestedAt)}</Text>
      {request.status === "pending" ? <Text style={[styles.body, { color: theme.colors.textPrimary }]}>El Administrador de Feria debe aprobar o rechazar esta solicitud.</Text> : null}
      {request.status === "approved" ? <Text style={[styles.body, { color: theme.colors.textPrimary }]}>Tu emprendimiento está asignado y ya puede aparecer en esta mesa dentro de la app pública.</Text> : null}
      {request.status === "rejected" || request.status === "cancelled" ? <Text style={[styles.body, { color: theme.colors.textPrimary }]}>Puedes seleccionar otra mesa disponible mediante una solicitud nueva.</Text> : null}
      {request.note ? <Text style={[styles.note, { color: theme.colors.textSecondary }]}>Nota: {request.note}</Text> : null}
    </Card>
  );
}

function StandChoice({ cellSize, current, onPress, selected, stand }: { cellSize: number; current: boolean; onPress(): void; selected: boolean; stand: Stand }) {
  const { theme } = useCalpulliTheme();
  const color = stand.status === "available" ? theme.colors.success : stand.status === "requested" ? theme.colors.warning : culturalColors.mayaBlue;
  return (
    <Pressable
      accessibilityLabel={`Mesa ${stand.number}, ${STATUS_LABEL[stand.status]}${current ? ", tu solicitud" : ""}`}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.stand,
        {
          backgroundColor: current || selected ? theme.colors.primaryMuted : theme.colors.surfaceElevated,
          borderColor: current || selected ? theme.colors.primary : color,
          height: cellSize,
          left: stand.coordinate.column * (cellSize + MAP_GAP),
          top: stand.coordinate.row * (cellSize + MAP_GAP),
          width: cellSize,
        },
        pressed && styles.pressed,
      ]}
    >
      <Ionicons color={color} name={current ? "location" : stand.status === "available" ? "add-outline" : stand.status === "requested" ? "time-outline" : "storefront-outline"} size={20} />
      <View style={[styles.numberBadge, { backgroundColor: color }]}>
        <Text style={[styles.number, { color: theme.colors.textOnAccent }]}>{stand.number}</Text>
      </View>
    </Pressable>
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
  header: { alignItems: "flex-start", flexDirection: "row", flexWrap: "wrap", gap: spacing.md, justifyContent: "space-between" },
  headerCopy: { flex: 1, gap: spacing.xs, minWidth: 230 },
  title: { ...typography.title },
  subtitle: { ...typography.body },
  body: { ...typography.body },
  note: { ...typography.caption },
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
  requestCard: { gap: spacing.md },
  detailHeader: { alignItems: "flex-start", flexDirection: "row", flexWrap: "wrap", gap: spacing.md, justifyContent: "space-between" },
  requestCopy: { flex: 1, minWidth: 180 },
  detailEyebrow: { ...typography.caption },
  detailTitle: { ...typography.heading },
});
