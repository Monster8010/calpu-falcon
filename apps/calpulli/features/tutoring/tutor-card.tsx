import { Badge, Card, spacing, typography, useCalpulliTheme } from "@calpulli/ui";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import type { PublicTutorProfile } from "./tutoring-selection";
import { TUTORING_MODE_LABELS } from "./tutoring-selection";
import { getTutorAccent, TutorAvatar } from "./tutor-avatar";

export function TutorCard({ profile, onPress }: { profile: PublicTutorProfile; onPress(): void }) {
  const { theme } = useCalpulliTheme();
  const accent = getTutorAccent(profile.tutor);

  return (
    <Pressable
      accessibilityHint="Abre el perfil del tutor"
      accessibilityLabel={`${profile.tutor.displayName}, tutorías de ${profile.subjects.join(", ")}`}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => pressed && styles.pressed}
    >
      <Card elevated style={[styles.card, { borderTopColor: accent }]}>
        <View style={styles.header}>
          <TutorAvatar tutor={profile.tutor} size={68} />
          <View style={styles.headerCopy}>
            <Text style={[styles.title, { color: theme.colors.textPrimary }]}>{profile.tutor.displayName}</Text>
            <View style={styles.badges}>
              {profile.modes.map((mode) => <Badge key={mode} label={TUTORING_MODE_LABELS[mode]} tone="accent" />)}
            </View>
          </View>
        </View>
        <Text numberOfLines={3} style={[styles.body, { color: theme.colors.textSecondary }]}>{profile.tutor.description}</Text>
        <View style={styles.subjects}>
          <Ionicons color={theme.colors.primary} name="book-outline" size={20} />
          <Text numberOfLines={2} style={[styles.subjectText, { color: theme.colors.textPrimary }]}>
            {profile.subjects.slice(0, 3).join(" · ") || "Materias por confirmar"}
          </Text>
        </View>
        <View style={[styles.footer, { borderTopColor: theme.colors.borderSubtle }]}>
          <Text style={[styles.cta, { color: theme.colors.primary }]}>Ver perfil</Text>
          <Ionicons color={theme.colors.primary} name="chevron-forward" size={21} />
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderTopWidth: 4,
    gap: spacing.lg,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md,
  },
  headerCopy: {
    flex: 1,
    gap: spacing.sm,
  },
  title: {
    ...typography.heading,
  },
  badges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
  body: {
    ...typography.body,
  },
  subjects: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
  },
  subjectText: {
    ...typography.label,
    flex: 1,
  },
  footer: {
    alignItems: "center",
    borderTopWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: spacing.md,
  },
  cta: {
    ...typography.label,
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.995 }],
  },
});
