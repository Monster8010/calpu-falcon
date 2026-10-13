import type { ISODateTime, SharedCalpulliState } from "@calpulli/domain";

import { createDemoDepartments } from "./departments";
import { createDemoEntrepreneurs } from "./entrepreneurs";
import { createDemoFairs } from "./fair";
import {
  createDemoEntrepreneurPosts,
  createDemoProducts,
} from "./marketplace";
import { createDemoInstitutionalPosts } from "./posts";
import { createDemoSeedContext } from "./seed-context";
import { createDemoStands } from "./stands";
import { createDemoStories } from "./stories";
import { createDemoTutoringOffers, createDemoTutors } from "./tutors";

export const DEMO_SEED_SCHEMA_VERSION = 1;

export function createDemoSeed(
  referenceTime: ISODateTime = new Date().toISOString(),
): SharedCalpulliState {
  const context = createDemoSeedContext(referenceTime);

  return {
    meta: {
      schemaVersion: DEMO_SEED_SCHEMA_VERSION,
      revision: 1,
      createdAt: context.referenceTime,
      updatedAt: context.referenceTime,
      lastWriter: "gestion-calpulli",
    },
    departments: createDemoDepartments(context),
    institutionalPosts: createDemoInstitutionalPosts(context),
    stories: createDemoStories(context),
    fairs: createDemoFairs(context),
    stands: createDemoStands(context),
    standRequests: [],
    entrepreneurs: createDemoEntrepreneurs(context),
    entrepreneurPosts: createDemoEntrepreneurPosts(context),
    products: createDemoProducts(context),
    tutors: createDemoTutors(context),
    tutoringOffers: createDemoTutoringOffers(context),
    configuration: {
      schemaVersion: DEMO_SEED_SCHEMA_VERSION,
      demoMode: true,
      institutionName: "UPIICSA",
      publicAppName: "UPIICSA Calpulli",
      managementAppName: "Gestión UPIICSA Calpulli",
      defaultTheme: "system",
    },
  };
}
