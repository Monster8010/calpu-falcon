import type { TutoringOffer } from "@calpulli/domain";
import { AppHeader, Button, Skeleton, spacing } from "@calpulli/ui";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";

import {
  readableManagementError,
  useManagementResource,
} from "../../hooks/use-management-resource";
import {
  deleteTutoringOffer,
  loadTutorWorkspace,
  saveTutoringOffer,
  updateTutorProfile,
} from "../../services/tutor-management";
import { InlineNotice } from "../forms/management-form-controls";
import { ManagementRoleFrame } from "../roles/management-role-frame";
import {
  TutorDashboard,
  type TutorDashboardAction,
} from "./tutor-dashboard";
import {
  toTutorProfilePatch,
  toUpdateTutoringOfferPatch,
  type TutorProfileDraft,
  type TutoringOfferDraft,
} from "./tutor-form-models";
import { getTutorMetrics } from "./tutor-models";
import { TutorProfileEditor } from "./tutor-profile-editor";
import { TutoringOfferEditor } from "./tutoring-offer-editor";
import { TutoringOfferList } from "./tutoring-offer-list";

type TutorManagerView =
  | { kind: "dashboard" }
  | { kind: "offers" }
  | { kind: "offer-editor"; current?: TutoringOffer; returnTo: "dashboard" | "offers" }
  | { kind: "profile" };

export function TutorManager({ tutorId }: { tutorId: string }) {
  const load = useCallback(() => loadTutorWorkspace(tutorId), [tutorId]);
  const resource = useManagementResource(load, tutorId);
  const [view, setView] = useState<TutorManagerView>({ kind: "dashboard" });
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [mutationError, setMutationError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const showView = (next: TutorManagerView) => {
    setMutationError(null);
    setSuccess(null);
    setView(next);
  };

  if (resource.data === null) {
    return (
      <ManagementRoleFrame role="tutor">
        <AppHeader eyebrow="Perfil Tutor" subtitle="Leyendo perfil y materias mediante repositories." title="Preparando tutorías" />
        {resource.error ? (
          <View style={styles.stateBlock}>
            <InlineNotice message={resource.error} />
            <Button label="Reintentar" onPress={() => void resource.refresh()} variant="secondary" />
            <Button label="Elegir otro tutor" onPress={() => router.replace("/roles/tutor")} variant="ghost" />
          </View>
        ) : (
          <View style={styles.skeletons}>
            <Skeleton height={240} radius="md" />
            <Skeleton height={138} radius="md" />
            <Skeleton height={138} radius="md" />
          </View>
        )}
      </ManagementRoleFrame>
    );
  }

  const workspace = resource.data;

  const dashboardAction = (action: TutorDashboardAction) => {
    if (action === "new-offer") {
      showView({ kind: "offer-editor", returnTo: "dashboard" });
    } else {
      showView({ kind: action });
    }
  };

  const saveProfile = async (draft: TutorProfileDraft) => {
    setSaving(true);
    setMutationError(null);
    try {
      await updateTutorProfile(tutorId, toTutorProfilePatch(draft));
      await resource.refresh();
      setSuccess("Perfil guardado. Nombre, modalidades y contactos cambiarán en la app pública al refrescar.");
      setView({ kind: "dashboard" });
    } catch (error) {
      setMutationError(readableManagementError(error));
    } finally {
      setSaving(false);
    }
  };

  const saveOffer = async (
    draft: TutoringOfferDraft,
    current?: TutoringOffer,
    returnTo: "dashboard" | "offers" = "offers",
  ) => {
    setSaving(true);
    setMutationError(null);
    try {
      await saveTutoringOffer({
        current,
        draft,
        tutorId,
        updatePatch: current ? toUpdateTutoringOfferPatch(draft) : undefined,
      });
      await resource.refresh();
      setSuccess("Materia guardada. Tutorías reflejará modalidad, disponibilidad y visibilidad al refrescar.");
      setView({ kind: returnTo });
    } catch (error) {
      setMutationError(readableManagementError(error));
    } finally {
      setSaving(false);
    }
  };

  const confirmDeleteOffer = (offer: TutoringOffer) => {
    Alert.alert("Eliminar materia", `¿Quieres eliminar “${offer.subject}”?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => {
          setDeletingId(offer.id);
          setMutationError(null);
          void deleteTutoringOffer(offer.id)
            .then(() => resource.refresh())
            .then(() => setSuccess("Materia eliminada del estado compartido."))
            .catch((error: unknown) => setMutationError(readableManagementError(error)))
            .finally(() => setDeletingId(null));
        },
      },
    ]);
  };

  const back = view.kind === "offer-editor"
    ? () => showView({ kind: view.returnTo })
    : view.kind === "dashboard"
      ? undefined
      : () => showView({ kind: "dashboard" });
  const refreshEnabled = view.kind === "dashboard" || view.kind === "offers";

  return (
    <ManagementRoleFrame
      backLabel={view.kind === "dashboard" ? undefined : "Volver al dashboard Tutor"}
      onBack={back}
      onRefresh={refreshEnabled ? () => void resource.refresh() : undefined}
      refreshing={resource.isRefreshing}
      role="tutor"
    >
      {resource.error ? <InlineNotice message={resource.error} /> : null}
      {mutationError && view.kind !== "offer-editor" && view.kind !== "profile" ? <InlineNotice message={mutationError} /> : null}
      {success ? <InlineNotice message={success} tone="success" /> : null}

      {view.kind === "dashboard" ? (
        <TutorDashboard metrics={getTutorMetrics(workspace.tutor, workspace.offers)} offers={workspace.offers} onAction={dashboardAction} onChangeTutor={() => router.replace("/roles/tutor")} tutor={workspace.tutor} />
      ) : null}
      {view.kind === "profile" ? (
        <TutorProfileEditor error={mutationError} key={workspace.tutor.updatedAt} onSave={(draft) => void saveProfile(draft)} saving={saving} tutor={workspace.tutor} />
      ) : null}
      {view.kind === "offers" ? (
        <TutoringOfferList deletingId={deletingId} offers={workspace.offers} onCreate={() => showView({ kind: "offer-editor", returnTo: "offers" })} onDelete={confirmDeleteOffer} onEdit={(current) => showView({ kind: "offer-editor", current, returnTo: "offers" })} />
      ) : null}
      {view.kind === "offer-editor" ? (
        <TutoringOfferEditor error={mutationError} key={view.current?.id ?? "new-tutoring-offer"} offer={view.current} onSave={(draft) => void saveOffer(draft, view.current, view.returnTo)} saving={saving} />
      ) : null}
    </ManagementRoleFrame>
  );
}

const styles = StyleSheet.create({
  stateBlock: { gap: spacing.md },
  skeletons: { gap: spacing.md },
});
