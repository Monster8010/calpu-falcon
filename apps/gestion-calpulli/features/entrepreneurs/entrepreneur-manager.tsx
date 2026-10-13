import type { EntrepreneurPost, Product, Stand } from "@calpulli/domain";
import { AppHeader, Button, Skeleton, spacing } from "@calpulli/ui";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";

import {
  readableManagementError,
  useManagementResource,
} from "../../hooks/use-management-resource";
import {
  deleteEntrepreneurPost,
  deleteEntrepreneurProduct,
  loadEntrepreneurWorkspace,
  requestEntrepreneurStand,
  saveEntrepreneurPost,
  saveEntrepreneurProduct,
  updateEntrepreneurProfile,
} from "../../services/entrepreneur-management";
import { InlineNotice } from "../forms/management-form-controls";
import { ManagementRoleFrame } from "../roles/management-role-frame";
import {
  EntrepreneurDashboard,
  type EntrepreneurDashboardAction,
} from "./entrepreneur-dashboard";
import { EntrepreneurFair } from "./entrepreneur-fair";
import {
  toEntrepreneurProfilePatch,
  toUpdateEntrepreneurPostPatch,
  toUpdateProductPatch,
  type EntrepreneurPostDraft,
  type EntrepreneurProfileDraft,
  type ProductDraft,
} from "./entrepreneur-form-models";
import {
  getCurrentStandRequest,
  getEntrepreneurMetrics,
} from "./entrepreneur-models";
import { EntrepreneurPostEditor } from "./entrepreneur-post-editor";
import { EntrepreneurPostList } from "./entrepreneur-post-list";
import { EntrepreneurProfileEditor } from "./entrepreneur-profile-editor";
import { ProductEditor } from "./product-editor";
import { ProductList } from "./product-list";

type EntrepreneurManagerView =
  | { kind: "dashboard" }
  | { kind: "fair" }
  | { kind: "posts" }
  | { kind: "post-editor"; current?: EntrepreneurPost; returnTo: "dashboard" | "posts" }
  | { kind: "products" }
  | { kind: "product-editor"; current?: Product; returnTo: "dashboard" | "products" }
  | { kind: "profile" };

export function EntrepreneurManager({ entrepreneurId }: { entrepreneurId: string }) {
  const load = useCallback(() => loadEntrepreneurWorkspace(entrepreneurId), [entrepreneurId]);
  const resource = useManagementResource(load, entrepreneurId);
  const [view, setView] = useState<EntrepreneurManagerView>({ kind: "dashboard" });
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [requestingStandId, setRequestingStandId] = useState<string | null>(null);
  const [mutationError, setMutationError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const showView = (next: EntrepreneurManagerView) => {
    setMutationError(null);
    setSuccess(null);
    setView(next);
  };

  if (resource.data === null) {
    return (
      <ManagementRoleFrame role="entrepreneur">
        <AppHeader eyebrow="Perfil Emprendedor" subtitle="Leyendo perfil, Marketplace y Feria mediante repositories." title="Preparando escaparate" />
        {resource.error ? (
          <View style={styles.stateBlock}>
            <InlineNotice message={resource.error} />
            <Button label="Reintentar" onPress={() => void resource.refresh()} variant="secondary" />
            <Button label="Elegir otro emprendimiento" onPress={() => router.replace("/roles/entrepreneur")} variant="ghost" />
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
  const currentRequest = getCurrentStandRequest(workspace.requests);
  const currentRequestStand = currentRequest
    ? workspace.stands.find(({ id }) => id === currentRequest.standId)
    : undefined;

  const dashboardAction = (action: EntrepreneurDashboardAction) => {
    showView({ kind: action });
  };

  const saveProfile = async (draft: EntrepreneurProfileDraft) => {
    setSaving(true);
    setMutationError(null);
    try {
      await updateEntrepreneurProfile(entrepreneurId, toEntrepreneurProfilePatch(draft));
      await resource.refresh();
      setSuccess("Perfil actualizado. La app pública reflejará el cambio después de refrescar.");
      setView({ kind: "dashboard" });
    } catch (error) {
      setMutationError(readableManagementError(error));
    } finally {
      setSaving(false);
    }
  };

  const savePost = async (
    draft: EntrepreneurPostDraft,
    isPublished: boolean,
    current?: EntrepreneurPost,
    returnTo: "dashboard" | "posts" = "posts",
  ) => {
    setSaving(true);
    setMutationError(null);
    const now = new Date().toISOString();
    try {
      await saveEntrepreneurPost({
        current,
        draft,
        entrepreneurId,
        isPublished,
        now,
        updatePatch: current
          ? toUpdateEntrepreneurPostPatch(draft, current, isPublished, now)
          : undefined,
      });
      await resource.refresh();
      setSuccess(isPublished ? "Publicación guardada para perfil y Marketplace." : "Borrador guardado en el estado compartido.");
      setView({ kind: returnTo });
    } catch (error) {
      setMutationError(readableManagementError(error));
    } finally {
      setSaving(false);
    }
  };

  const saveProduct = async (
    draft: ProductDraft,
    current?: Product,
    returnTo: "dashboard" | "products" = "products",
  ) => {
    setSaving(true);
    setMutationError(null);
    try {
      await saveEntrepreneurProduct({
        current,
        draft,
        entrepreneurId,
        updatePatch: current ? toUpdateProductPatch(draft) : undefined,
      });
      await resource.refresh();
      setSuccess("Producto guardado. Su visibilidad pública se actualiza al refrescar Marketplace.");
      setView({ kind: returnTo });
    } catch (error) {
      setMutationError(readableManagementError(error));
    } finally {
      setSaving(false);
    }
  };

  const confirmDeletePost = (post: EntrepreneurPost) => {
    Alert.alert("Eliminar publicación", `¿Quieres eliminar “${post.title}”?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => {
          setDeletingId(post.id);
          setMutationError(null);
          void deleteEntrepreneurPost(post.id)
            .then(() => resource.refresh())
            .then(() => setSuccess("Publicación eliminada del estado compartido."))
            .catch((error: unknown) => setMutationError(readableManagementError(error)))
            .finally(() => setDeletingId(null));
        },
      },
    ]);
  };

  const confirmDeleteProduct = (product: Product) => {
    Alert.alert("Eliminar producto", `¿Quieres eliminar “${product.name}”?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => {
          setDeletingId(product.id);
          setMutationError(null);
          void deleteEntrepreneurProduct(product.id)
            .then(() => resource.refresh())
            .then(() => setSuccess("Producto eliminado del estado compartido."))
            .catch((error: unknown) => setMutationError(readableManagementError(error)))
            .finally(() => setDeletingId(null));
        },
      },
    ]);
  };

  const confirmStandRequest = (stand: Stand) => {
    const fair = workspace.fair;
    if (fair === undefined) return;
    Alert.alert(
      "Solicitar mesa",
      `La mesa ${stand.number} quedará pendiente de revisión. No podrás aprobarla desde este perfil.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Solicitar",
          onPress: () => {
            setRequestingStandId(stand.id);
            setMutationError(null);
            void requestEntrepreneurStand({
              entrepreneurId,
              fairId: fair.id,
              standId: stand.id,
            })
              .then(() => resource.refresh())
              .then(() => setSuccess(`Solicitud enviada para la mesa ${stand.number}.`))
              .catch((error: unknown) => setMutationError(readableManagementError(error)))
              .finally(() => setRequestingStandId(null));
          },
        },
      ],
    );
  };

  const back = view.kind === "post-editor"
    ? () => showView({ kind: view.returnTo })
    : view.kind === "product-editor"
      ? () => showView({ kind: view.returnTo })
      : view.kind === "dashboard"
        ? undefined
        : () => showView({ kind: "dashboard" });
  const refreshEnabled = view.kind === "dashboard" || view.kind === "posts" || view.kind === "products" || view.kind === "fair";

  return (
    <ManagementRoleFrame
      backLabel={view.kind === "dashboard" ? undefined : "Volver al dashboard Emprendedor"}
      onBack={back}
      onRefresh={refreshEnabled ? () => void resource.refresh() : undefined}
      refreshing={resource.isRefreshing}
      role="entrepreneur"
    >
      {resource.error ? <InlineNotice message={resource.error} /> : null}
      {mutationError && view.kind !== "post-editor" && view.kind !== "product-editor" && view.kind !== "profile" ? <InlineNotice message={mutationError} /> : null}
      {success ? <InlineNotice message={success} tone="success" /> : null}

      {view.kind === "dashboard" ? (
        <EntrepreneurDashboard
          entrepreneur={workspace.entrepreneur}
          fair={workspace.fair}
          metrics={getEntrepreneurMetrics(workspace.posts, workspace.products)}
          onAction={dashboardAction}
          onChangeEntrepreneur={() => router.replace("/roles/entrepreneur")}
          request={currentRequest}
          requestStand={currentRequestStand}
        />
      ) : null}
      {view.kind === "profile" ? (
        <EntrepreneurProfileEditor entrepreneur={workspace.entrepreneur} error={mutationError} key={workspace.entrepreneur.updatedAt} onSave={(draft) => void saveProfile(draft)} saving={saving} />
      ) : null}
      {view.kind === "posts" ? (
        <EntrepreneurPostList deletingId={deletingId} onCreate={() => showView({ kind: "post-editor", returnTo: "posts" })} onDelete={confirmDeletePost} onEdit={(current) => showView({ kind: "post-editor", current, returnTo: "posts" })} posts={workspace.posts} />
      ) : null}
      {view.kind === "post-editor" ? (
        <EntrepreneurPostEditor error={mutationError} key={view.current?.id ?? "new-entrepreneur-post"} onSave={(draft, publish) => void savePost(draft, publish, view.current, view.returnTo)} post={view.current} saving={saving} />
      ) : null}
      {view.kind === "products" ? (
        <ProductList deletingId={deletingId} onCreate={() => showView({ kind: "product-editor", returnTo: "products" })} onDelete={confirmDeleteProduct} onEdit={(current) => showView({ kind: "product-editor", current, returnTo: "products" })} products={workspace.products} />
      ) : null}
      {view.kind === "product-editor" ? (
        <ProductEditor error={mutationError} key={view.current?.id ?? "new-product"} onSave={(draft) => void saveProduct(draft, view.current, view.returnTo)} product={view.current} saving={saving} />
      ) : null}
      {view.kind === "fair" ? (
        <EntrepreneurFair fair={workspace.fair} onRequest={confirmStandRequest} requestingStandId={requestingStandId} requests={workspace.requests} stands={workspace.stands} />
      ) : null}
    </ManagementRoleFrame>
  );
}

const styles = StyleSheet.create({
  stateBlock: { gap: spacing.md },
  skeletons: { gap: spacing.md },
});
