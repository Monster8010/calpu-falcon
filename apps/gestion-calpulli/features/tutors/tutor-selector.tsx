import type { Tutor } from "@calpulli/domain";
import {
  AppHeader,
  Badge,
  Button,
  Card,
  Skeleton,
  spacing,
  typography,
  useCalpulliTheme,
} from "@calpulli/ui";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { InlineNotice } from "../forms/management-form-controls";
import { ManagementTutorAvatar } from "./tutor-avatar";
import { TUTORING_MODE_LABELS } from "./tutor-models";
import { getManagementTutorAccent } from "./tutor-presentation";

export function TutorSelector({
  error,
  isLoading,
  onRetry,
  onSelect,
  tutors,
}: {
  error: string | null;
  isLoading: boolean;
  onRetry(): void;
  onSelect(tutor: Tutor): void;
  tutors: Tutor[] | null;
}) {
  const { theme } = useCalpulliTheme();
  return (
    <View style={styles.container}>
      <AppHeader
        eyebrow="Perfil Tutor · Modo demo"
        subtitle="Selecciona un perfil ficticio para editar materias y contacto. No representa una cuenta real."
        title="Elegir tutor demo"
      />
      <View style={styles.contextRow}>
        <Badge label={`${tutors?.length ?? "—"} perfiles ficticios`} tone="accent" />
        <Text style={[styles.contextCopy, { color: theme.colors.textSecondary }]}>Los cambios se reflejan en Tutorías al refrescar la app pública.</Text>
      </View>

      {error ? (
        <View style={styles.errorBlock}>
          <InlineNotice message={error} />
          <Button label="Reintentar" onPress={onRetry} variant="secondary" />
        </View>
      ) : null}

      {isLoading && tutors === null ? (
        <View style={styles.list}>
          {[0, 1, 2, 3].map((item) => <Skeleton height={136} key={item} radius="md" />)}
        </View>
      ) : (
        <View accessibilityLabel="Tutores de demostración" style={styles.list}>
          {tutors?.map((tutor) => (
            <Pressable
              accessibilityHint="Abre las herramientas de este tutor"
              accessibilityLabel={tutor.displayName}
              accessibilityRole="button"
              key={tutor.id}
              onPress={() => onSelect(tutor)}
              style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}
            >
              <Card style={[styles.card, { borderLeftColor: getManagementTutorAccent(tutor) }]}>
                <ManagementTutorAvatar size={62} tutor={tutor} />
                <View style={styles.copy}>
                  <Text style={[styles.name, { color: theme.colors.textPrimary }]}>{tutor.displayName}</Text>
                  <Text style={[styles.modes, { color: theme.colors.primary }]}>{tutor.modes.map((mode) => TUTORING_MODE_LABELS[mode]).join(" · ")}</Text>
                  <Text numberOfLines={2} style={[styles.description, { color: theme.colors.textSecondary }]}>{tutor.description}</Text>
                </View>
                <Ionicons color={theme.colors.primary} name="chevron-forward" size={22} />
              </Card>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.xxl },
  contextRow: { alignItems: "center", flexDirection: "row", flexWrap: "wrap", gap: spacing.md },
  contextCopy: { ...typography.body, flex: 1, minWidth: 220 },
  errorBlock: { gap: spacing.md },
  list: { gap: spacing.md },
  pressable: { width: "100%" },
  card: { alignItems: "center", borderLeftWidth: 4, flexDirection: "row", gap: spacing.md, minHeight: 136 },
  copy: { flex: 1, gap: spacing.xs },
  name: { ...typography.heading },
  modes: { ...typography.label },
  description: { ...typography.body },
  pressed: { opacity: 0.68, transform: [{ scale: 0.995 }] },
});
