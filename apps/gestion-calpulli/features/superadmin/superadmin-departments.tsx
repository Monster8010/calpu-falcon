import type { Department } from "@calpulli/domain";
import {
  Badge,
  Button,
  Card,
  EmptyState,
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
  ToggleField,
} from "../forms/management-form-controls";
import {
  createSuperadminDepartmentDraft,
  type SuperadminDepartmentDraft,
} from "./superadmin-models";

export function SuperadminDepartmentList({
  departments,
  onCreate,
  onEdit,
}: {
  departments: readonly Department[];
  onCreate(): void;
  onEdit(department: Department): void;
}) {
  const { theme } = useCalpulliTheme();
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <Text accessibilityRole="header" style={[styles.title, { color: theme.colors.textPrimary }]}>Departamentos</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>Administra identidad y disponibilidad pública de cada área.</Text>
        </View>
        <Button label="Nuevo departamento" leading={<Ionicons color={theme.colors.textOnAccent} name="add-outline" size={20} />} onPress={onCreate} />
      </View>

      {departments.length === 0 ? (
        <EmptyState description="Crea la primera área institucional del estado compartido." illustration={<Ionicons color={theme.colors.primary} name="business-outline" size={48} />} title="No hay departamentos" />
      ) : (
        <View style={styles.list}>
          {departments.map((department) => (
            <Card elevated={department.isActive} key={department.id} style={styles.departmentCard}>
              <View style={[styles.departmentIcon, { backgroundColor: theme.colors.primaryMuted }]}>
                <Ionicons color={theme.colors.primary} name="business-outline" size={24} />
              </View>
              <View style={styles.departmentCopy}>
                <Text style={[styles.departmentName, { color: theme.colors.textPrimary }]}>{department.name}</Text>
                <Text numberOfLines={2} style={[styles.departmentDescription, { color: theme.colors.textSecondary }]}>{department.description ?? "Sin descripción pública."}</Text>
                <Text style={[styles.departmentId, { color: theme.colors.textSecondary }]}>{department.shortName ?? department.id}</Text>
              </View>
              <View style={styles.departmentActions}>
                <Badge label={department.isActive ? "Activo" : "Inactivo"} tone={department.isActive ? "success" : "neutral"} />
                <Button label="Editar" onPress={() => onEdit(department)} variant="secondary" />
              </View>
            </Card>
          ))}
        </View>
      )}
    </View>
  );
}

export function SuperadminDepartmentEditor({
  current,
  error,
  onSave,
  saving,
}: {
  current?: Department;
  error: string | null;
  onSave(draft: SuperadminDepartmentDraft): void;
  saving: boolean;
}) {
  const { theme } = useCalpulliTheme();
  const [draft, setDraft] = useState(() => createSuperadminDepartmentDraft(current));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <Text accessibilityRole="header" style={[styles.title, { color: theme.colors.textPrimary }]}>{current ? "Editar departamento" : "Nuevo departamento"}</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>Los cambios se reflejan en filtros y contenido público después de refrescar.</Text>
        </View>
        <Badge label={current ? "Perfil existente" : "Nueva área"} tone="accent" />
      </View>
      {error ? <InlineNotice message={error} /> : null}

      <Card elevated style={styles.form}>
        <FormSection title="Identidad institucional">
          <FormField label="Nombre" maxLength={90} onChangeText={(name) => setDraft((value) => ({ ...value, name }))} value={draft.name} />
          <FormField hint="Nombre compacto para cards y filtros." label="Nombre corto" maxLength={32} onChangeText={(shortName) => setDraft((value) => ({ ...value, shortName }))} value={draft.shortName} />
          <FormField label="Descripción" maxLength={360} multiline onChangeText={(description) => setDraft((value) => ({ ...value, description }))} value={draft.description} />
          <ToggleField description="Un departamento inactivo y su contenido dejan de aparecer en la app pública." label="Departamento activo" onValueChange={(isActive) => setDraft((value) => ({ ...value, isActive }))} value={draft.isActive} />
        </FormSection>
      </Card>

      <InlineNotice message={current ? "El logo, acento y contactos existentes se conservan." : "El área nueva utilizará la identidad visual demo genérica; medios reales pertenecen a una etapa posterior."} tone="info" />
      <View style={styles.saveActions}>
        <Button label={current ? "Guardar departamento" : "Crear departamento"} leading={<Ionicons color={theme.colors.textOnAccent} name="save-outline" size={20} />} loading={saving} onPress={() => onSave(draft)} />
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
  list: { gap: spacing.md },
  departmentCard: { alignItems: "center", flexDirection: "row", flexWrap: "wrap", gap: spacing.md },
  departmentIcon: { alignItems: "center", height: 48, justifyContent: "center", width: 48 },
  departmentCopy: { flex: 1, gap: spacing.xs, minWidth: 210 },
  departmentName: { ...typography.heading },
  departmentDescription: { ...typography.body },
  departmentId: { ...typography.caption },
  departmentActions: { alignItems: "flex-end", gap: spacing.sm },
  form: { gap: spacing.xxxl },
  saveActions: { alignItems: "flex-end" },
});
