import type { AppRole } from "@calpulli/domain";

export type ManagementAccent =
  | "jade"
  | "turquoise"
  | "mayaBlue"
  | "mexicanPink"
  | "cempasuchil"
  | "cochineal";

export type ManagementIconName =
  | "business-outline"
  | "calendar-outline"
  | "clipboard-outline"
  | "document-text-outline"
  | "grid-outline"
  | "megaphone-outline"
  | "people-outline"
  | "person-outline"
  | "school-outline"
  | "settings-outline"
  | "shield-checkmark-outline"
  | "storefront-outline";

export interface DashboardAreaDefinition {
  description: string;
  icon: ManagementIconName;
  title: string;
}

export interface DemoRoleDefinition {
  accent: ManagementAccent;
  areas: readonly DashboardAreaDefinition[];
  icon: ManagementIconName;
  label: string;
  role: AppRole;
  summary: string;
}

export const DEMO_ROLE_DEFINITIONS: readonly DemoRoleDefinition[] = [
  {
    role: "superadmin",
    label: "Superadministrador",
    icon: "settings-outline",
    accent: "jade",
    summary: "Resumen del sistema, configuración y herramientas de demostración.",
    areas: [
      { title: "Resumen del sistema", description: "Métricas generales y acceso a entidades.", icon: "grid-outline" },
      { title: "Configuración", description: "Identidad y parámetros compartidos del MVP.", icon: "settings-outline" },
      { title: "Datos de demostración", description: "Diagnóstico y restauración controlada del estado.", icon: "clipboard-outline" },
    ],
  },
  {
    role: "fair-admin",
    label: "Administrador de Feria",
    icon: "calendar-outline",
    accent: "cempasuchil",
    summary: "Fechas, mapa, solicitudes y asignación de stands.",
    areas: [
      { title: "Estado de feria", description: "Próxima fecha y estado de la edición.", icon: "calendar-outline" },
      { title: "Mapa y stands", description: "Distribución administrativa de las 40 mesas.", icon: "grid-outline" },
      { title: "Solicitudes", description: "Revisión de solicitudes y asignaciones.", icon: "clipboard-outline" },
    ],
  },
  {
    role: "department",
    label: "Departamento",
    icon: "business-outline",
    accent: "mayaBlue",
    summary: "Perfil institucional, publicaciones e historias del departamento.",
    areas: [
      { title: "Perfil del departamento", description: "Identidad y datos públicos del área.", icon: "business-outline" },
      { title: "Publicaciones", description: "Avisos institucionales y su visibilidad.", icon: "document-text-outline" },
      { title: "Historias", description: "Contenido temporal para la app pública.", icon: "megaphone-outline" },
    ],
  },
  {
    role: "entrepreneur",
    label: "Emprendedor",
    icon: "storefront-outline",
    accent: "mexicanPink",
    summary: "Perfil, publicaciones, productos y participación en la feria.",
    areas: [
      { title: "Perfil y catálogo", description: "Identidad, publicaciones y productos.", icon: "storefront-outline" },
      { title: "Feria", description: "Mapa y selección de una mesa disponible.", icon: "grid-outline" },
      { title: "Estado de solicitud", description: "Seguimiento de la solicitud actual.", icon: "clipboard-outline" },
    ],
  },
  {
    role: "tutor",
    label: "Tutor",
    icon: "school-outline",
    accent: "turquoise",
    summary: "Perfil, materias, modalidades y contacto externo.",
    areas: [
      { title: "Perfil de tutor", description: "Presentación pública y modalidades.", icon: "person-outline" },
      { title: "Materias", description: "Ofertas, disponibilidad y estado público.", icon: "school-outline" },
      { title: "Contacto externo", description: "Canales públicos para continuar fuera de Calpulli.", icon: "people-outline" },
    ],
  },
  {
    role: "moderator",
    label: "Moderador",
    icon: "shield-checkmark-outline",
    accent: "cochineal",
    summary: "Moderación posterior de contenido institucional y emprendedor.",
    areas: [
      { title: "Contenido institucional", description: "Publicaciones visibles y ocultas.", icon: "document-text-outline" },
      { title: "Emprendimientos", description: "Contenido público de la comunidad emprendedora.", icon: "storefront-outline" },
      { title: "Moderación posterior", description: "Ocultar o restaurar sin aprobación previa.", icon: "shield-checkmark-outline" },
    ],
  },
];

const DEMO_ROLE_SET: ReadonlySet<string> = new Set(
  DEMO_ROLE_DEFINITIONS.map(({ role }) => role),
);

export function isDemoRole(value: unknown): value is AppRole {
  return typeof value === "string" && DEMO_ROLE_SET.has(value);
}

export function getDemoRoleDefinition(
  role: AppRole,
): DemoRoleDefinition {
  const definition = DEMO_ROLE_DEFINITIONS.find((item) => item.role === role);

  if (definition === undefined) {
    throw new Error(`No existe una definición visual para el rol ${role}.`);
  }

  return definition;
}
