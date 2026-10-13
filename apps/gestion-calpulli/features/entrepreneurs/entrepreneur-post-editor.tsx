import type { EntrepreneurPost } from "@calpulli/domain";
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
} from "../forms/management-form-controls";
import {
  DEMO_POST_MEDIA,
  createEmptyEntrepreneurPostDraft,
  createEntrepreneurPostDraft,
  type EntrepreneurPostDraft,
} from "./entrepreneur-form-models";

export function EntrepreneurPostEditor({
  error,
  onSave,
  post,
  saving,
}: {
  error: string | null;
  onSave(draft: EntrepreneurPostDraft, publish: boolean): void;
  post?: EntrepreneurPost;
  saving: boolean;
}) {
  const { theme } = useCalpulliTheme();
  const [draft, setDraft] = useState(() => post
    ? createEntrepreneurPostDraft(post)
    : createEmptyEntrepreneurPostDraft());
  const mediaOptions = [
    ...DEMO_POST_MEDIA,
    ...draft.mediaKeys
      .filter((key) => !DEMO_POST_MEDIA.some((option) => option.key === key))
      .map((key, index) => ({ key, label: `Media actual ${index + 1}` })),
  ].map(({ key, label }) => ({ value: key, label }));

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
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>Este contenido pertenece a Marketplace y al perfil; nunca aparece en Inicio institucional.</Text>
        </View>
        {post ? <Badge label={post.isPublished ? "Publicada" : "Borrador"} tone={post.isPublished ? "success" : "neutral"} /> : null}
      </View>
      {post?.isHiddenByModerator ? <InlineNotice message="La publicación está oculta por moderación. Editarla no restaura su visibilidad." tone="info" /> : null}
      {error ? <InlineNotice message={error} /> : null}

      <Card elevated style={styles.form}>
        <FormSection title="Contenido">
          <FormField label="Título" maxLength={120} onChangeText={(title) => setDraft((current) => ({ ...current, title }))} placeholder="Una novedad de tu proyecto" value={draft.title} />
          <FormField label="Texto" maxLength={1200} multiline onChangeText={(body) => setDraft((current) => ({ ...current, body }))} placeholder="Comparte el proceso, una pieza o una actualización" value={draft.body} />
          <ChoiceGroup label="Galería demo" multiple onChange={toggleMedia} options={mediaOptions} value={draft.mediaKeys} />
        </FormSection>
      </Card>

      <View style={styles.actions}>
        <Button disabled={saving} label="Guardar borrador" leading={<Ionicons color={theme.colors.primary} name="archive-outline" size={19} />} onPress={() => onSave(draft, false)} variant="secondary" />
        <Button label={post?.isPublished ? "Guardar publicada" : "Publicar"} leading={<Ionicons color={theme.colors.textOnAccent} name="send-outline" size={19} />} loading={saving} onPress={() => onSave(draft, true)} />
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
  actions: { flexDirection: "row", flexWrap: "wrap", gap: spacing.md, justifyContent: "flex-end" },
});
