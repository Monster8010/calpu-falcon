import type { Department } from "@calpulli/domain";
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
  FormField,
  FormSection,
  InlineNotice,
} from "../forms/management-form-controls";
import {
  createDepartmentProfileDraft,
  type DepartmentProfileDraft,
} from "./department-form-models";

export function DepartmentProfileEditor({
  department,
  error,
  onSave,
  saving,
}: {
  department: Department;
  error: string | null;
  onSave(draft: DepartmentProfileDraft): void;
  saving: boolean;
}) {
  const { theme } = useCalpulliTheme();
  const [draft, setDraft] = useState(() => createDepartmentProfileDraft(department));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <Text accessibilityRole="header" style={[styles.title, { color: theme.colors.textPrimary }]}>Editar perfil</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>Estos datos identifican al departamento en la app pública.</Text>
        </View>
        <Badge label="Perfil institucional" tone="accent" />
      </View>
      {error ? <InlineNotice message={error} /> : null}
      <Card elevated style={styles.form}>
        <FormSection title="Identidad pública">
          <FormField label="Nombre" maxLength={90} onChangeText={(name) => setDraft((current) => ({ ...current, name }))} value={draft.name} />
          <FormField hint="Se usa en espacios compactos y para construir el monograma demo." label="Nombre corto" maxLength={32} onChangeText={(shortName) => setDraft((current) => ({ ...current, shortName }))} value={draft.shortName} />
          <FormField label="Descripción" maxLength={360} multiline onChangeText={(description) => setDraft((current) => ({ ...current, description }))} value={draft.description} />
        </FormSection>
      </Card>
      <InlineNotice message="El logo y el acento cultural permanecen en su referencia demo estable durante esta etapa." tone="info" />
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
  actions: { alignItems: "flex-end" },
});
