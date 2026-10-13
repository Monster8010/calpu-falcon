import {
  AppHeader,
  Badge,
  Card,
  spacing,
  typography,
  useCalpulliTheme,
} from "@calpulli/ui";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, View } from "react-native";

import { ChoiceGroup } from "../forms/management-form-controls";
import { ModerationContentList } from "./moderation-content-list";
import {
  filterModerationItems,
  MODERATION_FILTER_OPTIONS,
  type ModerationFilter,
  type ModerationListItem,
  type ModerationMetrics,
} from "./moderation-models";

export function ModeratorDashboard({
  filter,
  items,
  metrics,
  mutatingKey,
  onChangeFilter,
  onOpen,
  onSetHidden,
}: {
  filter: ModerationFilter;
  items: readonly ModerationListItem[];
  metrics: ModerationMetrics;
  mutatingKey: string | null;
  onChangeFilter(filter: ModerationFilter): void;
  onOpen(item: ModerationListItem): void;
  onSetHidden(item: ModerationListItem, hidden: boolean): void;
}) {
  const { theme } = useCalpulliTheme();
  const filteredItems = filterModerationItems(items, filter);

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <AppHeader
          eyebrow="Moderación posterior"
          subtitle="Revisa publicaciones institucionales y de emprendimientos. Aquí no hay cola de aprobación previa."
          title="Contenido de la comunidad"
        />
        <Badge label="Sin aprobación previa" tone="accent" />
      </View>

      <View style={styles.metrics}>
        <Metric icon="documents-outline" label="Contenido" value={metrics.total} />
        <Metric icon="eye-outline" label="Públicas" value={metrics.public} />
        <Metric icon="eye-off-outline" label="Ocultas" value={metrics.hidden} />
        <Metric icon="document-outline" label="No publicadas" value={metrics.unpublished} />
        {metrics.ownerInactive > 0 ? (
          <Metric icon="person-remove-outline" label="Propietario inactivo" value={metrics.ownerInactive} />
        ) : null}
      </View>

      <Card style={styles.scopeCard}>
        <Ionicons color={theme.colors.primary} name="layers-outline" size={23} />
        <View style={styles.scopeCopy}>
          <Text style={[styles.scopeTitle, { color: theme.colors.textPrimary }]}>Alcance de esta lista</Text>
          <Text style={[styles.scopeText, { color: theme.colors.textSecondary }]}>
            {metrics.institutionalPosts} institucionales · {metrics.entrepreneurPosts} de emprendimientos. Ocultar es reversible y no elimina datos.
          </Text>
        </View>
      </Card>

      <View style={styles.section}>
        <Text style={[styles.heading, { color: theme.colors.textPrimary }]}>Publicaciones</Text>
        <ChoiceGroup
          label="Filtrar por estado"
          onChange={onChangeFilter}
          options={MODERATION_FILTER_OPTIONS}
          value={filter}
        />
        <Text style={[styles.resultCount, { color: theme.colors.textSecondary }]}>
          {filteredItems.length === 1 ? "1 resultado" : `${filteredItems.length} resultados`}
        </Text>
        <ModerationContentList
          items={filteredItems}
          mutatingKey={mutatingKey}
          onOpen={onOpen}
          onSetHidden={onSetHidden}
        />
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
  value: number;
}) {
  const { theme } = useCalpulliTheme();
  return (
    <Card style={styles.metricCard}>
      <Ionicons color={theme.colors.primary} name={icon} size={22} />
      <Text style={[styles.metricValue, { color: theme.colors.textPrimary }]}>{value.toLocaleString("es-MX")}</Text>
      <Text style={[styles.metricLabel, { color: theme.colors.textSecondary }]}>{label}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.xxl },
  hero: { gap: spacing.md },
  metrics: { flexDirection: "row", flexWrap: "wrap", gap: spacing.md },
  metricCard: { flexBasis: 138, flexGrow: 1, gap: spacing.xs, minHeight: 122 },
  metricValue: { ...typography.title },
  metricLabel: { ...typography.caption },
  scopeCard: { alignItems: "flex-start", flexDirection: "row", gap: spacing.md },
  scopeCopy: { flex: 1, gap: spacing.xs },
  scopeTitle: { ...typography.label },
  scopeText: { ...typography.caption },
  section: { gap: spacing.lg },
  heading: { ...typography.heading },
  resultCount: { ...typography.caption },
});
