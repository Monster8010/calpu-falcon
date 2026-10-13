import type { Story } from "@calpulli/domain";
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
  DEMO_STORY_MEDIA,
  STORY_DURATION_OPTIONS,
  createEmptyStoryDraft,
  createStoryDraft,
  type StoryDraft,
  type StoryDurationHours,
} from "./department-form-models";

export function DepartmentStoryEditor({
  error,
  now,
  onSave,
  saving,
  story,
}: {
  error: string | null;
  now: string;
  onSave(draft: StoryDraft): void;
  saving: boolean;
  story?: Story;
}) {
  const { theme } = useCalpulliTheme();
  const [draft, setDraft] = useState<StoryDraft>(() => story ? createStoryDraft(story, now) : createEmptyStoryDraft());
  const mediaOptions = [
    ...DEMO_STORY_MEDIA.map(({ key, label }) => ({ label, value: key })),
    ...(!DEMO_STORY_MEDIA.some(({ key }) => key === draft.mediaKey)
      ? [{ label: "Media actual", value: draft.mediaKey }]
      : []),
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <Text accessibilityRole="header" style={[styles.title, { color: theme.colors.textPrimary }]}>{story ? "Editar historia" : "Crear historia"}</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>Agrega al menos un título o texto. La vigencia empieza al guardar.</Text>
        </View>
        <Badge label="Media demo" tone="accent" />
      </View>
      {error ? <InlineNotice message={error} /> : null}
      <Card elevated style={styles.form}>
        <FormSection title="Aviso temporal">
          <FormField label="Título opcional" maxLength={80} onChangeText={(title) => setDraft((current) => ({ ...current, title }))} placeholder="Título breve" value={draft.title} />
          <FormField label="Texto opcional" maxLength={320} multiline onChangeText={(body) => setDraft((current) => ({ ...current, body }))} placeholder="Recordatorio o información breve" value={draft.body} />
          <ChoiceGroup label="Medio demo" onChange={(mediaKey) => setDraft((current) => ({ ...current, mediaKey }))} options={mediaOptions} value={draft.mediaKey} />
          <ChoiceGroup<StoryDurationHours>
            label="Duración"
            onChange={(durationHours) => setDraft((current) => ({ ...current, durationHours }))}
            options={STORY_DURATION_OPTIONS.map((hours) => ({ label: `${hours} horas`, value: hours }))}
            value={draft.durationHours}
          />
          <ToggleField description="Una historia inactiva se conserva, pero no aparece en la app pública." label="Historia activa" onValueChange={(isActive) => setDraft((current) => ({ ...current, isActive }))} value={draft.isActive} />
        </FormSection>
      </Card>
      <InlineNotice message={story ? "Al guardar se reinicia la vigencia desde este momento." : "No se usa un editor multimedia complejo: el medio es una referencia empaquetada estable."} tone="info" />
      <View style={styles.actions}>
        <Button label={story ? "Guardar historia" : "Crear historia"} leading={<Ionicons color={theme.colors.textOnAccent} name="time-outline" size={20} />} loading={saving} onPress={() => onSave(draft)} />
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
