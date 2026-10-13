import type { ID, Story } from "@calpulli/domain";

import { DEPARTMENT_IDS } from "./departments";
import type { DemoSeedContext } from "./seed-context";
import { bundledMedia } from "./seed-helpers";

interface StorySpec {
  departmentId: ID;
  title: string;
  body: string;
  startsInHours: number;
  expiresInHours: number;
  views: number;
  mediaKey: string;
}

const STORY_SPECS: readonly StorySpec[] = [
  {
    departmentId: DEPARTMENT_IDS.culture,
    title: "Taller creativo",
    body: "Inscripciones abiertas para la sesión de gráfica universitaria.",
    startsInHours: -8,
    expiresInHours: 20,
    views: 162,
    mediaKey: "stories/cultura-taller",
  },
  {
    departmentId: DEPARTMENT_IDS.scholarships,
    title: "Último día",
    body: "Revisa el recordatorio ficticio de entrega documental.",
    startsInHours: -5,
    expiresInHours: 7,
    views: 294,
    mediaKey: "stories/becas-fecha-limite",
  },
  {
    departmentId: DEPARTMENT_IDS.library,
    title: "Horario extendido",
    body: "Más tiempo para estudiar durante la semana de evaluaciones.",
    startsInHours: -12,
    expiresInHours: 36,
    views: 218,
    mediaKey: "stories/biblioteca-horario",
  },
  {
    departmentId: DEPARTMENT_IDS.sports,
    title: "Partido amistoso",
    body: "Acompaña a la comunidad en la cancha techada.",
    startsInHours: -3,
    expiresInHours: 18,
    views: 127,
    mediaKey: "stories/deportes-partido",
  },
  {
    departmentId: DEPARTMENT_IDS.entrepreneurship,
    title: "Feria Calpulli",
    body: "Conoce la próxima fecha y prepara tu recorrido.",
    startsInHours: -10,
    expiresInHours: 48,
    views: 351,
    mediaKey: "stories/emprendimiento-feria",
  },
  {
    departmentId: DEPARTMENT_IDS.tutoring,
    title: "Convocatoria de tutores",
    body: "Comparte una materia que dominas con otros estudiantes.",
    startsInHours: -6,
    expiresInHours: 30,
    views: 238,
    mediaKey: "stories/tutorias-convocatoria",
  },
  {
    departmentId: DEPARTMENT_IDS.medicalService,
    title: "Bienestar diario",
    body: "Haz una pausa breve, hidrátate y continúa tu jornada.",
    startsInHours: -2,
    expiresInHours: 22,
    views: 184,
    mediaKey: "stories/servicio-medico-bienestar",
  },
  {
    departmentId: DEPARTMENT_IDS.schoolManagement,
    title: "Optativas",
    body: "Consulta las fechas ficticias del periodo de registro.",
    startsInHours: -4,
    expiresInHours: 16,
    views: 309,
    mediaKey: "stories/gestion-escolar-optativas",
  },
  {
    departmentId: DEPARTMENT_IDS.graduateStudies,
    title: "Próxima sesión",
    body: "La sesión informativa estará disponible mañana.",
    startsInHours: 12,
    expiresInHours: 40,
    views: 0,
    mediaKey: "stories/posgrado-proxima-sesion",
  },
  {
    departmentId: DEPARTMENT_IDS.direction,
    title: "Aviso concluido",
    body: "Historia expirada incluida para comprobar el filtrado temporal.",
    startsInHours: -48,
    expiresInHours: -24,
    views: 411,
    mediaKey: "stories/direccion-aviso-concluido",
  },
];

export function createDemoStories(context: DemoSeedContext): Story[] {
  return STORY_SPECS.map((story, index) => ({
    id: `story-${String(index + 1).padStart(3, "0")}`,
    departmentId: story.departmentId,
    title: story.title,
    body: story.body,
    media: [bundledMedia(story.mediaKey)],
    views: story.views,
    startsAt: context.atHours(story.startsInHours),
    expiresAt: context.atHours(story.expiresInHours),
    isActive: true,
    createdAt: context.atHours(Math.min(story.startsInHours - 2, -1)),
    updatedAt: context.referenceTime,
  }));
}
