import type { SharedCalpulliState, SharedWriter } from "@calpulli/domain";

const CREATED_AT = "2026-08-10T12:00:00.000Z";

export function createSharedState(
  revision = 0,
  lastWriter: SharedWriter = "gestion-calpulli",
): SharedCalpulliState {
  return {
    meta: {
      schemaVersion: 1,
      revision,
      createdAt: CREATED_AT,
      updatedAt: CREATED_AT,
      lastWriter,
    },
    departments: [],
    institutionalPosts: [],
    stories: [],
    fairs: [],
    stands: [],
    standRequests: [],
    entrepreneurs: [],
    entrepreneurPosts: [],
    products: [],
    tutors: [],
    tutoringOffers: [],
    configuration: {
      schemaVersion: 1,
      demoMode: true,
      institutionName: "UPIICSA",
      publicAppName: "UPIICSA Calpulli",
      managementAppName: "Gestión UPIICSA Calpulli",
      defaultTheme: "system",
    },
  };
}
