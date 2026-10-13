import type { ExternalContactType, Tutor, TutoringMode } from "@calpulli/domain";
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
  DEMO_TUTOR_AVATARS,
  SHARED_TUTOR_AVATAR_KEY,
  TUTORING_MODE_OPTIONS,
  TUTOR_CONTACT_TYPE_OPTIONS,
  createEmptyTutorContactDraft,
  createTutorProfileDraft,
  type TutorProfileDraft,
} from "./tutor-form-models";

export function TutorProfileEditor({
  error,
  onSave,
  saving,
  tutor,
}: {
  error: string | null;
  onSave(draft: TutorProfileDraft): void;
  saving: boolean;
  tutor: Tutor;
}) {
  const { theme } = useCalpulliTheme();
  const [draft, setDraft] = useState(() => createTutorProfileDraft(tutor));
  const [nextContact, setNextContact] = useState(draft.contacts.length + 1);
  const avatarOptions = [
    ...DEMO_TUTOR_AVATARS,
    ...(draft.avatarKey === SHARED_TUTOR_AVATAR_KEY
      ? [{ key: SHARED_TUTOR_AVATAR_KEY, label: "Avatar compartido actual" }]
      : DEMO_TUTOR_AVATARS.some(({ key }) => key === draft.avatarKey)
        ? []
        : [{ key: draft.avatarKey, label: "Avatar actual" }]),
  ].map(({ key, label }) => ({ value: key, label }));

  const toggleMode = (mode: TutoringMode) => {
    setDraft((current) => ({
      ...current,
      modes: current.modes.includes(mode)
        ? current.modes.filter((item) => item !== mode)
        : [...current.modes, mode],
    }));
  };

  const updateContact = (
    index: number,
    patch: Partial<TutorProfileDraft["contacts"][number]>,
  ) => {
    setDraft((current) => ({
      ...current,
      contacts: current.contacts.map((contact, contactIndex) =>
        contactIndex === index ? { ...contact, ...patch } : contact,
      ),
    }));
  };

  const addContact = () => {
    const id = `${tutor.id}-contact-demo-${nextContact}`;
    setNextContact((value) => value + 1);
    setDraft((current) => ({
      ...current,
      contacts: [...current.contacts, createEmptyTutorContactDraft(id)],
    }));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <Text accessibilityRole="header" style={[styles.title, { color: theme.colors.textPrimary }]}>Editar perfil de tutor</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>Estos datos identifican el perfil público y sus canales externos.</Text>
        </View>
        <Badge label="Perfil público" tone="accent" />
      </View>
      {error ? <InlineNotice message={error} /> : null}

      <Card elevated style={styles.form}>
        <FormSection title="Presentación">
          <FormField label="Nombre" maxLength={90} onChangeText={(displayName) => setDraft((current) => ({ ...current, displayName }))} value={draft.displayName} />
          <FormField label="Descripción" maxLength={600} multiline onChangeText={(description) => setDraft((current) => ({ ...current, description }))} value={draft.description} />
          <ChoiceGroup label="Avatar demo" onChange={(avatarKey) => setDraft((current) => ({ ...current, avatarKey }))} options={avatarOptions} value={draft.avatarKey} />
          <ChoiceGroup<TutoringMode> label="Modalidades generales" multiple onChange={toggleMode} options={TUTORING_MODE_OPTIONS} value={draft.modes} />
        </FormSection>

        <FormSection title="Contactos externos">
          {draft.contacts.length === 0 ? <InlineNotice message="Sin contactos publicados. Puedes añadir uno; Calpulli no crea un chat interno." tone="info" /> : null}
          {draft.contacts.map((contact, index) => (
            <View key={contact.id} style={[styles.contact, { borderColor: theme.colors.borderSubtle }]}>
              <ChoiceGroup<ExternalContactType> label={`Tipo de contacto ${index + 1}`} onChange={(type) => updateContact(index, { type })} options={TUTOR_CONTACT_TYPE_OPTIONS} value={contact.type} />
              <FormField label="Etiqueta" maxLength={40} onChangeText={(label) => updateContact(index, { label })} value={contact.label} />
              <FormField autoCapitalize="none" label="Valor externo" maxLength={160} onChangeText={(value) => updateContact(index, { value })} value={contact.value} />
              <Button label="Quitar contacto" onPress={() => setDraft((current) => ({ ...current, contacts: current.contacts.filter((_, contactIndex) => contactIndex !== index) }))} variant="ghost" />
            </View>
          ))}
          <Button label="Añadir contacto" leading={<Ionicons color={theme.colors.primary} name="add-outline" size={19} />} onPress={addContact} variant="secondary" />
        </FormSection>
      </Card>

      {draft.preservedAvatar ? <InlineNotice message="El avatar compartido existente se conservará mientras no elijas una referencia demo. Los archivos reales pertenecen a la etapa opcional de medios." tone="info" /> : null}
      <View style={styles.actions}>
        <Button label="Guardar perfil" leading={<Ionicons color={theme.colors.textOnAccent} name="save-outline" size={20} />} loading={saving} onPress={() => onSave(draft)} />
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
  contact: { borderTopWidth: 1, gap: spacing.md, paddingTop: spacing.lg },
  actions: { alignItems: "flex-end" },
});
