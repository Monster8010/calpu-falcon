import type { Stand, StandRequest } from "@calpulli/domain";
import {
  AppHeader,
  Button,
  EmptyState,
  Skeleton,
  spacing,
  useCalpulliTheme,
} from "@calpulli/ui";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useCallback, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";

import {
  readableManagementError,
  useManagementResource,
} from "../../hooks/use-management-resource";
import {
  activateFair,
  approveStandRequest,
  finishFair,
  loadFairAdminWorkspace,
  rejectStandRequest,
  releaseFairStand,
  updateFairDate,
} from "../../services/fair-admin-management";
import { InlineNotice } from "../forms/management-form-controls";
import { ManagementRoleFrame } from "../roles/management-role-frame";
import {
  FairAdminDashboard,
  type FairAdminDashboardAction,
} from "./fair-admin-dashboard";
import { FairAdminMap } from "./fair-admin-map";
import {
  formatFairDate,
  getFairAdminSummary,
  normalizeFutureFairDate,
  suggestNextFairDate,
} from "./fair-admin-models";
import { FairDateEditor } from "./fair-date-editor";
import { FairRequestList } from "./fair-request-list";

type FairAdminView = "dashboard" | "date" | "map" | "requests";

export function FairAdminManager() {
  const { theme } = useCalpulliTheme();
  const load = useCallback(() => loadFairAdminWorkspace(), []);
  const resource = useManagementResource(load, "fair-admin");
  const [view, setView] = useState<FairAdminView>("dashboard");
  const [workingId, setWorkingId] = useState<string | null>(null);
  const [mutationError, setMutationError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const showView = (next: FairAdminView) => {
    setMutationError(null);
    setSuccess(null);
    setView(next);
  };

  const runMutation = async (
    id: string,
    operation: () => Promise<unknown>,
    successMessage: string,
    nextView?: FairAdminView,
  ) => {
    setWorkingId(id);
    setMutationError(null);
    try {
      await operation();
      await resource.refresh();
      setSuccess(successMessage);
      if (nextView) setView(nextView);
    } catch (error) {
      setMutationError(readableManagementError(error));
    } finally {
      setWorkingId(null);
    }
  };

  if (resource.data === null) {
    return (
      <ManagementRoleFrame role="fair-admin">
        <AppHeader eyebrow="Administrador de Feria" subtitle="Leyendo edición, stands y solicitudes mediante repositories." title="Preparando Feria" />
        {resource.error ? (
          <View style={styles.stateBlock}>
            <InlineNotice message={resource.error} />
            <Button label="Reintentar" onPress={() => void resource.refresh()} variant="secondary" />
          </View>
        ) : (
          <View style={styles.skeletons}>
            <Skeleton height={250} radius="md" />
            <Skeleton height={130} radius="md" />
            <Skeleton height={130} radius="md" />
          </View>
        )}
      </ManagementRoleFrame>
    );
  }

  const workspace = resource.data;
  const fair = workspace.fair;

  if (fair === undefined) {
    return (
      <ManagementRoleFrame onRefresh={() => void resource.refresh()} refreshing={resource.isRefreshing} role="fair-admin">
        <AppHeader eyebrow="Administrador de Feria" subtitle="No se encontró una edición próxima o activa en el estado compartido." title="Feria" />
        <EmptyState
          action={<Button label="Reintentar" onPress={() => void resource.refresh()} />}
          description="La creación de nuevas ferias corresponde a herramientas posteriores de configuración; esta etapa administra una edición existente."
          illustration={<Ionicons color={theme.colors.primary} name="calendar-outline" size={48} />}
          title="No hay una feria administrable"
        />
      </ManagementRoleFrame>
    );
  }

  const confirmActivate = () => {
    Alert.alert(
      "Activar feria",
      "La app pública cambiará de cuenta regresiva al mapa de 40 mesas después de refrescar.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Activar",
          onPress: () => void runMutation(
            fair.id,
            () => activateFair(fair.id),
            "Feria activada. El mapa ya puede aparecer en la app pública al refrescar.",
          ),
        },
      ],
    );
  };

  const confirmFinish = () => {
    try {
      const now = new Date().toISOString();
      const nextDate = suggestNextFairDate(fair, now);
      Alert.alert(
        "Finalizar feria",
        `La edición volverá a Próxima Feria con fecha ${formatFairDate(nextDate)}. Las solicitudes activas se cancelarán y todos sus stands quedarán disponibles.`,
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Finalizar",
            style: "destructive",
            onPress: () => void runMutation(
              fair.id,
              () => finishFair(fair.id, nextDate),
              "Feria finalizada; asociaciones activas limpiadas y próxima fecha configurada.",
              "dashboard",
            ),
          },
        ],
      );
    } catch (error) {
      setMutationError(readableManagementError(error));
    }
  };

  const confirmApprove = (request: StandRequest) => {
    const stand = workspace.stands.find(({ id }) => id === request.standId);
    const entrepreneur = workspace.entrepreneurs.find(({ id }) => id === request.entrepreneurId);
    Alert.alert(
      "Aprobar solicitud",
      `Asignar mesa ${stand?.number ?? "—"} a ${entrepreneur?.displayName ?? "este emprendimiento"}.`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Aprobar", onPress: () => void runMutation(request.id, () => approveStandRequest(request.id), "Solicitud aprobada y stand asignado.") },
      ],
    );
  };

  const confirmReject = (request: StandRequest) => {
    Alert.alert(
      "Rechazar solicitud",
      "La solicitud quedará rechazada y el stand volverá a un estado coherente.",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Rechazar", style: "destructive", onPress: () => void runMutation(request.id, () => rejectStandRequest(request.id), "Solicitud rechazada.") },
      ],
    );
  };

  const confirmRelease = (stand: Stand) => {
    Alert.alert(
      "Liberar stand",
      `La mesa ${stand.number} quedará disponible y su solicitud activa se cancelará.`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Liberar", style: "destructive", onPress: () => void runMutation(stand.id, () => releaseFairStand(stand.id), `Mesa ${stand.number} liberada.`) },
      ],
    );
  };

  const saveDate = async (date: Date) => {
    const now = new Date().toISOString();
    try {
      const nextDate = normalizeFutureFairDate(date, now);
      await runMutation(
        fair.id,
        () => updateFairDate(fair.id, nextDate),
        "Próxima fecha actualizada. El countdown público cambiará al refrescar.",
        "dashboard",
      );
    } catch (error) {
      setMutationError(readableManagementError(error));
    }
  };

  const action = (next: FairAdminDashboardAction) => showView(next);
  const refreshEnabled = view === "dashboard" || view === "map" || view === "requests";

  return (
    <ManagementRoleFrame
      backLabel={view === "dashboard" ? undefined : "Volver al dashboard de Feria"}
      onBack={view === "dashboard" ? undefined : () => showView("dashboard")}
      onRefresh={refreshEnabled ? () => void resource.refresh() : undefined}
      refreshing={resource.isRefreshing}
      role="fair-admin"
    >
      {resource.error ? <InlineNotice message={resource.error} /> : null}
      {mutationError && view !== "date" ? <InlineNotice message={mutationError} /> : null}
      {success ? <InlineNotice message={success} tone="success" /> : null}

      {view === "dashboard" ? (
        <FairAdminDashboard
          busy={workingId !== null}
          fair={fair}
          onActivate={confirmActivate}
          onAction={action}
          onFinish={confirmFinish}
          summary={getFairAdminSummary(workspace.stands, workspace.requests)}
        />
      ) : null}
      {view === "date" ? (
        <FairDateEditor
          error={mutationError}
          fair={fair}
          key={fair.updatedAt}
          now={new Date().toISOString()}
          onSave={(date) => void saveDate(date)}
          saving={workingId === fair.id}
        />
      ) : null}
      {view === "map" ? (
        <FairAdminMap
          busy={workingId !== null}
          entrepreneurs={workspace.entrepreneurs}
          onApprove={confirmApprove}
          onReject={confirmReject}
          onRelease={confirmRelease}
          requests={workspace.requests}
          stands={workspace.stands}
          workingId={workingId}
        />
      ) : null}
      {view === "requests" ? (
        <FairRequestList
          entrepreneurs={workspace.entrepreneurs}
          onApprove={confirmApprove}
          onReject={confirmReject}
          requests={workspace.requests}
          stands={workspace.stands}
          workingId={workingId}
        />
      ) : null}
    </ManagementRoleFrame>
  );
}

const styles = StyleSheet.create({
  stateBlock: { gap: spacing.md },
  skeletons: { gap: spacing.md },
});
