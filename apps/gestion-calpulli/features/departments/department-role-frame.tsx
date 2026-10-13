import type { ComponentProps } from "react";

import {
  ManagementRoleFrame,
} from "../roles/management-role-frame";

type DepartmentRoleFrameProps = Omit<
  ComponentProps<typeof ManagementRoleFrame>,
  "role"
>;

export function DepartmentRoleFrame(props: DepartmentRoleFrameProps) {
  return <ManagementRoleFrame {...props} role="department" />;
}
