import type {
  Entrepreneur,
  Fair,
  Stand,
  StandRequest,
} from "@calpulli/domain";
import {
  Badge,
  Button,
  Card,
  radii,
  spacing,
  typography,
  useCalpulliTheme,
} from "@calpulli/ui";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { EntrepreneurAvatar } from "./entrepreneur-avatar";
import {
  formatEntrepreneurDate,
  type EntrepreneurMetrics,
} from "./entrepreneur-models";
import {
  REQUEST_PRESENTATION,
  getEntrepreneurAccent,
} from "./entrepreneur-presentation";

export type EntrepreneurDashboardAction = "fair" | "posts" | "products" | "profile";

export function EntrepreneurDashboard({
  entrepreneur,
  fair,
  metrics,
  onAction,
  onChangeEntrepreneur,
  request,
  requestStand,
}: {
  entrepreneur: Entrepreneur;
  fair?: Fair;
  metrics: EntrepreneurMetrics;
  onAction(action: EntrepreneurDashboardAction): void;
  onChangeEntrepreneur(): void;
  request?: StandRequest;
  requestStand?: Stand;
}) {
  const { theme } = useCalpulliTheme();
  const accent = getEntrepreneurAccent(entrepreneur);
  const requestPresentation = request ? REQUEST_PRESENTATION[request.status] : undefined;

  return (
    <View style={styles.container}>
      <Card elevated style={[styles.hero, { borderTopColor: accent }]}>
        <View style={styles.heroHeader}>
          <EntrepreneurAvatar entrepreneur={entrepreneur} size={76} />
          <Badge label="Emprendimiento demo" tone="accent" />
        </View>
        <View style={styles.heroCopy}>
          <Text style={[styles.eyebrow, { color: accent }]}>{entrepreneur.category}</Text>
          <Text accessibilityRole="header" style={[styles.title, { color: theme.colors.textPrimary }]}>{entrepreneur.displayName}</Text>
          <Text style={[styles.body, { color: theme.colors.textSecondary }]}>{entrepreneur.description}</Text>
        </View>
        <View style={styles.heroActions}>
          <Button label="Editar perfil" onPress={() => onAction("profile")} variant="secondary" />
          <Button label="Cambiar emprendimiento" onPress={onChangeEntrepreneur} variant="ghost" />
        </View>
      </Card>

      <View style={styles.metrics}>
        <Metric icon="newspaper-outline" label="Publicaciones" value={metrics.posts} />
        <Metric icon="cube-outline" label="Productos" value={metrics.products} />
        <Metric icon="eye-outline" label="Productos activos" value={metrics.activeProducts} />
      </View>

      <Card style={styles.fairStatus}>
        <View style={styles.statusHeader}>
          <View style={[styles.statusIcon, { backgroundColor: theme.colors.primaryMuted }]}>
            <Ionicons color={theme.colors.primary} name="storefront-outline" size={24} />
          </View>
          <View style={styles.statusCopy}>
            <Text style={[styles.statusTitle, { color: theme.colors.textPrimary }]}>Estado de solicitud</Text>
            <Text style={[styles.statusDescription, { color: theme.colors.textSecondary }]}>
              {fair ? `${fair.name} · ${fair.status === "active" ? "Feria activa" : formatEntrepreneurDate(fair.nextDate)}` : "No hay una edición administrable."}
            </Text>
          </View>
          {requestPresentation ? <Badge label={requestPresentation.label} tone={requestPresentation.tone} /> : <Badge label="Sin solicitud" tone="neutral" />}
        </View>
        {request ? (
          <Text style={[styles.body, { color: theme.colors.textSecondary }]}>Mesa {requestStand?.number ?? "—"} · solicitada {formatEntrepreneurDate(request.requestedAt)}</Text>
        ) : (
          <Text style={[styles.body, { color: theme.colors.textSecondary }]}>Explora el mapa y elige únicamente una mesa disponible.</Text>
        )}
        <Button label={request?.status === "approved" ? "Ver ubicación" : "Abrir Feria"} onPress={() => onAction("fair")} variant="secondary" />
      </Card>

      <View style={styles.section}>
        <Text style={[styles.heading, { color: theme.colors.textPrimary }]}>Mi escaparate</Text>
        <View style={styles.actions}>
          <ActionCard description="Avatar, galería, descripción y contactos externos." icon="person-circle-outline" label="Mi perfil" onPress={() => onAction("profile")} />
          <ActionCard description="Contenido propio visible en perfil y Marketplace." icon="newspaper-outline" label="Mis publicaciones" onPress={() => onAction("posts")} />
          <ActionCard description="Catálogo demo, precios textuales y visibilidad." icon="cube-outline" label="Mis productos" onPress={() => onAction("products")} />
          <ActionCard description="Mapa, selección de mesa y seguimiento." icon="map-outline" label="Feria" onPress={() => onAction("fair")} />
        </View>
      </View>
    </View>
  );
}

function Metric({ icon, label, value }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: number }) {
  const { theme } = useCalpulliTheme();
  return (
    <Card style={styles.metricCard}>
      <Ionicons color={theme.colors.primary} name={icon} size={22} />
      <Text style={[styles.metricValue, { color: theme.colors.textPrimary }]}>{value.toLocaleString("es-MX")}</Text>
      <Text style={[styles.metricLabel, { color: theme.colors.textSecondary }]}>{label}</Text>
    </Card>
  );
}

function ActionCard({ description, icon, label, onPress }: { description: string; icon: keyof typeof Ionicons.glyphMap; label: string; onPress(): void }) {
  const { theme } = useCalpulliTheme();
  return (
    <Pressable accessibilityLabel={label} accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.actionPressable, pressed && styles.pressed]}>
      <Card style={styles.actionCard}>
        <View style={[styles.actionIcon, { backgroundColor: theme.colors.primaryMuted }]}>
          <Ionicons color={theme.colors.primary} name={icon} size={25} />
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
  heroHeader: { alignItems: "center", flexDirection: "row", justifyContent: "space-between" },
  heroCopy: { gap: spacing.sm },
  eyebrow: { ...typography.caption, fontWeight: "800", letterSpacing: 0.8, textTransform: "uppercase" },
  title: { ...typography.display },
  body: { ...typography.body },
  heroActions: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  metrics: { flexDirection: "row", flexWrap: "wrap", gap: spacing.md },
  metricCard: { flexBasis: 150, flexGrow: 1, gap: spacing.xs, minHeight: 132 },
  metricValue: { ...typography.title },
  metricLabel: { ...typography.caption },
  fairStatus: { gap: spacing.lg },
  statusHeader: { alignItems: "center", flexDirection: "row", flexWrap: "wrap", gap: spacing.md },
  statusIcon: { alignItems: "center", borderRadius: radii.sm, height: 48, justifyContent: "center", width: 48 },
  statusCopy: { flex: 1, gap: spacing.xs, minWidth: 190 },
  statusTitle: { ...typography.heading },
  statusDescription: { ...typography.caption },
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
