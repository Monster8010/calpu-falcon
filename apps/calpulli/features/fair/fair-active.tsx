import type { Entrepreneur, ID, Stand } from "@calpulli/domain";
import {
  Badge,
  Card,
  culturalColors,
  spacing,
  typography,
  useCalpulliTheme,
} from "@calpulli/ui";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, View } from "react-native";

import { StandMap } from "./stand-map";

export function FairActive({
  entrepreneursById,
  fairName,
  onSelectStand,
  stands,
}: {
  entrepreneursById: ReadonlyMap<ID, Entrepreneur>;
  fairName: string;
  onSelectStand(stand: Stand): void;
  stands: readonly Stand[];
}) {
  const { theme } = useCalpulliTheme();
  const available = stands.filter(({ status }) => status === "available").length;
  const assigned = stands.filter(({ status }) => status === "assigned").length;

  return (
    <View style={styles.container}>
      <Card elevated style={styles.hero}>
        <View style={styles.heroHeader}>
          <Badge label="Feria activa" tone="success" />
          <View style={styles.sparkles}>
            <View style={[styles.sparkle, { backgroundColor: culturalColors.cempasuchil }]} />
            <View style={[styles.sparkle, { backgroundColor: culturalColors.mexicanPink }]} />
            <View style={[styles.sparkle, { backgroundColor: culturalColors.mayaBlue }]} />
          </View>
        </View>
        <View style={styles.copy}>
          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>{fairName}</Text>
          <Text style={[styles.body, { color: theme.colors.textSecondary }]}>Recorre la plaza, toca una mesa y descubre a quienes forman esta edición.</Text>
        </View>
        <View style={styles.stats}>
          <Stat icon="grid-outline" label="Mesas" value={stands.length} />
          <Stat icon="checkmark-circle-outline" label="Disponibles" value={available} />
          <Stat icon="storefront-outline" label="Emprendimientos" value={assigned} />
        </View>
      </Card>

      <StandMap
        entrepreneursById={entrepreneursById}
        onSelect={onSelectStand}
        stands={stands}
      />
    </View>
  );
}

function Stat({
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
    <View style={styles.stat}>
      <Ionicons color={theme.colors.primary} name={icon} size={20} />
      <View>
        <Text style={[styles.statValue, { color: theme.colors.textPrimary }]}>{value}</Text>
        <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>{label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xxl,
  },
  hero: {
    gap: spacing.xl,
    overflow: "hidden",
  },
  heroHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sparkles: {
    flexDirection: "row",
    gap: spacing.xs,
  },
  sparkle: {
    height: 8,
    transform: [{ rotate: "45deg" }],
    width: 8,
  },
  copy: {
    gap: spacing.sm,
  },
  title: {
    ...typography.display,
  },
  body: {
    ...typography.body,
  },
  stats: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  stat: {
    alignItems: "center",
    flexBasis: 112,
    flexDirection: "row",
    flexGrow: 1,
    gap: spacing.sm,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "800",
    lineHeight: 21,
  },
  statLabel: {
    ...typography.caption,
  },
});
