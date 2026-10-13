import type {
  Entrepreneur,
  Fair,
  InstitutionalPost,
  Stand,
  StandRequest,
  Story,
} from "../src/index";

export const REFERENCE_TIME = "2026-08-10T12:00:00.000Z";

export function createInstitutionalPost(
  overrides: Partial<InstitutionalPost> = {},
): InstitutionalPost {
  return {
    id: "post-1",
    departmentId: "department-1",
    title: "Aviso de prueba",
    body: "Contenido de prueba",
    priority: "normal",
    publishedAt: "2026-08-10T10:00:00.000Z",
    media: [],
    views: 10,
    visibility: {
      showDepartment: true,
      showLocation: true,
      showMedia: true,
      showDate: true,
      showViews: true,
    },
    isPublished: true,
    isHiddenByModerator: false,
    createdAt: "2026-08-10T09:00:00.000Z",
    updatedAt: "2026-08-10T10:00:00.000Z",
    ...overrides,
  };
}

export function createStory(overrides: Partial<Story> = {}): Story {
  return {
    id: "story-1",
    departmentId: "department-1",
    title: "Historia de prueba",
    media: [],
    views: 5,
    startsAt: "2026-08-10T11:00:00.000Z",
    expiresAt: "2026-08-10T13:00:00.000Z",
    isActive: true,
    createdAt: "2026-08-10T10:00:00.000Z",
    updatedAt: "2026-08-10T10:00:00.000Z",
    ...overrides,
  };
}

export function createFair(overrides: Partial<Fair> = {}): Fair {
  return {
    id: "fair-1",
    name: "Feria Calpulli",
    status: "upcoming",
    nextDate: "2026-08-12T16:00:00.000Z",
    recurrenceHintDays: 15,
    recurrenceHintWeekday: 3,
    createdAt: "2026-08-01T12:00:00.000Z",
    updatedAt: "2026-08-10T12:00:00.000Z",
    ...overrides,
  };
}

export function createStand(overrides: Partial<Stand> = {}): Stand {
  return {
    id: "stand-1",
    fairId: "fair-1",
    number: 1,
    coordinate: {
      row: 0,
      column: 0,
      branch: "top",
      order: 1,
    },
    status: "available",
    updatedAt: "2026-08-10T12:00:00.000Z",
    ...overrides,
  };
}

export function createStandRequest(
  overrides: Partial<StandRequest> = {},
): StandRequest {
  return {
    id: "request-1",
    fairId: "fair-1",
    standId: "stand-1",
    entrepreneurId: "entrepreneur-1",
    status: "pending",
    requestedAt: "2026-08-10T12:00:00.000Z",
    ...overrides,
  };
}

export function createEntrepreneur(
  overrides: Partial<Entrepreneur> = {},
): Entrepreneur {
  return {
    id: "entrepreneur-1",
    displayName: "Emprendimiento de prueba",
    category: "tecnología",
    description: "Perfil ficticio para pruebas.",
    avatar: { type: "bundled", key: "entrepreneur-placeholder" },
    gallery: [],
    externalContacts: [],
    isActive: true,
    createdAt: "2026-08-01T12:00:00.000Z",
    updatedAt: "2026-08-10T12:00:00.000Z",
    ...overrides,
  };
}

