import type {
  AppConfiguration,
  AppThemePreference,
  Department,
  Fair,
  SharedCalpulliState,
  SharedMeta,
} from "@calpulli/domain";
import type {
  CreateDepartmentInput,
  UpdateConfigurationInput,
  UpdateDepartmentInput,
} from "@calpulli/repositories";
import {
  selectActiveFair,
  selectUpcomingFair,
} from "@calpulli/repositories";
import type { SharedStateSource } from "@calpulli/shared-store";

export interface SuperadminMetrics {
  activeDepartments: number;
  activeEntrepreneurs: number;
  activeTutors: number;
  assignedStands: number;
  departments: number;
  pendingRequests: number;
  publishedPosts: number;
}

export interface SuperadminWorkspace {
  configuration: AppConfiguration;
  departments: Department[];
  fair?: Fair;
  meta: SharedMeta;
  metrics: SuperadminMetrics;
  source: SharedStateSource;
}

export interface ConfigurationDraft {
  defaultTheme: AppThemePreference;
  demoMode: boolean;
  institutionName: string;
  managementAppName: string;
  publicAppName: string;
}

export interface SuperadminDepartmentDraft {
  description: string;
  isActive: boolean;
  name: string;
  shortName: string;
}

export class SuperadminFormError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SuperadminFormError";
  }
}

function required(value: string, fieldLabel: string): string {
  const normalized = value.trim();
  if (normalized.length === 0) {
    throw new SuperadminFormError(`${fieldLabel} es obligatorio.`);
  }
  return normalized;
}

function optional(value: string): string | undefined {
  const normalized = value.trim();
  return normalized.length === 0 ? undefined : normalized;
}

export function createSuperadminWorkspace(
  state: SharedCalpulliState,
  source: SharedStateSource,
): SuperadminWorkspace {
  return {
    configuration: state.configuration,
    departments: [...state.departments].sort((left, right) =>
      left.name.localeCompare(right.name, "es-MX"),
    ),
    fair: selectActiveFair(state) ?? selectUpcomingFair(state),
    meta: state.meta,
    metrics: {
      activeDepartments: state.departments.filter(({ isActive }) => isActive).length,
      activeEntrepreneurs: state.entrepreneurs.filter(({ isActive }) => isActive).length,
      activeTutors: state.tutors.filter(({ isActive }) => isActive).length,
      assignedStands: state.stands.filter(({ status }) => status === "assigned").length,
      departments: state.departments.length,
      pendingRequests: state.standRequests.filter(({ status }) => status === "pending").length,
      publishedPosts: state.institutionalPosts.filter(({ isPublished }) => isPublished).length,
    },
    source,
  };
}

export function createConfigurationDraft(
  configuration: AppConfiguration,
): ConfigurationDraft {
  return {
    defaultTheme: configuration.defaultTheme,
    demoMode: configuration.demoMode,
    institutionName: configuration.institutionName,
    managementAppName: configuration.managementAppName,
    publicAppName: configuration.publicAppName,
  };
}

export function toConfigurationPatch(
  draft: ConfigurationDraft,
): UpdateConfigurationInput {
  return {
    defaultTheme: draft.defaultTheme,
    demoMode: draft.demoMode,
    institutionName: required(draft.institutionName, "El nombre institucional"),
    managementAppName: required(draft.managementAppName, "El nombre de Gestión"),
    publicAppName: required(draft.publicAppName, "El nombre de la app pública"),
  };
}

export function createSuperadminDepartmentDraft(
  department?: Department,
): SuperadminDepartmentDraft {
  return {
    description: department?.description ?? "",
    isActive: department?.isActive ?? true,
    name: department?.name ?? "",
    shortName: department?.shortName ?? "",
  };
}

function departmentEditableFields(
  draft: SuperadminDepartmentDraft,
): Pick<Department, "description" | "isActive" | "name" | "shortName"> {
  return {
    description: optional(draft.description),
    isActive: draft.isActive,
    name: required(draft.name, "El nombre del departamento"),
    shortName: optional(draft.shortName),
  };
}

export function toCreateDepartmentInput(
  draft: SuperadminDepartmentDraft,
): CreateDepartmentInput {
  return {
    ...departmentEditableFields(draft),
    accentToken: "jade",
    contact: [],
    logoKey: "departments/demo-area",
  };
}

export function toUpdateDepartmentInput(
  draft: SuperadminDepartmentDraft,
): UpdateDepartmentInput {
  return departmentEditableFields(draft);
}
