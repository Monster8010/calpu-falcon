import type { Tutor, TutoringOffer } from "@calpulli/domain";
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

import { ManagementTutorAvatar } from "./tutor-avatar";
import {
  TUTORING_MODE_LABELS,
  type TutorMetrics,
} from "./tutor-models";
import { getManagementTutorAccent } from "./tutor-presentation";

export type TutorDashboardAction = "new-offer" | "offers" | "profile";

export function TutorDashboard({
  metrics,
  offers,
  onAction,
  onChangeTutor,
  tutor,
}: {
  metrics: TutorMetrics;
  offers: readonly TutoringOffer[];
  onAction(action: TutorDashboardAction): void;
  onChangeTutor(): void;
  tutor: Tutor;
}) {
  const { theme } = useCalpulliTheme();
  const accent = getManagementTutorAccent(tutor);
  const subjects = [...new Set(offers.filter(({ isActive }) => isActive).map(({ subject }) => subject))];

  return (
    <View style={styles.container}>
      <Card elevated style={[styles.hero, { borderTopColor: accent }]}>
        <View style={styles.heroHeader}>
          <ManagementTutorAvatar size={78} tutor={tutor} />
          <Badge label="Tutor demo" tone="accent" />
        </View>
        <View style={styles.heroCopy}>
          <Text style={[styles.eyebrow, { color: accent }]}>Tutoría entre comunidad</Text>
          <Text accessibilityRole="header" style={[styles.title, { color: theme.colors.textPrimary }]}>{tutor.displayName}</Text>
          <Text style={[styles.body, { color: theme.colors.textSecondary }]}>{tutor.description}</Text>
          <View style={styles.badges}>
            {tutor.modes.map((mode) => <Badge key={mode} label={TUTORING_MODE_LABELS[mode]} tone="accent" />)}
          </View>
        </View>
        <View style={styles.heroActions}>
          <Button label="Editar perfil" onPress={() => onAction("profile")} variant="secondary" />
          <Button label="Cambiar tutor" onPress={onChangeTutor} variant="ghost" />
        </View>
      </Card>

      <View style={styles.metrics}>
        <Metric icon="book-outline" label="Materias" value={metrics.offers} />
        <Metric icon="eye-outline" label="Materias activas" value={metrics.activeOffers} />
        <Metric icon="chatbubble-ellipses-outline" label="Contactos externos" value={metrics.contacts} />
      </View>

      <Card style={styles.subjectCard}>
        <View style={styles.subjectHeader}>
          <View style={[styles.subjectIcon, { backgroundColor: theme.colors.primaryMuted }]}>
            <Ionicons color={theme.colors.primary} name="school-outline" size={24} />
          </View>
          <View style={styles.subjectCopy}>
            <Text style={[styles.subjectTitle, { color: theme.colors.textPrimary }]}>Materias públicas</Text>
            <Text style={[styles.subjectText, { color: theme.colors.textSecondary }]}>{subjects.length > 0 ? subjects.slice(0, 5).join(" · ") : "No hay materias activas."}</Text>
          </View>
        </View>
        <InlineExternalNotice />
      </Card>

      <View style={styles.section}>
        <Text style={[styles.heading, { color: theme.colors.textPrimary }]}>Herramientas</Text>
        <View style={styles.actions}>
          <ActionCard description="Nombre, descripción, avatar, modalidades y contactos." icon="person-circle-outline" label="Mi perfil" onPress={() => onAction("profile")} />
          <ActionCard description="Crear una materia con modalidad y disponibilidad." icon="add-circle-outline" label="Añadir materia" onPress={() => onAction("new-offer")} />
          <ActionCard description="Editar, activar, desactivar o eliminar ofertas." icon="library-outline" label="Mis materias" onPress={() => onAction("offers")} />
        </View>
      </View>
    </View>
  );
}

function InlineExternalNotice() {
  const { theme } = useCalpulliTheme();
  return (
    <View style={[styles.externalNotice, { borderTopColor: theme.colors.borderSubtle }]}>
      <Ionicons color={theme.colors.primary} name="open-outline" size={18} />
      <Text style={[styles.externalText, { color: theme.colors.textSecondary }]}>El contacto continúa fuera de Calpulli; no existe chat interno.</Text>
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
  badges: { flexDirection: "row", flexWrap: "wrap", gap: spacing.xs },
  heroActions: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  metrics: { flexDirection: "row", flexWrap: "wrap", gap: spacing.md },
  metricCard: { flexBasis: 150, flexGrow: 1, gap: spacing.xs, minHeight: 132 },
  metricValue: { ...typography.title },
  metricLabel: { ...typography.caption },
  subjectCard: { gap: spacing.lg },
  subjectHeader: { alignItems: "center", flexDirection: "row", gap: spacing.md },
  subjectIcon: { alignItems: "center", borderRadius: radii.sm, height: 50, justifyContent: "center", width: 50 },
  subjectCopy: { flex: 1, gap: spacing.xs },
  subjectTitle: { ...typography.heading },
  subjectText: { ...typography.body },
  externalNotice: { alignItems: "center", borderTopWidth: 1, flexDirection: "row", gap: spacing.sm, paddingTop: spacing.md },
  externalText: { ...typography.caption, flex: 1 },
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
