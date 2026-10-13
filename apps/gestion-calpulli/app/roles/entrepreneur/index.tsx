import { router, type Href } from "expo-router";
import { useCallback } from "react";

import { EntrepreneurSelector } from "../../../features/entrepreneurs/entrepreneur-selector";
import { ManagementRoleFrame } from "../../../features/roles/management-role-frame";
import { useManagementResource } from "../../../hooks/use-management-resource";
import { listDemoEntrepreneurs } from "../../../services/entrepreneur-management";

export default function EntrepreneurSelectorScreen() {
  const load = useCallback(() => listDemoEntrepreneurs(), []);
  const resource = useManagementResource(load, "demo-entrepreneurs");

  return (
    <ManagementRoleFrame onRefresh={() => void resource.refresh()} refreshing={resource.isRefreshing} role="entrepreneur">
      <EntrepreneurSelector
        entrepreneurs={resource.data}
        error={resource.error}
        isLoading={resource.isLoading}
        onRetry={() => void resource.refresh()}
        onSelect={(entrepreneur) => router.push(
          `/roles/entrepreneur/${encodeURIComponent(entrepreneur.id)}` as Href,
        )}
      />
    </ManagementRoleFrame>
  );
}
