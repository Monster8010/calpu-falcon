import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { createDemoSeed, DEMO_FAIR_ID } from "@calpulli/mock-data";

import {
  RepositoryError,
  createRepositories,
} from "../src";
import { InMemorySharedStateStore } from "./in-memory-store";

const NOW = "2026-08-10T14:00:00.000Z";
const MEDIA = { type: "bundled", key: "test/asset" } as const;

function createHarness() {
  const store = new InMemorySharedStateStore(createDemoSeed(NOW));
  let id = 0;
  const repositories = createRepositories(store, {
    now: () => NOW,
    createId: (prefix) => `${prefix}-generated-${++id}`,
  });
  return { repositories, store };
}

describe("repositories CRUD", () => {
  it("crea, consulta, actualiza y elimina departamento, post e historia", async () => {
    const { repositories, store } = createHarness();
    const department = await repositories.departments.create({
      name: "Laboratorio",
      logoKey: "departments/lab",
      isActive: true,
    });
    assert.equal(department.id, "department-generated-1");

    const post = await repositories.institutionalPosts.create({
      departmentId: department.id,
      title: "Aviso",
      body: "Contenido de prueba",
      priority: "normal",
      publishedAt: NOW,
      media: [MEDIA],
      views: 0,
      visibility: {
        showDepartment: true,
        showLocation: true,
        showMedia: true,
        showDate: true,
        showViews: true,
      },
      isPublished: true,
      isHiddenByModerator: false,
    });
    const story = await repositories.stories.create({
      departmentId: department.id,
      title: "Historia",
      media: [MEDIA],
      views: 0,
      startsAt: "2026-08-10T13:00:00.000Z",
      expiresAt: "2026-08-10T16:00:00.000Z",
      isActive: true,
    });

    assert.equal((await repositories.departments.getById(department.id))?.name, "Laboratorio");
    assert.equal(
      (await repositories.institutionalPosts.listPublic()).some(
        ({ id }) => id === post.id,
      ),
      true,
    );
    assert.equal(
      (await repositories.stories.listVisible(NOW)).some(
        ({ id }) => id === story.id,
      ),
      true,
    );

    await repositories.institutionalPosts.update(post.id, { title: "Aviso actualizado" });
    assert.equal((await repositories.institutionalPosts.getById(post.id))?.title, "Aviso actualizado");
    await assert.rejects(
      repositories.departments.delete(department.id),
      (error: unknown) =>
        error instanceof RepositoryError && error.code === "ENTITY_IN_USE",
    );

    await repositories.institutionalPosts.delete(post.id);
    await repositories.stories.delete(story.id);
    await repositories.departments.delete(department.id);
    assert.equal(await repositories.departments.getById(department.id), undefined);
    assert.equal(store.mutationCount, 7);
  });

  it("administra feria y valida sus transiciones dentro de una mutación", async () => {
    const { repositories } = createHarness();
    const fair = await repositories.fairs.create({
      name: "Feria temporal",
      status: "upcoming",
      nextDate: "2026-08-20T18:00:00.000Z",
      recurrenceHintDays: 15,
      recurrenceHintWeekday: 3,
    });

    const active = await repositories.fairs.activate(fair.id);
    assert.equal(active.status, "active");
    assert.equal(active.activatedAt, NOW);
    await assert.rejects(
      repositories.fairs.activate(DEMO_FAIR_ID),
      (error: unknown) =>
        error instanceof RepositoryError && error.code === "INVALID_TRANSITION",
    );
    const finished = await repositories.fairs.finish(
      fair.id,
      "2026-09-02T18:00:00.000Z",
    );
    assert.equal(finished.status, "upcoming");
    assert.equal(finished.endedAt, NOW);
    await assert.rejects(
      repositories.fairs.finish(fair.id, "2026-10-01T18:00:00.000Z"),
      (error: unknown) =>
        error instanceof RepositoryError && error.code === "INVALID_TRANSITION",
    );
    await repositories.fairs.delete(fair.id);
  });

  it("crea, actualiza, lista y elimina stands sin asociaciones", async () => {
    const { repositories } = createHarness();
    const stand = await repositories.stands.create({
      fairId: "fair-calpulli",
      number: 41,
      coordinate: {
        row: 12,
        column: 2,
        branch: "from-3",
        order: 12,
      },
      status: "available",
    });
    assert.equal(
      (await repositories.stands.list("fair-calpulli")).some(
        ({ id }) => id === stand.id,
      ),
      true,
    );
    const updated = await repositories.stands.update(stand.id, { number: 42 });
    assert.equal(updated.number, 42);
    await repositories.stands.delete(stand.id);
    assert.equal(await repositories.stands.getById(stand.id), undefined);
  });

  it("administra marketplace y aplica moderación posterior", async () => {
    const { repositories } = createHarness();
    const entrepreneur = await repositories.entrepreneurs.create({
      displayName: "Proyecto prueba",
      category: "Tecnología",
      description: "Perfil temporal",
      avatar: MEDIA,
      gallery: [],
      externalContacts: [],
      isActive: true,
    });
    const post = await repositories.marketplace.createPost({
      entrepreneurId: entrepreneur.id,
      title: "Publicación",
      body: "Contenido",
      media: [],
      publishedAt: NOW,
      isPublished: true,
      isHiddenByModerator: false,
    });
    const product = await repositories.marketplace.createProduct({
      entrepreneurId: entrepreneur.id,
      name: "Producto",
      category: "Demo",
      media: [MEDIA],
      isActive: true,
    });

    assert.equal(
      (await repositories.entrepreneurs.update(entrepreneur.id, {
        displayName: "Proyecto actualizado",
      })).displayName,
      "Proyecto actualizado",
    );
    assert.equal(
      (await repositories.marketplace.updatePost(post.id, {
        title: "Publicación actualizada",
      })).title,
      "Publicación actualizada",
    );
    assert.equal(
      (await repositories.marketplace.updateProduct(product.id, {
        priceLabel: "$100 MXN",
      })).priceLabel,
      "$100 MXN",
    );

    await repositories.moderation.hideEntrepreneurPost(post.id);
    assert.equal(
      (await repositories.marketplace.listPublicPosts(entrepreneur.id)).some(
        ({ id }) => id === post.id,
      ),
      false,
    );
    assert.equal(
      (await repositories.moderation.listHidden()).entrepreneurPosts.some(
        ({ id }) => id === post.id,
      ),
      true,
    );
    await repositories.moderation.restoreEntrepreneurPost(post.id);
    assert.equal(
      (await repositories.marketplace.listPublicProducts(entrepreneur.id))[0]?.id,
      product.id,
    );

    await repositories.marketplace.deletePost(post.id);
    await repositories.marketplace.deleteProduct(product.id);
    await repositories.entrepreneurs.delete(entrepreneur.id);
  });

  it("administra tutores, ofertas y configuración", async () => {
    const { repositories } = createHarness();
    const tutor = await repositories.tutors.create({
      displayName: "Tutor temporal",
      description: "Descripción",
      avatar: MEDIA,
      modes: ["online"],
      externalContacts: [],
      isActive: true,
    });
    const offer = await repositories.tutors.createOffer({
      tutorId: tutor.id,
      subject: "Pruebas de software",
      modes: ["online"],
      isActive: true,
    });
    assert.equal(
      (await repositories.tutors.update(tutor.id, {
        description: "Descripción actualizada",
      })).description,
      "Descripción actualizada",
    );
    assert.equal((await repositories.tutors.listPublicOffers(tutor.id))[0]?.id, offer.id);
    await repositories.tutors.updateOffer(offer.id, { subject: "Calidad de software" });
    assert.equal((await repositories.tutors.getOfferById(offer.id))?.subject, "Calidad de software");
    await assert.rejects(
      repositories.tutors.delete(tutor.id),
      (error: unknown) =>
        error instanceof RepositoryError && error.code === "ENTITY_IN_USE",
    );
    await repositories.tutors.deleteOffer(offer.id);
    await repositories.tutors.delete(tutor.id);

    const configuration = await repositories.configuration.update({
      defaultTheme: "dark",
      publicAppName: "Calpulli prueba",
    });
    assert.equal(configuration.defaultTheme, "dark");
    assert.equal((await repositories.configuration.get()).publicAppName, "Calpulli prueba");
  });

  it("oculta y restaura publicaciones institucionales", async () => {
    const { repositories } = createHarness();
    const post = (await repositories.institutionalPosts.listPublic())[0];
    assert.ok(post);
    await repositories.moderation.hideInstitutionalPost(post.id);
    assert.equal(
      (await repositories.institutionalPosts.listPublic()).some(({ id }) => id === post.id),
      false,
    );
    await repositories.moderation.restoreInstitutionalPost(post.id);
    assert.equal(
      (await repositories.institutionalPosts.listPublic()).some(({ id }) => id === post.id),
      true,
    );
  });

  it("restaura el seed mediante una mutación versionada", async () => {
    const { repositories, store } = createHarness();
    const before = await store.readState();
    await repositories.configuration.update({ institutionName: "Estado alterado" });
    const seed = createDemoSeed("2026-09-01T12:00:00.000Z");

    const restored = await repositories.demoData.restore(seed);

    assert.equal(restored.configuration.institutionName, "UPIICSA");
    assert.equal(restored.departments.length, seed.departments.length);
    assert.equal(restored.standRequests.length, 0);
    assert.equal(restored.meta.revision, before.meta.revision + 2);
    assert.equal(restored.meta.lastWriter, "gestion-calpulli");
  });

  it("rechaza un seed con schema incompatible", async () => {
    const { repositories } = createHarness();
    const seed = createDemoSeed(NOW);
    seed.meta.schemaVersion = 2;

    await assert.rejects(
      repositories.demoData.restore(seed),
      (error: unknown) =>
        error instanceof RepositoryError &&
        error.code === "DOMAIN_VALIDATION_FAILED",
    );
  });
});
