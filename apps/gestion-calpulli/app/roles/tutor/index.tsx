import { router, type Href } from "expo-router";
import { useCallback } from "react";

import { TutorSelector } from "../../../features/tutors/tutor-selector";
import { ManagementRoleFrame } from "../../../features/roles/management-role-frame";
import { useManagementResource } from "../../../hooks/use-management-resource";
import { listDemoTutors } from "../../../services/tutor-management";

export default function TutorSelectorScreen() {
  const load = useCallback(() => listDemoTutors(), []);
  const resource = useManagementResource(load, "demo-tutors");

  return (
    <ManagementRoleFrame onRefresh={() => void resource.refresh()} refreshing={resource.isRefreshing} role="tutor">
      <TutorSelector
        error={resource.error}
        isLoading={resource.isLoading}
        onRetry={() => void resource.refresh()}
        onSelect={(tutor) => router.push(
          `/roles/tutor/${encodeURIComponent(tutor.id)}` as Href,
        )}
        tutors={resource.data}
      />
    </ManagementRoleFrame>
  );
}
