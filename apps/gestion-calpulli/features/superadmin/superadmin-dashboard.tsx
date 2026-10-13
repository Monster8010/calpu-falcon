import type { Fair } from "@calpulli/domain";
import {
  AppHeader,
  Badge,
  Card,
  culturalColors,
  radii,
  spacing,
  typography,
  useCalpulliTheme,
} from "@calpulli/ui";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import type { SuperadminMetrics } from "./superadmin-models";

export type SuperadminDashboardAction =
  | "configuration"
  | "content"
  | "demo-data"
  | "departments"
  | "fair";

function formatFairDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Fecha no disponible";
  return date.toLocaleString("es-MX", {
    dateStyle: "long",
    timeStyle: "short",
  });
}

export function SuperadminDashboard({
  fair,
  metrics,
  onAction,
}: {
  fair?: Fair;
  metrics: SuperadminMetrics;
  onAction(action: SuperadminDashboardAction): void;
}) {
  const { theme } = useCalpulliTheme();

  return (
    <View style={styles.container}>
      <Card elevated style={[styles.hero, { borderTopColor: culturalColors.jade }]}>
        <View style={styles.heroTop}>
          <View style={[styles.heroIcon, { backgroundColor: theme.colors.primaryMuted }]}>
            <Ionicons color={theme.colors.primary} name="settings-outline" size={30} />
          </View>
          <Badge label="Modo demostración" tone="accent" />
        </View>
        <AppHeader
          eyebrow="Gestión UPIICSA Calpulli"
          subtitle="Vista general del estado compartido y accesos administrativos del MVP."
          title="Superadministrador"
        />
        <Text style={[styles.noAuth, { color: theme.colors.textSecondary }]}>
          Este perfil organiza la demostración; no representa autenticación ni permisos RBAC reales.
        </Text>
      </Card>

      <View style={styles.metrics}>
        <Metric icon="business-outline" label="Departamentos activos" value={`${metrics.activeDepartments}/${metrics.departments}`} />
        <Metric icon="document-text-outline" label="Posts publicados" value={String(metrics.publishedPosts)} />
        <Metric icon="storefront-outline" label="Stands asignados" value={String(metrics.assignedStands)} />
        <Metric icon="time-outline" label="Solicitudes pendientes" value={String(metrics.pendingRequests)} />
        <Metric icon="people-outline" label="Emprendedores activos" value={String(metrics.activeEntrepreneurs)} />
        <Metric icon="school-outline" label="Tutores activos" value={String(metrics.activeTutors)} />
      </View>

      <Card style={styles.fairCard}>
        <View style={[styles.fairIcon, { backgroundColor: theme.colors.surfaceMuted }]}>
          <Ionicons color={theme.colors.warning} name="calendar-outline" size={26} />
        </View>
        <View style={styles.fairCopy}>
          <Text style={[styles.fairLabel, { color: theme.colors.textSecondary }]}>Próxima Feria</Text>
          <Text style={[styles.fairTitle, { color: theme.colors.textPrimary }]}>{fair?.name ?? "Sin feria configurada"}</Text>
          <Text style={[styles.fairDate, { color: theme.colors.textSecondary }]}>
            {fair ? formatFairDate(fair.nextDate) : "Configúrala desde Administrador de Feria."}
          </Text>
        </View>
        {fair ? <Badge label={fair.status === "active" ? "Activa" : "Próxima"} tone={fair.status === "active" ? "success" : "warning"} /> : null}
      </Card>

      <View style={styles.section}>
        <Text style={[styles.heading, { color: theme.colors.textPrimary }]}>Áreas administrativas</Text>
        <View style={styles.actions}>
          <ActionCard description="Alta, edición y estado público de las áreas institucionales." icon="business-outline" label="Departamentos" onPress={() => onAction("departments")} />
          <ActionCard description="Identidad compartida, nombres de apps, modo demo y tema predeterminado." icon="options-outline" label="Configuración" onPress={() => onAction("configuration")} />
          <ActionCard description="Abrir fechas, mapa, solicitudes y asignación de mesas." icon="calendar-outline" label="Feria" onPress={() => onAction("fair")} />
          <ActionCard description="Abrir la moderación posterior de publicaciones." icon="shield-checkmark-outline" label="Contenido" onPress={() => onAction("content")} />
          <ActionCard description="Revisión del store, conexión SAF y restauración confirmada del seed." icon="server-outline" label="Datos de demostración" onPress={() => onAction("demo-data")} />
        </View>
      </View>
    </View>
  );
}

function Metric({
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
    <Card style={styles.metricCard}>
      <Ionicons color={theme.colors.primary} name={icon} size={22} />
      <Text style={[styles.metricValue, { color: theme.colors.textPrimary }]}>{value}</Text>
      <Text style={[styles.metricLabel, { color: theme.colors.textSecondary }]}>{label}</Text>
    </Card>
  );
}

function ActionCard({
  description,
  icon,
  label,
  onPress,
}: {
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress(): void;
}) {
  const { theme } = useCalpulliTheme();
  return (
    <Pressable accessibilityLabel={label} accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.actionPressable, pressed && styles.pressed]}>
      <Card style={styles.actionCard}>
        <View style={[styles.actionIcon, { backgroundColor: theme.colors.primaryMuted }]}>
          <Ionicons color={theme.colors.primary} name={icon} size={24} />
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
  hero: { borderTopWidth: 5, gap: spacing.lg },
  heroTop: { alignItems: "center", flexDirection: "row", justifyContent: "space-between" },
  heroIcon: { alignItems: "center", borderRadius: radii.sm, height: 54, justifyContent: "center", width: 54 },
  noAuth: { ...typography.caption },
  metrics: { flexDirection: "row", flexWrap: "wrap", gap: spacing.md },
  metricCard: { flexBasis: 142, flexGrow: 1, gap: spacing.xs, minHeight: 126 },
  metricValue: { ...typography.title },
  metricLabel: { ...typography.caption },
  fairCard: { alignItems: "center", flexDirection: "row", flexWrap: "wrap", gap: spacing.md },
  fairIcon: { alignItems: "center", borderRadius: radii.sm, height: 52, justifyContent: "center", width: 52 },
  fairCopy: { flex: 1, gap: spacing.xs, minWidth: 210 },
  fairLabel: { ...typography.caption },
  fairTitle: { ...typography.heading },
  fairDate: { ...typography.body },
  section: { gap: spacing.lg },
  heading: { ...typography.heading },
  actions: { gap: spacing.md },
  actionPressable: { width: "100%" },
  actionCard: { alignItems: "center", flexDirection: "row", gap: spacing.md },
  actionIcon: { alignItems: "center", borderRadius: radii.sm, height: 48, justifyContent: "center", width: 48 },
  actionCopy: { flex: 1, gap: spacing.xs },
  actionLabel: { ...typography.label },
  actionDescription: { ...typography.caption },
  pressed: { opacity: 0.66 },
});
