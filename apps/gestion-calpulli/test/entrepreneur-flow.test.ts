import assert from "node:assert/strict";
import test from "node:test";

import type { SharedCalpulliState } from "@calpulli/domain";
import {
  createDemoSeed,
  DEMO_FAIR_ID,
  ENTREPRENEUR_IDS,
} from "@calpulli/mock-data";
import {
  createRepositories,
  type SharedStateStore,
} from "@calpulli/repositories";

import {
  createEmptyEntrepreneurPostDraft,
  createEmptyProductDraft,
  toCreateEntrepreneurPostInput,
  toCreateProductInput,
} from "../features/entrepreneurs/entrepreneur-form-models";

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

test("publicación y producto del emprendedor llegan a Marketplace, nunca a Inicio", async () => {
  let nextId = 0;
  const repositories = createRepositories(createMemoryStore(createDemoSeed(NOW)), {
    createId: (prefix) => `${prefix}-stage-13-${++nextId}`,
    now: () => NOW,
  });
  const postDraft = createEmptyEntrepreneurPostDraft();
  postDraft.title = "Colección de feria";
  postDraft.body = "Contenido propio del emprendimiento.";
  const productDraft = createEmptyProductDraft();
  productDraft.name = "Producto etapa 13";
  productDraft.category = "Demo";
  productDraft.isActive = true;

  const post = await repositories.marketplace.createPost(
    toCreateEntrepreneurPostInput(
      postDraft,
      ENTREPRENEUR_IDS.quetzalCafe,
      true,
      NOW,
    ),
  );
  const product = await repositories.marketplace.createProduct(
    toCreateProductInput(productDraft, ENTREPRENEUR_IDS.quetzalCafe),
  );
  await repositories.entrepreneurs.update(ENTREPRENEUR_IDS.quetzalCafe, {
    displayName: "Quetzal Café actualizado",
  });

  assert.equal((await repositories.marketplace.listPublicPosts()).some(({ id }) => id === post.id), true);
  assert.equal((await repositories.marketplace.listPublicProducts()).some(({ id }) => id === product.id), true);
  assert.equal((await repositories.institutionalPosts.listPublic()).some(({ id }) => id === post.id), false);
  assert.equal(
    (await repositories.entrepreneurs.listPublic()).find(
      ({ id }) => id === ENTREPRENEUR_IDS.quetzalCafe,
    )?.displayName,
    "Quetzal Café actualizado",
  );

  await repositories.marketplace.updateProduct(product.id, { isActive: false });
  assert.equal((await repositories.marketplace.listPublicProducts()).some(({ id }) => id === product.id), false);
});

test("solicitud del emprendedor nace pending y exige revisión del Administrador", async () => {
  let nextId = 0;
  const store = createMemoryStore(createDemoSeed(NOW));
  const repositories = createRepositories(store, {
    createId: (prefix) => `${prefix}-stage-13-${++nextId}`,
    now: () => NOW,
  });
  await repositories.fairs.activate(DEMO_FAIR_ID);

  const request = await repositories.standRequests.create({
    entrepreneurId: ENTREPRENEUR_IDS.quetzalCafe,
    fairId: DEMO_FAIR_ID,
    standId: "stand-01",
  });
  assert.equal(request.status, "pending");
  assert.equal((await repositories.stands.getById("stand-01"))?.status, "requested");
  await assert.rejects(
    repositories.standRequests.create({
      entrepreneurId: ENTREPRENEUR_IDS.quetzalCafe,
      fairId: DEMO_FAIR_ID,
      standId: "stand-02",
    }),
  );

  const approved = await repositories.standRequests.approve(request.id, "fair-admin");
  const assigned = await repositories.stands.getById("stand-01");
  assert.equal(approved.reviewedByDemoRole, "fair-admin");
  assert.equal(assigned?.status, "assigned");
  assert.equal(assigned?.assignedEntrepreneurId, ENTREPRENEUR_IDS.quetzalCafe);
});
