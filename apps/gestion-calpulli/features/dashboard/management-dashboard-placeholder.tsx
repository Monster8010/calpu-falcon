import {
  Badge,
  CalpulliMark,
  Card,
  culturalColors,
  radii,
  spacing,
  typography,
  useCalpulliTheme,
} from "@calpulli/ui";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, View } from "react-native";

import type { DemoRoleDefinition } from "../roles/role-definitions";

export function ManagementDashboardPlaceholder({
  definition,
}: {
  definition: DemoRoleDefinition;
}) {
  const { theme } = useCalpulliTheme();
  const accent = culturalColors[definition.accent];

  return (
    <View style={styles.container}>
      <Card elevated style={[styles.hero, { borderTopColor: accent }]}>
        <View style={styles.heroTop}>
          <CalpulliMark size={52} />
          <Badge label="Dashboard preparado" tone="success" />
        </View>
        <View style={styles.heroCopy}>
          <Text style={[styles.eyebrow, { color: accent }]}>Gestión UPIICSA Calpulli</Text>
          <Text accessibilityRole="header" style={[styles.title, { color: theme.colors.textPrimary }]}>{definition.label}</Text>
          <Text style={[styles.body, { color: theme.colors.textSecondary }]}>{definition.summary}</Text>
        </View>
        <View style={[styles.demoNotice, { backgroundColor: theme.colors.primaryMuted }]}>
          <Ionicons color={theme.colors.primary} name="information-circle-outline" size={22} />
          <Text style={[styles.noticeText, { color: theme.colors.textPrimary }]}>Esta es una vista de demostración sin autenticación. Sus herramientas se implementarán en la etapa funcional correspondiente.</Text>
        </View>
      </Card>

      <View style={styles.section}>
        <View style={styles.sectionHeading}>
          <Text style={[styles.heading, { color: theme.colors.textPrimary }]}>Áreas del perfil</Text>
          <Text style={[styles.caption, { color: theme.colors.textSecondary }]}>Vista previa</Text>
        </View>
        <View style={styles.areaGrid}>
          {definition.areas.map((area) => (
            <Card key={area.title} style={styles.areaCard}>
              <View style={[styles.areaIcon, { backgroundColor: theme.colors.surfaceMuted, borderColor: accent }]}>
                <Ionicons color={accent} name={area.icon} size={24} />
              </View>
              <View style={styles.areaCopy}>
                <Text style={[styles.areaTitle, { color: theme.colors.textPrimary }]}>{area.title}</Text>
                <Text style={[styles.areaDescription, { color: theme.colors.textSecondary }]}>{area.description}</Text>
              </View>
              <Badge label="Próximamente" />
            </Card>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xxl,
  },
  hero: {
    borderTopWidth: 5,
    gap: spacing.xl,
  },
  heroTop: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  heroCopy: {
    gap: spacing.sm,
  },
  eyebrow: {
    ...typography.caption,
    fontWeight: "800",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  title: {
    ...typography.display,
  },
  body: {
    ...typography.body,
  },
  demoNotice: {
    alignItems: "center",
    borderRadius: radii.sm,
    flexDirection: "row",
    gap: spacing.md,
    padding: spacing.lg,
  },
  noticeText: {
    ...typography.label,
    flex: 1,
  },
  section: {
    gap: spacing.lg,
  },
  sectionHeading: {
    alignItems: "flex-end",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  heading: {
    ...typography.heading,
  },
  caption: {
    ...typography.caption,
  },
  areaGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  areaCard: {
    flexBasis: 210,
    flexGrow: 1,
    gap: spacing.md,
    minHeight: 205,
  },
  areaIcon: {
    alignItems: "center",
    borderRadius: radii.sm,
    borderWidth: 1,
    height: 48,
    justifyContent: "center",
    width: 48,
  },
  areaCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  areaTitle: {
    ...typography.heading,
  },
  areaDescription: {
    ...typography.body,
  },
});
