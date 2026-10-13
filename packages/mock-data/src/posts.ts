import type {
  ID,
  InstitutionalPost,
  InstitutionalPostVisibility,
  PostPriority,
} from "@calpulli/domain";

import { DEPARTMENT_IDS } from "./departments";
import type { DemoSeedContext } from "./seed-context";
import { bundledMedia } from "./seed-helpers";

interface InstitutionalPostSpec {
  departmentId: ID;
  title: string;
  body: string;
  priority: PostPriority;
  hoursAgo: number;
  views: number;
  location?: string;
  mediaKey?: string;
  documentKey?: string;
  showLocation?: boolean;
}

const DEFAULT_VISIBILITY: InstitutionalPostVisibility = {
  showDepartment: true,
  showLocation: true,
  showMedia: true,
  showDate: true,
  showViews: true,
};

const POST_SPECS: readonly InstitutionalPostSpec[] = [
  {
    departmentId: DEPARTMENT_IDS.direction,
    title: "Bienvenida a las actividades de la semana",
    body:
      "Consulta los avisos de cada área y organiza tus actividades académicas desde un solo espacio.",
    priority: "featured",
    hoursAgo: 3,
    views: 428,
    mediaKey: "posts/direccion-bienvenida",
  },
  {
    departmentId: DEPARTMENT_IDS.direction,
    title: "Recorrido de orientación por servicios del plantel",
    body:
      "Habrá un recorrido breve para conocer módulos de atención, biblioteca y espacios deportivos.",
    priority: "normal",
    hoursAgo: 192,
    views: 173,
    location: "Explanada principal",
  },
  {
    departmentId: DEPARTMENT_IDS.schoolManagement,
    title: "Registro de optativas del periodo",
    body:
      "El registro de optativas estará disponible durante tres días. Revisa previamente cupos y seriación.",
    priority: "important",
    hoursAgo: 5,
    views: 612,
    location: "Ventanillas de Gestión Escolar",
    documentKey: "documents/registro-optativas",
  },
  {
    departmentId: DEPARTMENT_IDS.schoolManagement,
    title: "Consulta de horarios actualizados",
    body:
      "Ya puedes revisar los ajustes de aula y horario correspondientes a esta semana académica.",
    priority: "normal",
    hoursAgo: 31,
    views: 355,
  },
  {
    departmentId: DEPARTMENT_IDS.schoolManagement,
    title: "Orientación para constancias de estudio",
    body:
      "Conoce los requisitos ficticios de la demo para solicitar constancias y dar seguimiento al trámite.",
    priority: "normal",
    hoursAgo: 360,
    views: 96,
  },
  {
    departmentId: DEPARTMENT_IDS.library,
    title: "Extensión de horario por semana de evaluaciones",
    body:
      "La biblioteca ampliará su horario para facilitar consulta, estudio individual y trabajo colaborativo.",
    priority: "important",
    hoursAgo: 9,
    views: 487,
    location: "Biblioteca UPIICSA",
    mediaKey: "posts/biblioteca-horario",
  },
  {
    departmentId: DEPARTMENT_IDS.library,
    title: "Selección mensual de recursos digitales",
    body:
      "Explora una selección ficticia de lecturas sobre innovación, administración y tecnología.",
    priority: "normal",
    hoursAgo: 54,
    views: 204,
    mediaKey: "posts/biblioteca-recursos",
  },
  {
    departmentId: DEPARTMENT_IDS.medicalService,
    title: "Jornada preventiva de salud",
    body:
      "Acércate para recibir orientación preventiva y conocer hábitos sencillos para cuidar tu bienestar.",
    priority: "urgent",
    hoursAgo: 2,
    views: 731,
    location: "Servicio Médico",
    mediaKey: "posts/servicio-medico-jornada",
  },
  {
    departmentId: DEPARTMENT_IDS.medicalService,
    title: "Pausa activa entre clases",
    body:
      "Te compartimos una rutina breve de movilidad para realizar entre sesiones prolongadas de estudio.",
    priority: "normal",
    hoursAgo: 46,
    views: 189,
  },
  {
    departmentId: DEPARTMENT_IDS.culture,
    title: "Convocatoria para muestra de fotografía universitaria",
    body:
      "Participa con una serie de hasta tres imágenes sobre comunidad, aprendizaje y vida cotidiana.",
    priority: "featured",
    hoursAgo: 7,
    views: 392,
    location: "Galería del edificio cultural",
    mediaKey: "posts/cultura-fotografia",
  },
  {
    departmentId: DEPARTMENT_IDS.culture,
    title: "Taller abierto de gráfica y composición",
    body:
      "Sesión introductoria para experimentar con formas, color y narrativas visuales contemporáneas.",
    priority: "normal",
    hoursAgo: 66,
    views: 158,
    location: "Aula de actividades culturales",
  },
  {
    departmentId: DEPARTMENT_IDS.sports,
    title: "Entrenamiento abierto de voleibol",
    body:
      "El equipo universitario realizará una práctica abierta para estudiantes de todos los semestres.",
    priority: "featured",
    hoursAgo: 12,
    views: 344,
    location: "Cancha techada",
    mediaKey: "posts/deportes-voleibol",
  },
  {
    departmentId: DEPARTMENT_IDS.sports,
    title: "Ruta recreativa de acondicionamiento",
    body:
      "Únete a una sesión moderada de acondicionamiento y convivencia dentro de las instalaciones.",
    priority: "normal",
    hoursAgo: 120,
    views: 142,
    location: "Pista exterior",
  },
  {
    departmentId: DEPARTMENT_IDS.scholarships,
    title: "Recordatorio de entrega documental",
    body:
      "Verifica que tu expediente ficticio de demostración incluya todos los documentos señalados.",
    priority: "urgent",
    hoursAgo: 1,
    views: 816,
    documentKey: "documents/recordatorio-becas",
  },
  {
    departmentId: DEPARTMENT_IDS.scholarships,
    title: "Sesión de orientación sobre apoyos estudiantiles",
    body:
      "Resuelve dudas generales sobre convocatorias, calendarios y seguimiento de solicitudes.",
    priority: "normal",
    hoursAgo: 42,
    views: 267,
    location: "Sala de orientación",
  },
  {
    departmentId: DEPARTMENT_IDS.entrepreneurship,
    title: "Próxima Feria de Emprendimiento",
    body:
      "Conoce proyectos creados por la comunidad y prepárate para recorrer las mesas de la próxima feria.",
    priority: "important",
    hoursAgo: 4,
    views: 654,
    location: "Explanada principal",
    mediaKey: "posts/emprendimiento-feria",
  },
  {
    departmentId: DEPARTMENT_IDS.entrepreneurship,
    title: "Laboratorio de ideas para proyectos estudiantiles",
    body:
      "Una sesión práctica para convertir problemas cotidianos en propuestas claras y comprobables.",
    priority: "featured",
    hoursAgo: 28,
    views: 318,
    location: "Aula de innovación",
  },
  {
    departmentId: DEPARTMENT_IDS.entrepreneurship,
    title: "Guía breve para presentar tu proyecto",
    body:
      "Organiza en pocos minutos el propósito, público y siguiente paso de tu iniciativa universitaria.",
    priority: "normal",
    hoursAgo: 240,
    views: 221,
    mediaKey: "posts/emprendimiento-guia",
  },
  {
    departmentId: DEPARTMENT_IDS.graduateStudies,
    title: "Sesión informativa de programas de especialidad",
    body:
      "Conoce líneas académicas, perfiles de ingreso y el calendario ficticio preparado para esta demo.",
    priority: "important",
    hoursAgo: 17,
    views: 286,
    location: "Auditorio de Posgrado",
    mediaKey: "posts/posgrado-sesion",
  },
  {
    departmentId: DEPARTMENT_IDS.graduateStudies,
    title: "Conversatorio sobre investigación aplicada",
    body:
      "Docentes y estudiantes compartirán experiencias sobre proyectos interdisciplinarios.",
    priority: "normal",
    hoursAgo: 70,
    views: 134,
  },
  {
    departmentId: DEPARTMENT_IDS.tutoring,
    title: "Registro de alumnos tutores",
    body:
      "Si deseas compartir tus conocimientos, registra materias, modalidad y disponibilidad general.",
    priority: "featured",
    hoursAgo: 14,
    views: 503,
    mediaKey: "posts/tutorias-registro",
  },
  {
    departmentId: DEPARTMENT_IDS.tutoring,
    title: "Estrategias para preparar una sesión de estudio",
    body:
      "Define un objetivo pequeño, reúne ejemplos y reserva un bloque sin interrupciones.",
    priority: "normal",
    hoursAgo: 58,
    views: 247,
  },
];

export function createDemoInstitutionalPosts(
  context: DemoSeedContext,
): InstitutionalPost[] {
  return POST_SPECS.map((post, index) => {
    const publishedAt = context.atHours(-post.hoursAgo);

    return {
      id: `institutional-post-${String(index + 1).padStart(3, "0")}`,
      departmentId: post.departmentId,
      title: post.title,
      body: post.body,
      priority: post.priority,
      publishedAt,
      location: post.location,
      media: post.mediaKey === undefined ? [] : [bundledMedia(post.mediaKey)],
      document:
        post.documentKey === undefined
          ? undefined
          : bundledMedia(post.documentKey),
      views: post.views,
      visibility: {
        ...DEFAULT_VISIBILITY,
        showLocation: post.showLocation ?? post.location !== undefined,
      },
      isPublished: true,
      isHiddenByModerator: false,
      createdAt: context.atHours(-post.hoursAgo - 2),
      updatedAt: publishedAt,
    };
  });
}
