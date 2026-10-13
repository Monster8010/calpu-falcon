import type { TutoringOffer } from "@calpulli/domain";
import {
  Badge,
  Card,
  radii,
  spacing,
  typography,
  useCalpulliTheme,
} from "@calpulli/ui";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, View } from "react-native";

import { ExternalContactList } from "../contact/external-contact-list";
import type { PublicTutorProfile } from "./tutoring-selection";
import { TUTORING_MODE_LABELS } from "./tutoring-selection";
import { getTutorAccent, TutorAvatar } from "./tutor-avatar";

export function TutorProfileView({ profile }: { profile: PublicTutorProfile }) {
  const { theme } = useCalpulliTheme();
  const accent = getTutorAccent(profile.tutor);

  return (
    <View style={styles.container}>
      <Card elevated style={[styles.hero, { borderTopColor: accent }]}>
        <View style={styles.identity}>
          <TutorAvatar tutor={profile.tutor} size={92} />
          <View style={styles.identityCopy}>
            <Text accessibilityRole="header" style={[styles.title, { color: theme.colors.textPrimary }]}>{profile.tutor.displayName}</Text>
            <View style={styles.badges}>
              {profile.modes.map((mode) => <Badge key={mode} label={TUTORING_MODE_LABELS[mode]} tone="accent" />)}
            </View>
          </View>
        </View>
        <Text style={[styles.body, { color: theme.colors.textSecondary }]}>{profile.tutor.description}</Text>
      </Card>

      <View accessibilityRole="alert" style={[styles.notice, { backgroundColor: theme.colors.primaryMuted }]}>
        <Ionicons color={theme.colors.primary} name="information-circle-outline" size={24} />
        <Text style={[styles.noticeText, { color: theme.colors.textPrimary }]}>El contacto y acuerdo de tutoría se realiza fuera de UPIICSA Calpulli.</Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.heading, { color: theme.colors.textPrimary }]}>Materias y disponibilidad</Text>
        <View style={styles.offerList}>
          {profile.offers.length > 0 ? (
            profile.offers.map((offer) => <OfferCard key={offer.id} offer={offer} />)
          ) : (
            <Card style={styles.emptyOffers}>
              <Ionicons color={theme.colors.primary} name="book-outline" size={26} />
              <Text style={[styles.body, { color: theme.colors.textSecondary }]}>Las materias públicas están por confirmarse.</Text>
            </Card>
          )}
        </View>
      </View>

      {profile.tutor.externalContacts.length > 0 ? (
        <View style={styles.section}>
          <Text style={[styles.heading, { color: theme.colors.textPrimary }]}>Contactar externamente</Text>
          <ExternalContactList contacts={profile.tutor.externalContacts} />
        </View>
      ) : null}
    </View>
  );
}

function OfferCard({ offer }: { offer: TutoringOffer }) {
  const { theme } = useCalpulliTheme();

  return (
    <Card style={styles.offerCard}>
      <View style={styles.offerHeading}>
        <View style={[styles.offerIcon, { backgroundColor: theme.colors.surfaceMuted }]}>
          <Ionicons color={theme.colors.primary} name="book-outline" size={22} />
        </View>
        <View style={styles.offerCopy}>
          <Text style={[styles.offerTitle, { color: theme.colors.textPrimary }]}>{offer.subject}</Text>
          <Text style={[styles.caption, { color: theme.colors.textSecondary }]}>{offer.modes.map((mode) => TUTORING_MODE_LABELS[mode]).join(" · ")}</Text>
        </View>
      </View>
      {offer.description ? <Text style={[styles.body, { color: theme.colors.textSecondary }]}>{offer.description}</Text> : null}
      {offer.availabilityLabel ? (
        <View style={styles.availability}>
          <Ionicons color={theme.colors.success} name="time-outline" size={19} />
          <Text style={[styles.availabilityText, { color: theme.colors.textPrimary }]}>{offer.availabilityLabel}</Text>
        </View>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.xxl },
  hero: {
    borderTopWidth: 5,
    gap: spacing.xl,
  },
  identity: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.lg,
  },
  identityCopy: { flex: 1, gap: spacing.sm },
  title: { ...typography.title },
  badges: { flexDirection: "row", flexWrap: "wrap", gap: spacing.xs },
  body: { ...typography.body },
  notice: {
    alignItems: "center",
    borderRadius: radii.sm,
    flexDirection: "row",
    gap: spacing.md,
    padding: spacing.lg,
  },
  noticeText: { ...typography.label, flex: 1 },
  section: { gap: spacing.md },
  heading: { ...typography.heading },
  offerList: { gap: spacing.md },
  emptyOffers: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md,
  },
  offerCard: { gap: spacing.md },
  offerHeading: { alignItems: "center", flexDirection: "row", gap: spacing.md },
  offerIcon: {
    alignItems: "center",
    borderRadius: radii.sm,
    height: 46,
    justifyContent: "center",
    width: 46,
  },
  offerCopy: { flex: 1 },
  offerTitle: { ...typography.label },
  caption: { ...typography.caption },
  availability: { alignItems: "center", flexDirection: "row", gap: spacing.sm },
  availabilityText: { ...typography.caption, flex: 1 },
});
