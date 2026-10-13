import type { TutoringMode, TutoringOffer } from "@calpulli/domain";
import {
  Badge,
  Button,
  Card,
  spacing,
  typography,
  useCalpulliTheme,
} from "@calpulli/ui";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import {
  ChoiceGroup,
  FormField,
  FormSection,
  InlineNotice,
  ToggleField,
} from "../forms/management-form-controls";
import {
  TUTORING_MODE_OPTIONS,
  createEmptyTutoringOfferDraft,
  createTutoringOfferDraft,
  type TutoringOfferDraft,
} from "./tutor-form-models";

export function TutoringOfferEditor({
  error,
  offer,
  onSave,
  saving,
}: {
  error: string | null;
  offer?: TutoringOffer;
  onSave(draft: TutoringOfferDraft): void;
  saving: boolean;
}) {
  const { theme } = useCalpulliTheme();
  const [draft, setDraft] = useState(() => offer
    ? createTutoringOfferDraft(offer)
    : createEmptyTutoringOfferDraft());

  const toggleMode = (mode: TutoringMode) => setDraft((current) => ({
    ...current,
    modes: current.modes.includes(mode)
      ? current.modes.filter((item) => item !== mode)
      : [...current.modes, mode],
  }));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <Text accessibilityRole="header" style={[styles.title, { color: theme.colors.textPrimary }]}>{offer ? "Editar materia" : "Añadir materia"}</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>Configura cómo y cuándo puede solicitarse acompañamiento externo.</Text>
        </View>
        {offer ? <Badge label={offer.isActive ? "Activa" : "Inactiva"} tone={offer.isActive ? "success" : "neutral"} /> : null}
      </View>
      {error ? <InlineNotice message={error} /> : null}

      <Card elevated style={styles.form}>
        <FormSection title="Oferta de tutoría">
          <FormField label="Materia" maxLength={100} onChangeText={(subject) => setDraft((current) => ({ ...current, subject }))} placeholder="Ej. Cálculo Diferencial" value={draft.subject} />
          <FormField label="Descripción" maxLength={600} multiline onChangeText={(description) => setDraft((current) => ({ ...current, description }))} placeholder="Temas o dinámica de acompañamiento" value={draft.description} />
          <ChoiceGroup<TutoringMode> label="Modalidad" multiple onChange={toggleMode} options={TUTORING_MODE_OPTIONS} value={draft.modes} />
          <FormField label="Disponibilidad" maxLength={160} onChangeText={(availabilityLabel) => setDraft((current) => ({ ...current, availabilityLabel }))} placeholder="Ej. Martes y jueves por la tarde" value={draft.availabilityLabel} />
          <ToggleField description="Una materia inactiva deja de aparecer en Tutorías después de refrescar." label="Materia activa" onValueChange={(isActive) => setDraft((current) => ({ ...current, isActive }))} value={draft.isActive} />
        </FormSection>
      </Card>

      <View style={styles.actions}>
        <Button label="Guardar materia" leading={<Ionicons color={theme.colors.textOnAccent} name="save-outline" size={20} />} loading={saving} onPress={() => onSave(draft)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.xxl },
  header: { alignItems: "flex-start", flexDirection: "row", flexWrap: "wrap", gap: spacing.md, justifyContent: "space-between" },
  headerCopy: { flex: 1, gap: spacing.xs, minWidth: 230 },
  title: { ...typography.title },
  subtitle: { ...typography.body },
  form: { gap: spacing.xxxl },
  actions: { alignItems: "flex-end" },
});
