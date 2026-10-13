import { router } from "expo-router";
import { useCallback } from "react";

import { DepartmentRoleFrame } from "../../../features/departments/department-role-frame";
import { DepartmentSelector } from "../../../features/departments/department-selector";
import { useManagementResource } from "../../../hooks/use-management-resource";
import { listDemoDepartments } from "../../../services/department-management";

export default function DepartmentSelectorScreen() {
  const load = useCallback(() => listDemoDepartments(), []);
  const resource = useManagementResource(load, "demo-departments");

  return (
    <DepartmentRoleFrame onRefresh={() => void resource.refresh()} refreshing={resource.isRefreshing}>
      <DepartmentSelector
        departments={resource.data}
        error={resource.error}
        isLoading={resource.isLoading}
        onRetry={() => void resource.refresh()}
        onSelect={(department) => router.push({
          pathname: "/roles/department/[departmentId]",
          params: { departmentId: department.id },
        })}
      />
    </DepartmentRoleFrame>
  );
}
