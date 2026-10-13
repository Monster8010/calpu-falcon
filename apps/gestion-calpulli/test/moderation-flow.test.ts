import assert from "node:assert/strict";
import test from "node:test";

import type { SharedCalpulliState } from "@calpulli/domain";
import { createDemoSeed } from "@calpulli/mock-data";
import {
  createRepositories,
  type SharedStateStore,
} from "@calpulli/repositories";

const NOW = "2026-08-10T18:30:00.000Z";

function createMemoryStore(initial: SharedCalpulliState): SharedStateStore {
  let state = structuredClone(initial);
  return {
    async readState() {
      return structuredClone(state);
    },
    async mutateSharedState(operation) {
      const draft = structuredClone(state);
      state = operation(draft) ?? draft;
      return structuredClone(state);
    },
  };
}

function createHarness() {
  let nextId = 0;
  return createRepositories(createMemoryStore(createDemoSeed(NOW)), {
    createId: (prefix) => `${prefix}-stage-15-${++nextId}`,
    now: () => NOW,
  });
}

test("un departamento publica sin aprobación y Moderador oculta y restaura", async () => {
  const repositories = createHarness();
  const department = (await repositories.departments.list()).find(
    ({ isActive }) => isActive,
  );
  assert.ok(department);

  const created = await repositories.institutionalPosts.create({
    body: "Contenido visible sin cola de aprobación.",
    departmentId: department.id,
    isHiddenByModerator: false,
    isPublished: true,
    media: [],
    priority: "urgent",
    publishedAt: NOW,
    title: "Aviso directo de etapa 15",
    views: 0,
    visibility: {
      showDate: true,
      showDepartment: true,
      showLocation: true,
      showMedia: true,
      showViews: true,
    },
  });

  assert.equal(
    (await repositories.institutionalPosts.listPublic()).some(
      ({ id }) => id === created.id,
    ),
    true,
  );

  await repositories.moderation.hideInstitutionalPost(created.id);
  assert.equal(
    (await repositories.institutionalPosts.listPublic()).some(
      ({ id }) => id === created.id,
    ),
    false,
  );
  assert.equal(
    (await repositories.moderation.listHidden()).institutionalPosts.some(
      ({ id }) => id === created.id,
    ),
    true,
  );

  await repositories.moderation.restoreInstitutionalPost(created.id);
  assert.equal(
    (await repositories.institutionalPosts.listPublic()).some(
      ({ id }) => id === created.id,
    ),
    true,
  );
});

test("la misma moderación posterior aplica a publicaciones de emprendimiento", async () => {
  const repositories = createHarness();
  const entrepreneur = (await repositories.entrepreneurs.list()).find(
    ({ isActive }) => isActive,
  );
  assert.ok(entrepreneur);
  const post = await repositories.marketplace.createPost({
    body: "Contenido de Marketplace.",
    entrepreneurId: entrepreneur.id,
    isHiddenByModerator: false,
    isPublished: true,
    media: [],
    publishedAt: NOW,
    title: "Anuncio de emprendimiento",
  });

  await repositories.moderation.hideEntrepreneurPost(post.id);
  assert.equal(
    (await repositories.marketplace.listPublicPosts()).some(
      ({ id }) => id === post.id,
    ),
    false,
  );
  await repositories.moderation.restoreEntrepreneurPost(post.id);
  assert.equal(
    (await repositories.marketplace.listPublicPosts()).some(
      ({ id }) => id === post.id,
    ),
    true,
  );
});

test("restaurar un borrador no lo publica", async () => {
  const repositories = createHarness();
  const department = (await repositories.departments.list())[0];
  assert.ok(department);
  const draft = await repositories.institutionalPosts.create({
    body: "Borrador privado.",
    departmentId: department.id,
    isHiddenByModerator: true,
    isPublished: false,
    media: [],
    priority: "normal",
    publishedAt: NOW,
    title: "Borrador restaurado",
    views: 0,
    visibility: {
      showDate: true,
      showDepartment: true,
      showLocation: true,
      showMedia: true,
      showViews: true,
    },
  });

  const restored = await repositories.moderation.restoreInstitutionalPost(draft.id);
  assert.equal(restored.isPublished, false);
  assert.equal(restored.isHiddenByModerator, false);
  assert.equal(
    (await repositories.institutionalPosts.listPublic()).some(
      ({ id }) => id === draft.id,
    ),
    false,
  );
});
