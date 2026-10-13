import { Redirect, useLocalSearchParams } from "expo-router";

import { DepartmentManager } from "../../../../features/departments/department-manager";

export default function DepartmentManagerScreen() {
  const params = useLocalSearchParams<{ departmentId?: string | string[] }>();
  const departmentId = Array.isArray(params.departmentId)
    ? params.departmentId[0]
    : params.departmentId;

  if (departmentId === undefined || departmentId.trim().length === 0) {
    return <Redirect href="/roles/department" />;
  }

  return <DepartmentManager departmentId={departmentId} />;
}
