import {
  Badge,
  Card,
  spacing,
  typography,
  useCalpulliTheme,
} from "@calpulli/ui";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { EntrepreneurAvatar, getEntrepreneurAccent } from "../entrepreneurs/entrepreneur-avatar";
import type { MarketplaceEntry } from "./marketplace-selection";
import { MarketplaceMedia } from "./marketplace-media";

export function MarketplaceCard({
  entry,
  onPress,
}: {
  entry: MarketplaceEntry;
  onPress(): void;
}) {
  const { theme } = useCalpulliTheme();
  const accent = getEntrepreneurAccent(entry.entrepreneur);

  return (
    <Pressable
      accessibilityHint="Abre el detalle"
      accessibilityLabel={`${entry.kind === "product" ? "Producto" : "Publicación"}: ${entry.title}, de ${entry.entrepreneur.displayName}`}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => pressed && styles.pressed}
    >
      <Card elevated style={[styles.card, { borderLeftColor: accent }]}>
        {entry.media.length > 0 ? (
          <MarketplaceMedia accent={accent} compact media={entry.media} title={entry.title} />
        ) : null}
        <View style={styles.badges}>
          <Badge label={entry.kind === "product" ? "Producto" : "Novedad"} tone={entry.kind === "product" ? "success" : "accent"} />
          <Badge label={entry.category} />
        </View>
        <View style={styles.copy}>
          <View style={styles.titleRow}>
            <Text style={[styles.title, { color: theme.colors.textPrimary }]}>{entry.title}</Text>
            {entry.kind === "product" && entry.priceLabel ? <Text style={[styles.price, { color: theme.colors.success }]}>{entry.priceLabel}</Text> : null}
          </View>
          {entry.description ? <Text numberOfLines={3} style={[styles.body, { color: theme.colors.textSecondary }]}>{entry.description}</Text> : null}
        </View>
        <View style={[styles.footer, { borderTopColor: theme.colors.borderSubtle }]}>
          <EntrepreneurAvatar entrepreneur={entry.entrepreneur} size={40} />
          <View style={styles.ownerCopy}>
            <Text style={[styles.owner, { color: theme.colors.textPrimary }]}>{entry.entrepreneur.displayName}</Text>
            <Text style={[styles.caption, { color: theme.colors.textSecondary }]}>Ver detalle</Text>
          </View>
          <Ionicons color={theme.colors.primary} name="chevron-forward" size={21} />
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderLeftWidth: 4,
    gap: spacing.lg,
  },
  badges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  copy: {
    gap: spacing.sm,
  },
  titleRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.md,
  },
  title: {
    ...typography.heading,
    flex: 1,
  },
  price: {
    ...typography.label,
    maxWidth: 112,
    textAlign: "right",
  },
  body: {
    ...typography.body,
  },
  footer: {
    alignItems: "center",
    borderTopWidth: 1,
    flexDirection: "row",
    gap: spacing.md,
    paddingTop: spacing.md,
  },
  ownerCopy: {
    flex: 1,
  },
  owner: {
    ...typography.label,
  },
  caption: {
    ...typography.caption,
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.995 }],
  },
});
