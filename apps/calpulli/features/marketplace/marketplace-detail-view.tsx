import {
  Badge,
  Button,
  Card,
  spacing,
  typography,
  useCalpulliTheme,
} from "@calpulli/ui";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, View } from "react-native";

import { ExternalContactList } from "../contact/external-contact-list";
import { EntrepreneurAvatar, getEntrepreneurAccent } from "../entrepreneurs/entrepreneur-avatar";
import type { MarketplaceEntry } from "./marketplace-selection";
import { MarketplaceMedia } from "./marketplace-media";

export function MarketplaceDetailView({
  entry,
  onViewEntrepreneur,
}: {
  entry: MarketplaceEntry;
  onViewEntrepreneur(): void;
}) {
  const { theme } = useCalpulliTheme();
  const accent = getEntrepreneurAccent(entry.entrepreneur);

  return (
    <View style={styles.container}>
      {entry.media.length > 0 ? <MarketplaceMedia accent={accent} media={entry.media} title={entry.title} /> : null}
      <View style={styles.badges}>
        <Badge label={entry.kind === "product" ? "Producto" : "Publicación"} tone={entry.kind === "product" ? "success" : "accent"} />
        <Badge label={entry.category} />
      </View>
      <View style={styles.copy}>
        <View style={styles.titleRow}>
          <Text accessibilityRole="header" style={[styles.title, { color: theme.colors.textPrimary }]}>{entry.title}</Text>
          {entry.kind === "product" && entry.priceLabel ? <Badge label={entry.priceLabel} tone="success" /> : null}
        </View>
        {entry.description ? <Text style={[styles.body, { color: theme.colors.textSecondary }]}>{entry.description}</Text> : null}
      </View>

      <Card elevated style={styles.ownerCard}>
        <EntrepreneurAvatar entrepreneur={entry.entrepreneur} size={64} />
        <View style={styles.ownerCopy}>
          <Text style={[styles.owner, { color: theme.colors.textPrimary }]}>{entry.entrepreneur.displayName}</Text>
          <Text style={[styles.caption, { color: theme.colors.textSecondary }]}>{entry.entrepreneur.category}</Text>
        </View>
        <Ionicons color={theme.colors.primary} name="storefront-outline" size={25} />
      </Card>
      <Button
        label="Ver emprendimiento"
        leading={<Ionicons color={theme.colors.textOnAccent} name="arrow-forward" size={19} />}
        onPress={onViewEntrepreneur}
      />

      {entry.entrepreneur.externalContacts.length > 0 ? (
        <View style={styles.section}>
          <Text style={[styles.heading, { color: theme.colors.textPrimary }]}>Contacto externo</Text>
          <Text style={[styles.body, { color: theme.colors.textSecondary }]}>El contacto y cualquier acuerdo se realizan fuera de UPIICSA Calpulli.</Text>
          <ExternalContactList contacts={entry.entrepreneur.externalContacts} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xxl,
  },
  badges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  copy: {
    gap: spacing.md,
  },
  titleRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  title: {
    ...typography.title,
    flex: 1,
    minWidth: 210,
  },
  body: {
    ...typography.body,
  },
  ownerCard: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md,
  },
  ownerCopy: {
    flex: 1,
  },
  owner: {
    ...typography.heading,
  },
  caption: {
    ...typography.caption,
  },
  section: {
    gap: spacing.md,
  },
  heading: {
    ...typography.heading,
  },
});
