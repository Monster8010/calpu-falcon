import assert from "node:assert/strict";
import test from "node:test";

import type { SharedCalpulliState } from "@calpulli/domain";
import { createDemoSeed, DEPARTMENT_IDS } from "@calpulli/mock-data";
import {
  createRepositories,
  type SharedStateStore,
} from "@calpulli/repositories";

import {
  createEmptyPostDraft,
  toCreatePostInput,
} from "../features/departments/department-form-models";

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

test("un aviso urgente guardado por Repository queda visible para la consulta pública", async () => {
  const repositories = createRepositories(createMemoryStore(createDemoSeed(NOW)), {
    createId: () => "institutional-post-stage-11",
    now: () => NOW,
  });
  const draft = createEmptyPostDraft();
  draft.title = "Cambio urgente de salón";
  draft.body = "El grupo de demostración debe acudir al aula B-201.";
  draft.priority = "urgent";
  draft.location = "Edificio B";

  await repositories.institutionalPosts.create(
    toCreatePostInput(
      draft,
      DEPARTMENT_IDS.schoolManagement,
      true,
      NOW,
    ),
  );

  const publicFeed = await repositories.institutionalPosts.listPublic();
  const created = publicFeed.find(({ id }) => id === "institutional-post-stage-11");

  assert.ok(created);
  assert.equal(created.priority, "urgent");
  assert.equal(created.isPublished, true);
  assert.equal(created.isHiddenByModerator, false);
  assert.equal(publicFeed[0]?.id, created.id);
});
