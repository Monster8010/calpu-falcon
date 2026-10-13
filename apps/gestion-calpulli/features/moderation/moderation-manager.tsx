import { AppHeader, Button, Skeleton, spacing } from "@calpulli/ui";
import { useCallback, useMemo, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";

import {
  readableManagementError,
  useManagementResource,
} from "../../hooks/use-management-resource";
import {
  loadModerationWorkspace,
  setContentHiddenByModerator,
} from "../../services/moderation-management";
import { InlineNotice } from "../forms/management-form-controls";
import { ManagementRoleFrame } from "../roles/management-role-frame";
import { ModerationContentDetail } from "./moderation-content-detail";
import { ModeratorDashboard } from "./moderation-dashboard";
import type {
  ModerationFilter,
  ModerationListItem,
} from "./moderation-models";

export function ModerationManager() {
  const load = useCallback(() => loadModerationWorkspace(), []);
  const resource = useManagementResource(load, "moderation-workspace");
  const [filter, setFilter] = useState<ModerationFilter>("all");
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [mutatingKey, setMutatingKey] = useState<string | null>(null);
  const [mutationError, setMutationError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const selected = useMemo(() => {
    if (selectedKey === null || resource.data === null) return undefined;
    return resource.data.items.find(
      (item) => `${item.kind}:${item.id}` === selectedKey,
    );
  }, [resource.data, selectedKey]);

  const openDetail = (item: ModerationListItem) => {
    setMutationError(null);
    setSuccess(null);
    setSelectedKey(`${item.kind}:${item.id}`);
  };

  const applyVisibility = async (
    item: ModerationListItem,
    hidden: boolean,
  ) => {
    setMutatingKey(`${item.kind}:${item.id}`);
    setMutationError(null);
    setSuccess(null);
    try {
      await setContentHiddenByModerator({ hidden, id: item.id, kind: item.kind });
      await resource.refresh();
      setSuccess(
        hidden
          ? "Publicación ocultada. Dejará de aparecer en la app pública después de refrescar."
          : "Publicación restaurada. Si está publicada y su propietario está activo, volverá después de refrescar.",
      );
    } catch (error) {
      setMutationError(readableManagementError(error));
    } finally {
      setMutatingKey(null);
    }
  };

  const confirmVisibility = (
    item: ModerationListItem,
    hidden: boolean,
  ) => {
    Alert.alert(
      hidden ? "Ocultar publicación" : "Restaurar publicación",
      hidden
        ? `¿Quieres ocultar “${item.title}”? No se eliminará y podrás restaurarla.`
        : `¿Quieres restaurar “${item.title}”? Su estado de publicación no cambiará.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: hidden ? "Ocultar" : "Restaurar",
          style: hidden ? "destructive" : "default",
          onPress: () => void applyVisibility(item, hidden),
        },
      ],
    );
  };

  if (resource.data === null) {
    return (
      <ManagementRoleFrame role="moderator">
        <AppHeader
          eyebrow="Moderación posterior"
          subtitle="Leyendo publicaciones mediante repositories."
          title="Preparando contenido"
        />
        {resource.error ? (
          <View style={styles.stateBlock}>
            <InlineNotice message={resource.error} />
            <Button label="Reintentar" onPress={() => void resource.refresh()} variant="secondary" />
          </View>
        ) : (
          <View style={styles.skeletons}>
            <Skeleton height={168} radius="md" />
            <Skeleton height={126} radius="md" />
            <Skeleton height={220} radius="md" />
          </View>
        )}
      </ManagementRoleFrame>
    );
  }

  return (
    <ManagementRoleFrame
      backLabel={selected ? "Volver a contenido" : undefined}
      onBack={selected ? () => setSelectedKey(null) : undefined}
      onRefresh={selected ? undefined : () => void resource.refresh()}
      refreshing={resource.isRefreshing}
      role="moderator"
    >
      {resource.error ? <InlineNotice message={resource.error} /> : null}
      {mutationError ? <InlineNotice message={mutationError} /> : null}
      {mutatingKey ? <InlineNotice message="Guardando cambio de moderación..." tone="info" /> : null}
      {success ? <InlineNotice message={success} tone="success" /> : null}

      {selected ? (
        <ModerationContentDetail
          item={selected}
          mutating={mutatingKey === `${selected.kind}:${selected.id}`}
          onSetHidden={(hidden) => confirmVisibility(selected, hidden)}
        />
      ) : (
        <ModeratorDashboard
          filter={filter}
          items={resource.data.items}
          metrics={resource.data.metrics}
          mutatingKey={mutatingKey}
          onChangeFilter={setFilter}
          onOpen={openDetail}
          onSetHidden={confirmVisibility}
        />
      )}
    </ManagementRoleFrame>
  );
}

const styles = StyleSheet.create({
  stateBlock: { gap: spacing.md },
  skeletons: { gap: spacing.md },
});
