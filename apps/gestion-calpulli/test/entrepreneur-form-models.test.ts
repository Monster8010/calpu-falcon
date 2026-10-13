import assert from "node:assert/strict";
import test from "node:test";

import type { EntrepreneurPost, Product } from "@calpulli/domain";
import { createDemoSeed, ENTREPRENEUR_IDS } from "@calpulli/mock-data";

import {
  createEmptyEntrepreneurPostDraft,
  createEmptyProductDraft,
  createEntrepreneurPostDraft,
  createEntrepreneurProfileDraft,
  toCreateEntrepreneurPostInput,
  toEntrepreneurProfilePatch,
  toUpdateEntrepreneurPostPatch,
  toUpdateProductPatch,
} from "../features/entrepreneurs/entrepreneur-form-models";
import {
  getCurrentStandRequest,
  getEntrepreneurMetrics,
  selectFairForEntrepreneur,
  sortEntrepreneurRequests,
} from "../features/entrepreneurs/entrepreneur-models";

const NOW = "2026-08-10T18:00:00.000Z";

test("normaliza perfil, galería y contactos sin perder medios compartidos", () => {
  const entrepreneur = createDemoSeed(NOW).entrepreneurs[0];
  assert.ok(entrepreneur);
  entrepreneur.avatar = { type: "shared", uri: "content://calpulli/avatar" };
  entrepreneur.gallery.push({ type: "shared", uri: "content://calpulli/gallery" });
  const draft = createEntrepreneurProfileDraft(entrepreneur);
  draft.displayName = "  Quetzal Café renovado ";
  draft.contacts[0]!.label = " Instagram ";
  draft.contacts[0]!.value = " @quetzal_nuevo ";

  const patch = toEntrepreneurProfilePatch(draft);
  assert.equal(patch.displayName, "Quetzal Café renovado");
  assert.deepEqual(patch.avatar, { type: "shared", uri: "content://calpulli/avatar" });
  assert.equal(patch.gallery?.some((media) => media.type === "shared"), true);
  assert.equal(patch.externalContacts?.[0]?.value, "@quetzal_nuevo");
});

test("rechaza contactos incompletos del perfil", () => {
  const entrepreneur = createDemoSeed(NOW).entrepreneurs[0];
  assert.ok(entrepreneur);
  const draft = createEntrepreneurProfileDraft(entrepreneur);
  draft.contacts[0]!.value = "";
  assert.throws(() => toEntrepreneurProfilePatch(draft), /valor del contacto 1/i);
});

test("crea una publicación Marketplace sin convertirla en institucional", () => {
  const draft = createEmptyEntrepreneurPostDraft();
  draft.title = "Nueva colección";
  draft.body = "Piezas preparadas para la feria.";
  draft.mediaKeys = ["marketplace/post-novedad"];
  const input = toCreateEntrepreneurPostInput(
    draft,
    ENTREPRENEUR_IDS.quetzalCafe,
    true,
    NOW,
  );

  assert.equal(input.entrepreneurId, ENTREPRENEUR_IDS.quetzalCafe);
  assert.equal(input.isPublished, true);
  assert.equal(input.isHiddenByModerator, false);
  assert.equal("departmentId" in input, false);
});

test("editar una publicación conserva moderación y fecha salvo primera publicación", () => {
  const current: EntrepreneurPost = {
    id: "post-draft",
    entrepreneurId: ENTREPRENEUR_IDS.quetzalCafe,
    title: "Borrador",
    body: "Texto anterior",
    media: [{ type: "shared", uri: "content://calpulli/post" }],
    publishedAt: "2026-08-01T10:00:00.000Z",
    isPublished: false,
    isHiddenByModerator: true,
    createdAt: "2026-08-01T10:00:00.000Z",
    updatedAt: "2026-08-01T10:00:00.000Z",
  };
  const draft = createEntrepreneurPostDraft(current);
  draft.title = "Publicado";
  const patch = toUpdateEntrepreneurPostPatch(draft, current, true, NOW);

  assert.equal(patch.publishedAt, NOW);
  assert.equal(patch.media?.[0]?.type, "shared");
  assert.equal("isHiddenByModerator" in patch, false);
});

test("producto inactivo conserva precio textual sin lógica financiera", () => {
  const draft = createEmptyProductDraft();
  draft.name = "Taza demo";
  draft.category = "Cerámica";
  draft.priceLabel = "Desde $120";
  draft.isActive = false;
  const patch = toUpdateProductPatch(draft);

  assert.equal(patch.priceLabel, "Desde $120");
  assert.equal(patch.isActive, false);
  assert.equal(patch.description, undefined);
});

test("selecciona feria, resume catálogo y prioriza solicitud activa", () => {
  const seed = createDemoSeed(NOW);
  const upcoming = seed.fairs[0];
  assert.ok(upcoming);
  const active = { ...upcoming, id: "fair-active", status: "active" as const };
  assert.equal(selectFairForEntrepreneur([upcoming, active])?.id, active.id);

  const requests = [
    {
      id: "request-rejected",
      fairId: upcoming.id,
      standId: "stand-02",
      entrepreneurId: ENTREPRENEUR_IDS.quetzalCafe,
      status: "rejected" as const,
      requestedAt: "2026-08-10T18:00:00.000Z",
    },
    {
      id: "request-pending",
      fairId: upcoming.id,
      standId: "stand-01",
      entrepreneurId: ENTREPRENEUR_IDS.quetzalCafe,
      status: "pending" as const,
      requestedAt: "2026-08-09T18:00:00.000Z",
    },
  ];
  assert.equal(sortEntrepreneurRequests(requests)[0]?.id, "request-pending");
  assert.equal(getCurrentStandRequest(requests)?.status, "pending");

  const products: Product[] = seed.products.filter(({ entrepreneurId }) => entrepreneurId === ENTREPRENEUR_IDS.quetzalCafe);
  const posts = seed.entrepreneurPosts.filter(({ entrepreneurId }) => entrepreneurId === ENTREPRENEUR_IDS.quetzalCafe);
  assert.deepEqual(getEntrepreneurMetrics(posts, products), {
    posts: posts.length,
    products: products.length,
    activeProducts: products.length,
  });
});
