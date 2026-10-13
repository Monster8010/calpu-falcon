import type { MediaReference } from "@calpulli/domain";
import {
  culturalColors,
  radii,
  spacing,
  typography,
  useCalpulliTheme,
} from "@calpulli/ui";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, View } from "react-native";

export function MarketplaceMedia({
  accent,
  compact = false,
  media,
  title,
}: {
  accent: string;
  compact?: boolean;
  media: readonly MediaReference[];
  title: string;
}) {
  const { theme } = useCalpulliTheme();
  const countLabel = media.length === 1 ? "1 medio" : `${media.length} medios`;

  return (
    <View
      accessibilityLabel={`Contenido visual de ${title}, ${countLabel}`}
      style={[
        styles.media,
        compact ? styles.compact : styles.detail,
        { backgroundColor: theme.colors.primaryMuted },
      ]}
    >
      <View style={[styles.sun, { backgroundColor: accent }]} />
      <View style={styles.iconCopy}>
        <Ionicons color={theme.colors.primary} name="images-outline" size={compact ? 27 : 40} />
        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>{countLabel}</Text>
      </View>
      <View style={styles.pattern}>
        <View style={[styles.patternLong, { backgroundColor: culturalColors.mexicanPink }]} />
        <View style={[styles.patternMedium, { backgroundColor: culturalColors.cempasuchil }]} />
        <View style={[styles.patternShort, { backgroundColor: accent }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  media: {
    justifyContent: "center",
    overflow: "hidden",
    padding: spacing.lg,
  },
  compact: {
    aspectRatio: 1.9,
    borderRadius: radii.sm,
  },
  detail: {
    aspectRatio: 1.45,
    borderRadius: radii.md,
  },
  sun: {
    borderRadius: radii.pill,
    height: 70,
    opacity: 0.2,
    position: "absolute",
    right: -18,
    top: -18,
    width: 70,
  },
  iconCopy: {
    alignItems: "flex-start",
    gap: spacing.xs,
  },
  label: {
    ...typography.caption,
  },
  pattern: {
    alignItems: "flex-end",
    bottom: spacing.lg,
    gap: spacing.xs,
    position: "absolute",
    right: spacing.lg,
  },
  patternLong: {
    height: 7,
    width: 72,
  },
  patternMedium: {
    height: 7,
    width: 50,
  },
  patternShort: {
    height: 7,
    width: 30,
  },
});
