import type { AppRole, Department } from "@calpulli/domain";
import { AppHeader, Button, Skeleton, spacing } from "@calpulli/ui";
import { router, type Href } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";

import {
  readableManagementError,
  useManagementResource,
} from "../../hooks/use-management-resource";
import {
  loadSuperadminWorkspace,
  restoreSuperadminDemoData,
  revalidateSuperadminStorage,
  saveSuperadminDepartment,
  updateSuperadminConfiguration,
} from "../../services/superadmin-management";
import { InlineNotice } from "../forms/management-form-controls";
import { useDemoRole } from "../roles/demo-role-context";
import { ManagementRoleFrame } from "../roles/management-role-frame";
import { ConfigurationEditor } from "./configuration-editor";
import {
  SuperadminDepartmentEditor,
  SuperadminDepartmentList,
} from "./superadmin-departments";
import {
  SuperadminDashboard,
  type SuperadminDashboardAction,
} from "./superadmin-dashboard";
import {
  toConfigurationPatch,
  toCreateDepartmentInput,
  toUpdateDepartmentInput,
  type ConfigurationDraft,
  type SuperadminDepartmentDraft,
} from "./superadmin-models";
import { SystemTools } from "./system-tools";

type SuperadminView =
  | { kind: "configuration" }
  | { kind: "dashboard" }
  | { kind: "department-editor"; current?: Department }
  | { kind: "departments" }
  | { kind: "system-tools" };

type BusyAction = "configuration" | "department" | "restore" | "validate";

export function SuperadminManager() {
  const load = useCallback(() => loadSuperadminWorkspace(), []);
  const resource = useManagementResource(load, "superadmin-workspace");
  const { selectRole } = useDemoRole();
  const [view, setView] = useState<SuperadminView>({ kind: "dashboard" });
  const [busyAction, setBusyAction] = useState<BusyAction | null>(null);
  const [mutationError, setMutationError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const showView = (next: SuperadminView) => {
    setMutationError(null);
    setSuccess(null);
    setView(next);
  };

  const switchToRole = async (role: AppRole, route: Href) => {
    await selectRole(role).catch(() => undefined);
    router.replace(route);
  };

  const dashboardAction = (action: SuperadminDashboardAction) => {
    if (action === "configuration") showView({ kind: "configuration" });
    else if (action === "departments") showView({ kind: "departments" });
    else if (action === "demo-data") showView({ kind: "system-tools" });
    else if (action === "fair") void switchToRole("fair-admin", "/roles/fair-admin");
    else void switchToRole("moderator", "/roles/moderator");
  };

  const saveConfiguration = async (draft: ConfigurationDraft) => {
    setBusyAction("configuration");
    setMutationError(null);
    try {
      await updateSuperadminConfiguration(toConfigurationPatch(draft));
      await resource.refresh();
      setSuccess("Configuración guardada y verificada en el estado compartido.");
      setView({ kind: "dashboard" });
    } catch (error) {
      setMutationError(readableManagementError(error));
    } finally {
      setBusyAction(null);
    }
  };

  const saveDepartment = async (
    draft: SuperadminDepartmentDraft,
    current?: Department,
  ) => {
    setBusyAction("department");
    setMutationError(null);
    try {
      await saveSuperadminDepartment({
        current,
        createInput: current ? undefined : toCreateDepartmentInput(draft),
        updateInput: current ? toUpdateDepartmentInput(draft) : undefined,
      });
      await resource.refresh();
      setSuccess(current ? "Departamento actualizado." : "Departamento creado en el estado compartido.");
      setView({ kind: "departments" });
    } catch (error) {
      setMutationError(readableManagementError(error));
    } finally {
      setBusyAction(null);
    }
  };

  const revalidateStorage = async () => {
    setBusyAction("validate");
    setMutationError(null);
    setSuccess(null);
    try {
      const validated = await revalidateSuperadminStorage();
      await resource.refresh();
      setSuccess(`Almacenamiento revalidado. Revisión compartida ${validated.meta.revision}.`);
    } catch (error) {
      setMutationError(readableManagementError(error));
    } finally {
      setBusyAction(null);
    }
  };

  const restoreDemoData = async () => {
    setBusyAction("restore");
    setMutationError(null);
    setSuccess(null);
    try {
      const restored = await restoreSuperadminDemoData();
      await resource.refresh();
      setSuccess(`Datos demo restaurados y verificados. Nueva revisión ${restored.meta.revision}.`);
      setView({ kind: "system-tools" });
    } catch (error) {
      setMutationError(readableManagementError(error));
    } finally {
      setBusyAction(null);
    }
  };

  const confirmRestore = () => {
    Alert.alert(
      "Restaurar datos de demostración",
      "Esta acción reemplazará todos los cambios actuales del estado compartido por un seed nuevo. ¿Quieres continuar?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Restaurar",
          style: "destructive",
          onPress: () => void restoreDemoData(),
        },
      ],
    );
  };

  if (resource.data === null) {
    return (
      <ManagementRoleFrame role="superadmin">
        <AppHeader eyebrow="Superadministrador" subtitle="Leyendo métricas y revisión desde el estado compartido." title="Preparando dashboard general" />
        {resource.error ? (
          <View style={styles.stateBlock}>
            <InlineNotice message={resource.error} />
            <Button label="Reintentar" onPress={() => void resource.refresh()} variant="secondary" />
          </View>
        ) : (
          <View style={styles.skeletons}>
            <Skeleton height={220} radius="md" />
            <Skeleton height={130} radius="md" />
            <Skeleton height={190} radius="md" />
          </View>
        )}
      </ManagementRoleFrame>
    );
  }

  const workspace = resource.data;
  const back = view.kind === "department-editor"
    ? () => showView({ kind: "departments" })
    : view.kind === "dashboard"
      ? undefined
      : () => showView({ kind: "dashboard" });
  const refreshEnabled = view.kind === "dashboard" || view.kind === "departments" || view.kind === "system-tools";

  return (
    <ManagementRoleFrame
      backLabel={view.kind === "department-editor" ? "Volver a departamentos" : view.kind === "dashboard" ? undefined : "Volver al dashboard Superadmin"}
      onBack={back}
      onRefresh={refreshEnabled ? () => void resource.refresh() : undefined}
      refreshing={resource.isRefreshing}
      role="superadmin"
    >
      {resource.error ? <InlineNotice message={resource.error} /> : null}
      {mutationError && view.kind !== "configuration" && view.kind !== "department-editor" ? <InlineNotice message={mutationError} /> : null}
      {success ? <InlineNotice message={success} tone="success" /> : null}

      {view.kind === "dashboard" ? <SuperadminDashboard fair={workspace.fair} metrics={workspace.metrics} onAction={dashboardAction} /> : null}
      {view.kind === "configuration" ? <ConfigurationEditor configuration={workspace.configuration} error={mutationError} key={`${workspace.meta.revision}:configuration`} onSave={(draft) => void saveConfiguration(draft)} saving={busyAction === "configuration"} /> : null}
      {view.kind === "departments" ? <SuperadminDepartmentList departments={workspace.departments} onCreate={() => showView({ kind: "department-editor" })} onEdit={(current) => showView({ kind: "department-editor", current })} /> : null}
      {view.kind === "department-editor" ? <SuperadminDepartmentEditor current={view.current} error={mutationError} key={view.current?.id ?? "new-superadmin-department"} onSave={(draft) => void saveDepartment(draft, view.current)} saving={busyAction === "department"} /> : null}
      {view.kind === "system-tools" ? <SystemTools busyAction={busyAction === "restore" || busyAction === "validate" ? busyAction : null} meta={workspace.meta} onRestore={confirmRestore} onValidate={() => void revalidateStorage()} source={workspace.source} /> : null}
    </ManagementRoleFrame>
  );
}

const styles = StyleSheet.create({
  stateBlock: { gap: spacing.md },
  skeletons: { gap: spacing.md },
});
