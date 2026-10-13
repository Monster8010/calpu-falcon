import type { AppConfiguration, AppThemePreference } from "@calpulli/domain";
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
  createConfigurationDraft,
  type ConfigurationDraft,
} from "./superadmin-models";

const THEME_OPTIONS: readonly {
  label: string;
  value: AppThemePreference;
}[] = [
  { label: "Sistema", value: "system" },
  { label: "Claro", value: "light" },
  { label: "Oscuro", value: "dark" },
];

export function ConfigurationEditor({
  configuration,
  error,
  onSave,
  saving,
}: {
  configuration: AppConfiguration;
  error: string | null;
  onSave(draft: ConfigurationDraft): void;
  saving: boolean;
}) {
  const { theme } = useCalpulliTheme();
  const [draft, setDraft] = useState(() => createConfigurationDraft(configuration));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <Text accessibilityRole="header" style={[styles.title, { color: theme.colors.textPrimary }]}>Configuración compartida</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>Identidad básica y preferencias predeterminadas del ecosistema.</Text>
        </View>
        <Badge label={`Schema ${configuration.schemaVersion}`} tone="accent" />
      </View>
      {error ? <InlineNotice message={error} /> : null}

      <Card elevated style={styles.form}>
        <FormSection title="Identidad">
          <FormField label="Institución" maxLength={90} onChangeText={(institutionName) => setDraft((current) => ({ ...current, institutionName }))} value={draft.institutionName} />
          <FormField label="Nombre de la app pública" maxLength={90} onChangeText={(publicAppName) => setDraft((current) => ({ ...current, publicAppName }))} value={draft.publicAppName} />
          <FormField label="Nombre de Gestión" maxLength={90} onChangeText={(managementAppName) => setDraft((current) => ({ ...current, managementAppName }))} value={draft.managementAppName} />
        </FormSection>
        <FormSection title="Demostración y apariencia">
          <ToggleField description="Indica que esta instalación usa perfiles y contenido ficticio de demostración." label="Modo demostración" onValueChange={(demoMode) => setDraft((current) => ({ ...current, demoMode }))} value={draft.demoMode} />
          <ChoiceGroup label="Tema predeterminado" onChange={(defaultTheme) => setDraft((current) => ({ ...current, defaultTheme }))} options={THEME_OPTIONS} value={draft.defaultTheme} />
        </FormSection>
      </Card>

      <InlineNotice message="La versión de schema es de solo lectura. Cambiarla requiere una migración y no forma parte de esta etapa." tone="info" />
      <View style={styles.actions}>
        <Button label="Guardar configuración" leading={<Ionicons color={theme.colors.textOnAccent} name="save-outline" size={20} />} loading={saving} onPress={() => onSave(draft)} />
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
