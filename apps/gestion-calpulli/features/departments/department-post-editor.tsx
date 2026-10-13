import type { InstitutionalPost, InstitutionalPostVisibility } from "@calpulli/domain";
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
import { SharedImagePickerField } from "../forms/shared-image-picker-field";
import {
  DEMO_POST_MEDIA,
  POST_PRIORITY_OPTIONS,
  createEmptyPostDraft,
  createPostDraft,
  type InstitutionalPostDraft,
} from "./department-form-models";

const VISIBILITY_OPTIONS: readonly {
  description: string;
  key: keyof InstitutionalPostVisibility;
  label: string;
}[] = [
  { key: "showDepartment", label: "Mostrar departamento", description: "Incluye identidad y nombre del área." },
  { key: "showLocation", label: "Mostrar ubicación", description: "La ubicación sólo aparece si también tiene un valor." },
  { key: "showMedia", label: "Mostrar media", description: "Controla la galería demo en la app pública." },
  { key: "showDate", label: "Mostrar fecha", description: "Muestra la fecha de publicación." },
  { key: "showViews", label: "Mostrar visualizaciones", description: "Hace visible el conteo local acumulado." },
];

export function DepartmentPostEditor({
  error,
  onSave,
  post,
  saving,
}: {
  error: string | null;
  onSave(draft: InstitutionalPostDraft, publish: boolean): void;
  post?: InstitutionalPost;
  saving: boolean;
}) {
  const { theme } = useCalpulliTheme();
  const [draft, setDraft] = useState<InstitutionalPostDraft>(() => post ? createPostDraft(post) : createEmptyPostDraft());
  const mediaOptions = [
    ...DEMO_POST_MEDIA.map(({ key, label }) => ({ label, value: key })),
    ...draft.mediaKeys
      .filter((key) => !DEMO_POST_MEDIA.some((option) => option.key === key))
      .map((key, index) => ({ label: `Media actual ${index + 1}`, value: key })),
  ];

  const updateVisibility = (key: keyof InstitutionalPostVisibility, value: boolean) => {
    setDraft((current) => ({
      ...current,
      visibility: { ...current.visibility, [key]: value },
    }));
  };

  const toggleMedia = (key: string) => {
    setDraft((current) => ({
      ...current,
      mediaKeys: current.mediaKeys.includes(key)
        ? current.mediaKeys.filter((item) => item !== key)
        : [...current.mediaKeys, key],
    }));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <Text accessibilityRole="header" style={[styles.title, { color: theme.colors.textPrimary }]}>{post ? "Editar publicación" : "Crear publicación"}</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>Publicar no requiere aprobación previa del moderador.</Text>
        </View>
        {post ? <Badge label={post.isPublished ? "Publicada" : "Borrador"} tone={post.isPublished ? "success" : "neutral"} /> : null}
      </View>

      {post?.isHiddenByModerator ? <InlineNotice message="Esta publicación fue ocultada posteriormente por moderación. Editarla no cambia ese estado." tone="info" /> : null}
      {error ? <InlineNotice message={error} /> : null}

      <Card elevated style={styles.form}>
        <FormSection title="Contenido">
          <FormField label="Título" maxLength={120} onChangeText={(title) => setDraft((current) => ({ ...current, title }))} placeholder="Título del aviso" value={draft.title} />
          <FormField label="Contenido" maxLength={1200} multiline onChangeText={(body) => setDraft((current) => ({ ...current, body }))} placeholder="Escribe la información principal" value={draft.body} />
          <ChoiceGroup label="Prioridad" onChange={(priority) => setDraft((current) => ({ ...current, priority }))} options={POST_PRIORITY_OPTIONS} value={draft.priority} />
        </FormSection>

        <FormSection title="Detalles opcionales">
          <FormField label="Ubicación" maxLength={160} onChangeText={(location) => setDraft((current) => ({ ...current, location }))} placeholder="Ej. Biblioteca, edificio B" value={draft.location} />
          <FormField autoCapitalize="none" keyboardType="url" label="Enlace" onChangeText={(linkUrl) => setDraft((current) => ({ ...current, linkUrl }))} placeholder="https://..." value={draft.linkUrl} />
          <ChoiceGroup label="Galería demo" multiple onChange={toggleMedia} options={mediaOptions} value={draft.mediaKeys} />
          <SharedImagePickerField
            disabled={saving}
            existingSharedCount={draft.preservedMedia.length}
            onChange={(pendingSharedImage) => setDraft((current) => ({ ...current, pendingSharedImage }))}
            value={draft.pendingSharedImage}
          />
          <ToggleField description="Añade una referencia empaquetada; no abre un selector de archivos." label="Documento demo" onValueChange={(hasDocument) => setDraft((current) => ({ ...current, hasDocument }))} value={draft.hasDocument} />
        </FormSection>

        <FormSection title="Visibilidad pública">
          {VISIBILITY_OPTIONS.map((option) => (
            <ToggleField
              description={option.description}
              key={option.key}
              label={option.label}
              onValueChange={(value) => updateVisibility(option.key, value)}
              value={draft.visibility[option.key]}
            />
          ))}
        </FormSection>
      </Card>

      <View style={styles.actions}>
        <Button disabled={saving} label="Guardar borrador" leading={<Ionicons color={theme.colors.primary} name="archive-outline" size={19} />} onPress={() => onSave(draft, false)} variant="secondary" />
        <Button label={post?.isPublished ? "Guardar y publicar" : "Publicar"} leading={<Ionicons color={theme.colors.textOnAccent} name="send-outline" size={19} />} loading={saving} onPress={() => onSave(draft, true)} />
      </View>
      <Text style={[styles.dateNote, { color: theme.colors.textSecondary }]}>Al publicar por primera vez se utiliza la fecha y hora actual del dispositivo.</Text>
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
  actions: { flexDirection: "row", flexWrap: "wrap", gap: spacing.md, justifyContent: "flex-end" },
  dateNote: { ...typography.caption, textAlign: "right" },
});
