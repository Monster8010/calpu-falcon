import type { TutoringOffer } from "@calpulli/domain";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  spacing,
  typography,
  useCalpulliTheme,
} from "@calpulli/ui";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, View } from "react-native";

import { TUTORING_MODE_LABELS } from "./tutor-models";

export function TutoringOfferList({
  deletingId,
  offers,
  onCreate,
  onDelete,
  onEdit,
}: {
  deletingId: string | null;
  offers: readonly TutoringOffer[];
  onCreate(): void;
  onDelete(offer: TutoringOffer): void;
  onEdit(offer: TutoringOffer): void;
}) {
  const { theme } = useCalpulliTheme();
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <Text accessibilityRole="header" style={[styles.title, { color: theme.colors.textPrimary }]}>Mis materias</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>Administra modalidad, disponibilidad y visibilidad de cada oferta.</Text>
        </View>
        <Button label="Añadir materia" leading={<Ionicons color={theme.colors.textOnAccent} name="add-outline" size={19} />} onPress={onCreate} />
      </View>

      {offers.length === 0 ? (
        <EmptyState description="Agrega la primera materia para que el perfil pueda descubrirse." illustration={<Ionicons color={theme.colors.primary} name="book-outline" size={48} />} title="Aún no hay materias" />
      ) : (
        <View style={styles.list}>
          {offers.map((offer) => (
            <Card elevated={offer.isActive} key={offer.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={[styles.icon, { backgroundColor: theme.colors.primaryMuted }]}>
                  <Ionicons color={theme.colors.primary} name="book-outline" size={23} />
                </View>
                <View style={styles.cardCopy}>
                  <Text style={[styles.cardTitle, { color: theme.colors.textPrimary }]}>{offer.subject}</Text>
                  <Text style={[styles.meta, { color: theme.colors.textSecondary }]}>{offer.modes.map((mode) => TUTORING_MODE_LABELS[mode]).join(" · ")}</Text>
                </View>
                <Badge label={offer.isActive ? "Activa" : "Inactiva"} tone={offer.isActive ? "success" : "neutral"} />
              </View>
              {offer.description ? <Text numberOfLines={3} style={[styles.body, { color: theme.colors.textSecondary }]}>{offer.description}</Text> : null}
              <View style={styles.availability}>
                <Ionicons color={theme.colors.success} name="time-outline" size={19} />
                <Text style={[styles.availabilityText, { color: theme.colors.textPrimary }]}>{offer.availabilityLabel ?? "Disponibilidad por acordar"}</Text>
              </View>
              <View style={styles.actions}>
                <Button label="Editar" onPress={() => onEdit(offer)} variant="secondary" />
                <Button disabled={deletingId !== null} label="Eliminar" loading={deletingId === offer.id} onPress={() => onDelete(offer)} variant="ghost" />
              </View>
            </Card>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.xxl },
  header: { alignItems: "flex-start", flexDirection: "row", flexWrap: "wrap", gap: spacing.md, justifyContent: "space-between" },
  headerCopy: { flex: 1, gap: spacing.xs, minWidth: 230 },
  title: { ...typography.title },
  subtitle: { ...typography.body },
  list: { gap: spacing.md },
  card: { gap: spacing.lg },
  cardHeader: { alignItems: "center", flexDirection: "row", flexWrap: "wrap", gap: spacing.md },
  icon: { alignItems: "center", justifyContent: "center", minHeight: 48, minWidth: 48 },
  cardCopy: { flex: 1, gap: spacing.xs, minWidth: 180 },
  cardTitle: { ...typography.heading },
  meta: { ...typography.caption },
  body: { ...typography.body },
  availability: { alignItems: "center", flexDirection: "row", gap: spacing.sm },
  availabilityText: { ...typography.label, flex: 1 },
  actions: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, justifyContent: "flex-end" },
});
