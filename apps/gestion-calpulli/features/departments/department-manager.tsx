import type { InstitutionalPost, Story } from "@calpulli/domain";
import {
  AppHeader,
  Button,
  Skeleton,
  spacing,
} from "@calpulli/ui";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";

import {
  deleteDepartmentPost,
  deleteDepartmentStory,
  getDepartmentMetrics,
  loadDepartmentWorkspace,
  saveDepartmentPost,
  saveDepartmentStory,
  updateDepartmentProfile,
} from "../../services/department-management";
import {
  readableManagementError,
  useManagementResource,
} from "../../hooks/use-management-resource";
import { InlineNotice } from "../forms/management-form-controls";
import {
  toDepartmentProfilePatch,
  toUpdateStoryPatch,
  type DepartmentProfileDraft,
  type InstitutionalPostDraft,
  type StoryDraft,
} from "./department-form-models";
import {
  DepartmentDashboard,
  type DepartmentDashboardAction,
} from "./department-dashboard";
import { DepartmentPostEditor } from "./department-post-editor";
import { DepartmentPostList } from "./department-post-list";
import { DepartmentProfileEditor } from "./department-profile-editor";
import { DepartmentRoleFrame } from "./department-role-frame";
import { DepartmentStoryEditor } from "./department-story-editor";
import { DepartmentStoryList } from "./department-story-list";

type ManagerView =
  | { kind: "dashboard" }
  | { kind: "posts" }
  | { kind: "post-editor"; current?: InstitutionalPost; returnTo: "dashboard" | "posts" }
  | { kind: "stories" }
  | { kind: "story-editor"; current?: Story; returnTo: "dashboard" | "stories" }
  | { kind: "profile" };

export function DepartmentManager({ departmentId }: { departmentId: string }) {
  const load = useCallback(() => loadDepartmentWorkspace(departmentId), [departmentId]);
  const resource = useManagementResource(load, departmentId);
  const [view, setView] = useState<ManagerView>({ kind: "dashboard" });
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [mutationError, setMutationError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const showView = (next: ManagerView) => {
    setMutationError(null);
    setSuccess(null);
    setView(next);
  };

  if (resource.data === null) {
    return (
      <DepartmentRoleFrame>
        <AppHeader eyebrow="Perfil Departamento" subtitle="Leyendo el estado compartido mediante repositories." title="Preparando dashboard" />
        {resource.error ? (
          <View style={styles.stateBlock}>
            <InlineNotice message={resource.error} />
            <Button label="Reintentar" onPress={() => void resource.refresh()} variant="secondary" />
            <Button label="Elegir otro departamento" onPress={() => router.replace("/roles/department")} variant="ghost" />
          </View>
        ) : (
          <View style={styles.skeletons}>
            <Skeleton height={220} radius="md" />
            <Skeleton height={142} radius="md" />
            <Skeleton height={142} radius="md" />
          </View>
        )}
      </DepartmentRoleFrame>
    );
  }

  const workspace = resource.data;
  const now = new Date().toISOString();

  const dashboardAction = (action: DepartmentDashboardAction) => {
    if (action === "new-post") showView({ kind: "post-editor", returnTo: "dashboard" });
    else if (action === "posts") showView({ kind: "posts" });
    else if (action === "new-story") showView({ kind: "story-editor", returnTo: "dashboard" });
    else if (action === "stories") showView({ kind: "stories" });
    else showView({ kind: "profile" });
  };

  const savePost = async (
    draft: InstitutionalPostDraft,
    isPublished: boolean,
    current?: InstitutionalPost,
    returnTo: "dashboard" | "posts" = "posts",
  ) => {
    setSaving(true);
    setMutationError(null);
    const savedAt = new Date().toISOString();
    try {
      await saveDepartmentPost({
        current,
        departmentId,
        draft,
        isPublished,
        now: savedAt,
      });
      await resource.refresh();
      setSuccess(isPublished ? "Publicación guardada. Ya puede aparecer en Inicio al refrescar la app pública." : "Borrador guardado en el estado compartido.");
      setView({ kind: returnTo });
    } catch (error) {
      setMutationError(readableManagementError(error));
    } finally {
      setSaving(false);
    }
  };

  const confirmDeletePost = (post: InstitutionalPost) => {
    Alert.alert(
      "Eliminar publicación",
      `¿Quieres eliminar “${post.title}”? Esta acción modificará el estado compartido.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => {
            setDeletingId(post.id);
            setMutationError(null);
            void deleteDepartmentPost(post.id)
              .then(() => resource.refresh())
              .then(() => setSuccess("Publicación eliminada del estado compartido."))
              .catch((error: unknown) => setMutationError(readableManagementError(error)))
              .finally(() => setDeletingId(null));
          },
        },
      ],
    );
  };

  const saveStory = async (
    draft: StoryDraft,
    current?: Story,
    returnTo: "dashboard" | "stories" = "stories",
  ) => {
    setSaving(true);
    setMutationError(null);
    const savedAt = new Date().toISOString();
    try {
      await saveDepartmentStory({
        current,
        departmentId,
        draft,
        now: savedAt,
        updatePatch: current ? toUpdateStoryPatch(draft, savedAt) : undefined,
      });
      await resource.refresh();
      setSuccess(current ? "Historia actualizada y con vigencia renovada." : "Historia creada en el estado compartido.");
      setView({ kind: returnTo });
    } catch (error) {
      setMutationError(readableManagementError(error));
    } finally {
      setSaving(false);
    }
  };

  const confirmDeleteStory = (story: Story) => {
    Alert.alert(
      "Eliminar historia",
      `¿Quieres eliminar “${story.title ?? "Historia sin título"}”?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => {
            setDeletingId(story.id);
            setMutationError(null);
            void deleteDepartmentStory(story.id)
              .then(() => resource.refresh())
              .then(() => setSuccess("Historia eliminada del estado compartido."))
              .catch((error: unknown) => setMutationError(readableManagementError(error)))
              .finally(() => setDeletingId(null));
          },
        },
      ],
    );
  };

  const saveProfile = async (draft: DepartmentProfileDraft) => {
    setSaving(true);
    setMutationError(null);
    try {
      await updateDepartmentProfile(departmentId, toDepartmentProfilePatch(draft));
      await resource.refresh();
      setSuccess("Perfil del departamento actualizado.");
      setView({ kind: "dashboard" });
    } catch (error) {
      setMutationError(readableManagementError(error));
    } finally {
      setSaving(false);
    }
  };

  const back = view.kind === "post-editor"
    ? () => showView({ kind: view.returnTo })
    : view.kind === "story-editor"
      ? () => showView({ kind: view.returnTo })
      : view.kind === "dashboard"
        ? undefined
        : () => showView({ kind: "dashboard" });

  return (
    <DepartmentRoleFrame
      backLabel={view.kind === "dashboard" ? undefined : "Volver al dashboard"}
      onBack={back}
      onRefresh={view.kind === "dashboard" || view.kind === "posts" || view.kind === "stories" ? () => void resource.refresh() : undefined}
      refreshing={resource.isRefreshing}
    >
      {resource.error ? <InlineNotice message={resource.error} /> : null}
      {mutationError && view.kind !== "post-editor" && view.kind !== "story-editor" && view.kind !== "profile" ? <InlineNotice message={mutationError} /> : null}
      {success ? <InlineNotice message={success} tone="success" /> : null}

      {view.kind === "dashboard" ? (
        <DepartmentDashboard
          department={workspace.department}
          metrics={getDepartmentMetrics(workspace, now)}
          onAction={dashboardAction}
          onChangeDepartment={() => router.replace("/roles/department")}
        />
      ) : null}
      {view.kind === "posts" ? (
        <DepartmentPostList
          deletingId={deletingId}
          onCreate={() => showView({ kind: "post-editor", returnTo: "posts" })}
          onDelete={confirmDeletePost}
          onEdit={(current) => showView({ kind: "post-editor", current, returnTo: "posts" })}
          posts={workspace.posts}
        />
      ) : null}
      {view.kind === "post-editor" ? (
        <DepartmentPostEditor
          error={mutationError}
          key={view.current?.id ?? "new-post"}
          onSave={(draft, publish) => void savePost(draft, publish, view.current, view.returnTo)}
          post={view.current}
          saving={saving}
        />
      ) : null}
      {view.kind === "stories" ? (
        <DepartmentStoryList
          deletingId={deletingId}
          now={now}
          onCreate={() => showView({ kind: "story-editor", returnTo: "stories" })}
          onDelete={confirmDeleteStory}
          onEdit={(current) => showView({ kind: "story-editor", current, returnTo: "stories" })}
          stories={workspace.stories}
        />
      ) : null}
      {view.kind === "story-editor" ? (
        <DepartmentStoryEditor
          error={mutationError}
          key={view.current?.id ?? "new-story"}
          now={now}
          onSave={(draft) => void saveStory(draft, view.current, view.returnTo)}
          saving={saving}
          story={view.current}
        />
      ) : null}
      {view.kind === "profile" ? (
        <DepartmentProfileEditor
          department={workspace.department}
          error={mutationError}
          key={workspace.department.updatedAt}
          onSave={(draft) => void saveProfile(draft)}
          saving={saving}
        />
      ) : null}
    </DepartmentRoleFrame>
  );
}

const styles = StyleSheet.create({
  stateBlock: { gap: spacing.md },
  skeletons: { gap: spacing.md },
});
