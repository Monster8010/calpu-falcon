import type { Department } from "@calpulli/domain";
import type { DepartmentMetrics } from "../../services/department-management";
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

import {
  getDepartmentAccent,
  getDepartmentMonogram,
} from "./department-presentation";

export type DepartmentDashboardAction = "new-post" | "posts" | "new-story" | "profile" | "stories";

export function DepartmentDashboard({
  department,
  metrics,
  onAction,
  onChangeDepartment,
}: {
  department: Department;
  metrics: DepartmentMetrics;
  onAction(action: DepartmentDashboardAction): void;
  onChangeDepartment(): void;
}) {
  const { theme } = useCalpulliTheme();
  const accent = getDepartmentAccent(department);

  return (
    <View style={styles.container}>
      <Card elevated style={[styles.hero, { borderTopColor: accent }]}>
        <View style={styles.heroHeader}>
          <View style={[styles.logo, { backgroundColor: theme.colors.surfaceMuted, borderColor: accent }]}>
            <Text style={[styles.monogram, { color: accent }]}>{getDepartmentMonogram(department)}</Text>
          </View>
          <Badge label="Departamento demo" tone="accent" />
        </View>
        <View style={styles.heroCopy}>
          <Text style={[styles.eyebrow, { color: accent }]}>Dashboard institucional</Text>
          <Text accessibilityRole="header" style={[styles.title, { color: theme.colors.textPrimary }]}>{department.name}</Text>
          <Text style={[styles.body, { color: theme.colors.textSecondary }]}>{department.description ?? "Perfil institucional sin descripción."}</Text>
        </View>
        <View style={styles.heroActions}>
          <Button label="Editar perfil" onPress={() => onAction("profile")} variant="secondary" />
          <Button label="Cambiar departamento" onPress={onChangeDepartment} variant="ghost" />
        </View>
      </Card>

      <View style={styles.metrics}>
        <MetricCard icon="document-text-outline" label="Publicaciones" value={metrics.posts.toLocaleString("es-MX")} />
        <MetricCard icon="eye-outline" label="Visualizaciones" value={metrics.views.toLocaleString("es-MX")} />
        <MetricCard icon="time-outline" label="Historias activas" value={metrics.activeStories.toLocaleString("es-MX")} />
      </View>

      <View style={styles.section}>
        <Text style={[styles.heading, { color: theme.colors.textPrimary }]}>Herramientas</Text>
        <View style={styles.actions}>
          <ActionCard icon="add-circle-outline" label="Crear publicación" onPress={() => onAction("new-post")} />
          <ActionCard icon="newspaper-outline" label="Mis publicaciones" onPress={() => onAction("posts")} />
          <ActionCard icon="add-outline" label="Crear historia" onPress={() => onAction("new-story")} />
          <ActionCard icon="albums-outline" label="Mis historias" onPress={() => onAction("stories")} />
        </View>
      </View>
    </View>
  );
}

function MetricCard({ icon, label, value }: { icon: "document-text-outline" | "eye-outline" | "time-outline"; label: string; value: string }) {
  const { theme } = useCalpulliTheme();
  return (
    <Card style={styles.metricCard}>
      <Ionicons color={theme.colors.primary} name={icon} size={23} />
      <Text style={[styles.metricValue, { color: theme.colors.textPrimary }]}>{value}</Text>
      <Text style={[styles.metricLabel, { color: theme.colors.textSecondary }]}>{label}</Text>
    </Card>
  );
}

function ActionCard({ icon, label, onPress }: { icon: "add-circle-outline" | "newspaper-outline" | "add-outline" | "albums-outline"; label: string; onPress(): void }) {
  const { theme } = useCalpulliTheme();
  return (
    <Pressable accessibilityLabel={label} accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.actionPressable, pressed && styles.pressed]}>
      <Card style={styles.actionCard}>
        <View style={[styles.actionIcon, { backgroundColor: theme.colors.primaryMuted }]}>
          <Ionicons color={theme.colors.primary} name={icon} size={25} />
        </View>
        <Text style={[styles.actionLabel, { color: theme.colors.textPrimary }]}>{label}</Text>
        <Ionicons color={theme.colors.primary} name="chevron-forward" size={20} />
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.xxl },
  hero: { borderTopWidth: 5, gap: spacing.xl },
  heroHeader: { alignItems: "center", flexDirection: "row", justifyContent: "space-between" },
  logo: { alignItems: "center", borderRadius: radii.md, borderWidth: 1, height: 68, justifyContent: "center", width: 68 },
  monogram: { ...typography.title },
  heroCopy: { gap: spacing.sm },
  eyebrow: { ...typography.caption, fontWeight: "800", letterSpacing: 0.8, textTransform: "uppercase" },
  title: { ...typography.display },
  body: { ...typography.body },
  heroActions: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  metrics: { flexDirection: "row", flexWrap: "wrap", gap: spacing.md },
  metricCard: { flexBasis: 170, flexGrow: 1, gap: spacing.xs, minHeight: 142 },
  metricValue: { ...typography.title },
  metricLabel: { ...typography.caption },
  section: { gap: spacing.lg },
  heading: { ...typography.heading },
  actions: { gap: spacing.md },
  actionPressable: { width: "100%" },
  actionCard: { alignItems: "center", flexDirection: "row", gap: spacing.md },
  actionIcon: { alignItems: "center", borderRadius: radii.sm, height: 46, justifyContent: "center", width: 46 },
  actionLabel: { ...typography.label, flex: 1 },
  pressed: { opacity: 0.66 },
});
