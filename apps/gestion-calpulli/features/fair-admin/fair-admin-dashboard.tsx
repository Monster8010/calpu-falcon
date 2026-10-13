import type { Fair } from "@calpulli/domain";
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
import { Pressable, StyleSheet, Text, View } from "react-native";

import type { FairAdminSummary } from "./fair-admin-models";
import { formatFairDate } from "./fair-admin-models";

export type FairAdminDashboardAction = "date" | "map" | "requests";

export function FairAdminDashboard({
  busy,
  fair,
  onActivate,
  onAction,
  onFinish,
  summary,
}: {
  busy: boolean;
  fair: Fair;
  onActivate(): void;
  onAction(action: FairAdminDashboardAction): void;
  onFinish(): void;
  summary: FairAdminSummary;
}) {
  const { theme } = useCalpulliTheme();
  const active = fair.status === "active";

  return (
    <View style={styles.container}>
      <Card elevated style={[styles.hero, { borderTopColor: active ? theme.colors.success : culturalColors.cempasuchil }]}>
        <View style={styles.heroTop}>
          <View style={[styles.iconWell, { backgroundColor: theme.colors.primaryMuted }]}>
            <Ionicons color={theme.colors.primary} name={active ? "storefront-outline" : "calendar-outline"} size={30} />
          </View>
          <Badge label={active ? "Feria activa" : "Próxima feria"} tone={active ? "success" : "accent"} />
        </View>
        <View style={styles.heroCopy}>
          <Text style={[styles.eyebrow, { color: theme.colors.primary }]}>Administración de Feria</Text>
          <Text accessibilityRole="header" style={[styles.title, { color: theme.colors.textPrimary }]}>{fair.name}</Text>
          <Text style={[styles.date, { color: theme.colors.textSecondary }]}>{active ? "Fecha configurada: " : "Próxima fecha: "}{formatFairDate(fair.nextDate)}</Text>
        </View>
        <View style={styles.heroActions}>
          {active ? (
            <Button label="Finalizar feria" leading={<Ionicons color={theme.colors.textOnAccent} name="flag-outline" size={19} />} loading={busy} onPress={onFinish} />
          ) : (
            <Button label="Activar feria" leading={<Ionicons color={theme.colors.textOnAccent} name="play-outline" size={19} />} loading={busy} onPress={onActivate} />
          )}
          <Button disabled={busy} label="Cambiar fecha" onPress={() => onAction("date")} variant="secondary" />
        </View>
      </Card>

      <View style={styles.metrics}>
        <Metric icon="grid-outline" label="Stands" value={summary.stands} />
        <Metric icon="checkmark-circle-outline" label="Disponibles" value={summary.available} />
        <Metric icon="time-outline" label="Solicitados" value={summary.requested} />
        <Metric icon="storefront-outline" label="Asignados" value={summary.assigned} />
        <Metric icon="clipboard-outline" label="Pendientes" value={summary.pendingRequests} />
      </View>

      <View style={styles.section}>
        <Text style={[styles.heading, { color: theme.colors.textPrimary }]}>Herramientas de la edición</Text>
        <View style={styles.actions}>
          <ActionCard description="Geometría, estado, emprendimiento y acciones por mesa." disabled={busy} icon="map-outline" label="Ver mapa administrativo" onPress={() => onAction("map")} />
          <ActionCard description={`${summary.pendingRequests} solicitudes pendientes de revisión.`} disabled={busy} icon="clipboard-outline" label="Ver solicitudes" onPress={() => onAction("requests")} />
        </View>
      </View>
    </View>
  );
}

function Metric({ icon, label, value }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: number }) {
  const { theme } = useCalpulliTheme();
  return (
    <Card style={styles.metricCard}>
      <Ionicons color={theme.colors.primary} name={icon} size={21} />
      <Text style={[styles.metricValue, { color: theme.colors.textPrimary }]}>{value.toLocaleString("es-MX")}</Text>
      <Text style={[styles.metricLabel, { color: theme.colors.textSecondary }]}>{label}</Text>
    </Card>
  );
}

function ActionCard({ description, disabled, icon, label, onPress }: { description: string; disabled: boolean; icon: keyof typeof Ionicons.glyphMap; label: string; onPress(): void }) {
  const { theme } = useCalpulliTheme();
  return (
    <Pressable accessibilityLabel={label} accessibilityRole="button" accessibilityState={{ disabled }} disabled={disabled} onPress={onPress} style={({ pressed }) => [styles.actionPressable, pressed && styles.pressed, disabled && styles.disabled]}>
      <Card style={styles.actionCard}>
        <View style={[styles.actionIcon, { backgroundColor: theme.colors.primaryMuted }]}>
          <Ionicons color={theme.colors.primary} name={icon} size={26} />
        </View>
        <View style={styles.actionCopy}>
          <Text style={[styles.actionLabel, { color: theme.colors.textPrimary }]}>{label}</Text>
          <Text style={[styles.actionDescription, { color: theme.colors.textSecondary }]}>{description}</Text>
        </View>
        <Ionicons color={theme.colors.primary} name="chevron-forward" size={20} />
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.xxl },
  hero: { borderTopWidth: 5, gap: spacing.xl },
  heroTop: { alignItems: "center", flexDirection: "row", justifyContent: "space-between" },
  iconWell: { alignItems: "center", borderRadius: radii.md, height: 58, justifyContent: "center", width: 58 },
  heroCopy: { gap: spacing.sm },
  eyebrow: { ...typography.caption, fontWeight: "800", letterSpacing: 0.8, textTransform: "uppercase" },
  title: { ...typography.display },
  date: { ...typography.body, textTransform: "capitalize" },
  heroActions: { flexDirection: "row", flexWrap: "wrap", gap: spacing.md },
  metrics: { flexDirection: "row", flexWrap: "wrap", gap: spacing.md },
  metricCard: { flexBasis: 130, flexGrow: 1, gap: spacing.xs, minHeight: 130 },
  metricValue: { ...typography.title },
  metricLabel: { ...typography.caption },
  section: { gap: spacing.lg },
  heading: { ...typography.heading },
  actions: { gap: spacing.md },
  actionPressable: { width: "100%" },
  actionCard: { alignItems: "center", flexDirection: "row", gap: spacing.md },
  actionIcon: { alignItems: "center", borderRadius: radii.sm, height: 50, justifyContent: "center", width: 50 },
  actionCopy: { flex: 1, gap: spacing.xs },
  actionLabel: { ...typography.label },
  actionDescription: { ...typography.caption },
  pressed: { opacity: 0.66 },
  disabled: { opacity: 0.48 },
});
