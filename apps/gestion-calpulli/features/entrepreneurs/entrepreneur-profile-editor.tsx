import type { Entrepreneur, ExternalContactType } from "@calpulli/domain";
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
  CONTACT_TYPE_OPTIONS,
  DEMO_AVATARS,
  DEMO_GALLERY_MEDIA,
  SHARED_AVATAR_KEY,
  createEmptyContactDraft,
  createEntrepreneurProfileDraft,
  type EntrepreneurProfileDraft,
} from "./entrepreneur-form-models";

export function EntrepreneurProfileEditor({
  entrepreneur,
  error,
  onSave,
  saving,
}: {
  entrepreneur: Entrepreneur;
  error: string | null;
  onSave(draft: EntrepreneurProfileDraft): void;
  saving: boolean;
}) {
  const { theme } = useCalpulliTheme();
  const [draft, setDraft] = useState(() => createEntrepreneurProfileDraft(entrepreneur));
  const [nextContact, setNextContact] = useState(draft.contacts.length + 1);
  const avatarOptions = [
    ...DEMO_AVATARS,
    ...(draft.avatarKey === SHARED_AVATAR_KEY
      ? [{ key: SHARED_AVATAR_KEY, label: "Avatar compartido actual" }]
      : DEMO_AVATARS.some(({ key }) => key === draft.avatarKey)
        ? []
        : [{ key: draft.avatarKey, label: "Sticker actual" }]),
  ].map(({ key, label }) => ({ value: key, label }));
  const galleryOptions = [
    ...DEMO_GALLERY_MEDIA,
    ...draft.galleryKeys
      .filter((key) => !DEMO_GALLERY_MEDIA.some((option) => option.key === key))
      .map((key, index) => ({ key, label: `Galería actual ${index + 1}` })),
  ].map(({ key, label }) => ({ value: key, label }));

  const toggleGallery = (key: string) => {
    setDraft((current) => ({
      ...current,
      galleryKeys: current.galleryKeys.includes(key)
        ? current.galleryKeys.filter((item) => item !== key)
        : [...current.galleryKeys, key],
    }));
  };

  const updateContact = (
    index: number,
    patch: Partial<EntrepreneurProfileDraft["contacts"][number]>,
  ) => {
    setDraft((current) => ({
      ...current,
      contacts: current.contacts.map((contact, contactIndex) =>
        contactIndex === index ? { ...contact, ...patch } : contact,
      ),
    }));
  };

  const addContact = () => {
    const id = `${entrepreneur.id}-contact-demo-${nextContact}`;
    setNextContact((value) => value + 1);
    setDraft((current) => ({
      ...current,
      contacts: [...current.contacts, createEmptyContactDraft(id)],
    }));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <Text accessibilityRole="header" style={[styles.title, { color: theme.colors.textPrimary }]}>Editar mi perfil</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>Actualiza la identidad pública, galería y vías de contacto externo.</Text>
        </View>
        <Badge label="Escaparate público" tone="accent" />
      </View>
      {error ? <InlineNotice message={error} /> : null}

      <Card elevated style={styles.form}>
        <FormSection title="Identidad">
          <FormField label="Nombre" maxLength={90} onChangeText={(displayName) => setDraft((current) => ({ ...current, displayName }))} value={draft.displayName} />
          <FormField label="Categoría" maxLength={60} onChangeText={(category) => setDraft((current) => ({ ...current, category }))} value={draft.category} />
          <FormField label="Descripción" maxLength={600} multiline onChangeText={(description) => setDraft((current) => ({ ...current, description }))} value={draft.description} />
          <ChoiceGroup label="Avatar o sticker demo" onChange={(avatarKey) => setDraft((current) => ({ ...current, avatarKey }))} options={avatarOptions} value={draft.avatarKey} />
          <ChoiceGroup label="Galería demo" multiple onChange={toggleGallery} options={galleryOptions} value={draft.galleryKeys} />
        </FormSection>

        <FormSection title="Contactos externos">
          {draft.contacts.length === 0 ? <InlineNotice message="No hay contactos. Puedes añadir uno sin habilitar chat interno." tone="info" /> : null}
          {draft.contacts.map((contact, index) => (
            <View key={contact.id} style={[styles.contact, { borderColor: theme.colors.borderSubtle }]}>
              <ChoiceGroup<ExternalContactType> label={`Tipo de contacto ${index + 1}`} onChange={(type) => updateContact(index, { type })} options={CONTACT_TYPE_OPTIONS} value={contact.type} />
              <FormField label="Etiqueta" maxLength={40} onChangeText={(label) => updateContact(index, { label })} value={contact.label} />
              <FormField autoCapitalize="none" label="Valor externo" maxLength={160} onChangeText={(value) => updateContact(index, { value })} value={contact.value} />
              <Button label="Quitar contacto" onPress={() => setDraft((current) => ({ ...current, contacts: current.contacts.filter((_, contactIndex) => contactIndex !== index) }))} variant="ghost" />
            </View>
          ))}
          <Button label="Añadir contacto" leading={<Ionicons color={theme.colors.primary} name="add-outline" size={19} />} onPress={addContact} variant="secondary" />
        </FormSection>
      </Card>

      {draft.preservedGallery.length > 0 ? <InlineNotice message="Las imágenes compartidas existentes se conservarán; la selección real de archivos pertenece a la etapa opcional de medios." tone="info" /> : null}
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
