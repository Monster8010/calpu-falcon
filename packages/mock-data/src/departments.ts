import type { Department } from "@calpulli/domain";

import type { DemoSeedContext } from "./seed-context";

export const DEPARTMENT_IDS = {
  direction: "department-direccion",
  schoolManagement: "department-gestion-escolar",
  library: "department-biblioteca",
  medicalService: "department-servicio-medico",
  culture: "department-cultura",
  sports: "department-deportes",
  scholarships: "department-becas",
  entrepreneurship: "department-emprendimiento",
  graduateStudies: "department-posgrado",
  tutoring: "department-tutorias",
} as const;

const DEPARTMENT_SPECS = [
  {
    id: DEPARTMENT_IDS.direction,
    name: "Dirección",
    shortName: "Dirección",
    description:
      "Coordinación institucional y comunicación general de la comunidad UPIICSA.",
    logoKey: "departments/direccion",
    accentToken: "mayaBlue",
  },
  {
    id: DEPARTMENT_IDS.schoolManagement,
    name: "Gestión Escolar",
    shortName: "Escolar",
    description:
      "Información académica, trámites y acompañamiento de la trayectoria escolar.",
    logoKey: "departments/gestion-escolar",
    accentToken: "turquoise",
  },
  {
    id: DEPARTMENT_IDS.library,
    name: "Biblioteca",
    shortName: "Biblioteca",
    description:
      "Servicios de consulta, préstamo y recursos para el aprendizaje universitario.",
    logoKey: "departments/biblioteca",
    accentToken: "jade",
  },
  {
    id: DEPARTMENT_IDS.medicalService,
    name: "Servicio Médico",
    shortName: "Médico",
    description:
      "Orientación preventiva y atención básica para la comunidad estudiantil.",
    logoKey: "departments/servicio-medico",
    accentToken: "cochineal",
  },
  {
    id: DEPARTMENT_IDS.culture,
    name: "Cultura",
    shortName: "Cultura",
    description:
      "Talleres, exposiciones y actividades para la expresión artística universitaria.",
    logoKey: "departments/cultura",
    accentToken: "mexicanPink",
  },
  {
    id: DEPARTMENT_IDS.sports,
    name: "Deportes",
    shortName: "Deportes",
    description:
      "Entrenamientos, torneos y actividades para una vida universitaria activa.",
    logoKey: "departments/deportes",
    accentToken: "cempasuchil",
  },
  {
    id: DEPARTMENT_IDS.scholarships,
    name: "Becas",
    shortName: "Becas",
    description:
      "Convocatorias y orientación para apoyos económicos y académicos.",
    logoKey: "departments/becas",
    accentToken: "mayaBlue",
  },
  {
    id: DEPARTMENT_IDS.entrepreneurship,
    name: "Emprendimiento",
    shortName: "Emprende",
    description:
      "Impulso a proyectos estudiantiles, colaboración y cultura emprendedora.",
    logoKey: "departments/emprendimiento",
    accentToken: "jade",
  },
  {
    id: DEPARTMENT_IDS.graduateStudies,
    name: "Posgrado",
    shortName: "Posgrado",
    description:
      "Difusión de especialidades, investigación y continuidad académica.",
    logoKey: "departments/posgrado",
    accentToken: "turquoise",
  },
  {
    id: DEPARTMENT_IDS.tutoring,
    name: "Tutorías",
    shortName: "Tutorías",
    description:
      "Vinculación entre estudiantes para reforzar materias y hábitos de estudio.",
    logoKey: "departments/tutorias",
    accentToken: "mexicanPink",
  },
] as const;

export function createDemoDepartments(
  context: DemoSeedContext,
): Department[] {
  return DEPARTMENT_SPECS.map((department, index) => ({
    ...department,
    contact: [
      {
        id: `contact-department-${String(index + 1).padStart(2, "0")}`,
        type: "email",
        label: "Correo de demostración",
        value: `${department.id.replace("department-", "")}@calpulli.demo`,
      },
    ],
    isActive: true,
    createdAt: context.atDays(-60),
    updatedAt: context.atDays(-1),
  }));
}
