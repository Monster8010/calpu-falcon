import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  filterVisibleStories,
  isValidISODateTime,
  validateFairNextDate,
  type SharedCalpulliState,
} from "@calpulli/domain";

import { createDemoSeed, DEMO_SEED_SCHEMA_VERSION } from "../src/seed";

const REFERENCE_TIME = "2026-08-10T12:00:00.000Z";

function assertUnique(values: readonly string[], label: string): void {
  assert.equal(new Set(values).size, values.length, `${label} contiene duplicados`);
}

function assertReferences(state: SharedCalpulliState): void {
  const departmentIds = new Set(state.departments.map(({ id }) => id));
  const fairIds = new Set(state.fairs.map(({ id }) => id));
  const entrepreneurIds = new Set(state.entrepreneurs.map(({ id }) => id));
  const tutorIds = new Set(state.tutors.map(({ id }) => id));

  for (const post of state.institutionalPosts) {
    assert.equal(departmentIds.has(post.departmentId), true);
  }

  for (const story of state.stories) {
    assert.equal(departmentIds.has(story.departmentId), true);
  }

  for (const stand of state.stands) {
    assert.equal(fairIds.has(stand.fairId), true);
  }

  for (const post of state.entrepreneurPosts) {
    assert.equal(entrepreneurIds.has(post.entrepreneurId), true);
  }

  for (const product of state.products) {
    assert.equal(entrepreneurIds.has(product.entrepreneurId), true);
  }

  for (const offer of state.tutoringOffers) {
    assert.equal(tutorIds.has(offer.tutorId), true);
  }
}

describe("seed de demostración", () => {
  it("crea el volumen documentado y conserva relaciones válidas", () => {
    const state = createDemoSeed(REFERENCE_TIME);

    assert.equal(state.departments.length, 10);
    assert.equal(state.institutionalPosts.length >= 20, true);
    assert.equal(state.stories.length >= 8, true);
    assert.equal(state.fairs.length, 1);
    assert.equal(state.stands.length, 40);
    assert.equal(state.entrepreneurs.length, 10);
    assert.equal(
      state.entrepreneurPosts.length + state.products.length >= 15,
      true,
    );
    assert.equal(state.tutors.length, 8);
    assert.equal(state.tutoringOffers.length >= 20, true);
    assert.deepEqual(state.standRequests, []);

    assertReferences(state);
  });

  it("da a cada departamento de una a tres publicaciones plausibles", () => {
    const state = createDemoSeed(REFERENCE_TIME);
    const priorities = new Set(
      state.institutionalPosts.map(({ priority }) => priority),
    );

    for (const department of state.departments) {
      const postCount = state.institutionalPosts.filter(
        ({ departmentId }) => departmentId === department.id,
      ).length;
      assert.equal(postCount >= 1 && postCount <= 3, true);
    }

    assert.deepEqual(
      [...priorities].sort(),
      ["featured", "important", "normal", "urgent"].sort(),
    );
    assert.equal(
      state.institutionalPosts.some(({ body }) =>
        body.toLocaleLowerCase("es-MX").includes("lorem ipsum"),
      ),
      false,
    );
  });

  it("crea una feria upcoming en el siguiente miércoles futuro", () => {
    const state = createDemoSeed(REFERENCE_TIME);
    const fair = state.fairs[0];

    assert.notEqual(fair, undefined);
    assert.equal(fair?.status, "upcoming");
    assert.equal(fair?.recurrenceHintDays, 15);
    assert.equal(fair?.recurrenceHintWeekday, 3);
    assert.equal(new Date(fair?.nextDate ?? 0).getUTCDay(), 3);
    assert.equal(
      new Date(fair?.nextDate ?? 0).getTime() >
        new Date(REFERENCE_TIME).getTime(),
      true,
    );
    assert.equal(
      fair === undefined
        ? false
        : validateFairNextDate(fair, REFERENCE_TIME).valid,
      true,
    );
  });

  it("incluye ocho historias visibles y conserva intervalos válidos", () => {
    const state = createDemoSeed(REFERENCE_TIME);

    assert.equal(filterVisibleStories(state.stories, REFERENCE_TIME).length, 8);

    for (const story of state.stories) {
      assert.equal(isValidISODateTime(story.startsAt), true);
      assert.equal(isValidISODateTime(story.expiresAt), true);
      assert.equal(
        new Date(story.startsAt).getTime() < new Date(story.expiresAt).getTime(),
        true,
      );
    }
  });

  it("mantiene fechas persistidas válidas y orden temporal interno", () => {
    const state = createDemoSeed(REFERENCE_TIME);
    const timestampedEntities = [
      ...state.departments,
      ...state.institutionalPosts,
      ...state.stories,
      ...state.fairs,
      ...state.entrepreneurs,
      ...state.entrepreneurPosts,
      ...state.products,
      ...state.tutors,
      ...state.tutoringOffers,
    ];

    for (const entity of timestampedEntities) {
      assert.equal(isValidISODateTime(entity.createdAt), true);
      assert.equal(isValidISODateTime(entity.updatedAt), true);
      assert.equal(
        new Date(entity.createdAt).getTime() <=
          new Date(entity.updatedAt).getTime(),
        true,
      );
    }

    for (const stand of state.stands) {
      assert.equal(isValidISODateTime(stand.updatedAt), true);
    }
  });

  it("asigna de dos a cuatro ofertas a cada tutor", () => {
    const state = createDemoSeed(REFERENCE_TIME);

    for (const tutor of state.tutors) {
      const offerCount = state.tutoringOffers.filter(
        ({ tutorId }) => tutorId === tutor.id,
      ).length;
      assert.equal(offerCount >= 2 && offerCount <= 4, true);
    }
  });

  it("usa schemaVersion 1, revisiones válidas e IDs deterministas", () => {
    const first = createDemoSeed(REFERENCE_TIME);
    const second = createDemoSeed(REFERENCE_TIME);

    assert.deepEqual(first, second);
    assert.equal(first.meta.schemaVersion, DEMO_SEED_SCHEMA_VERSION);
    assert.equal(first.configuration.schemaVersion, DEMO_SEED_SCHEMA_VERSION);
    assert.equal(first.meta.revision, 1);
    assert.equal(first.meta.lastWriter, "gestion-calpulli");
    assert.equal(isValidISODateTime(first.meta.createdAt), true);

    for (const [label, ids] of [
      ["departments", first.departments.map(({ id }) => id)],
      ["posts", first.institutionalPosts.map(({ id }) => id)],
      ["stories", first.stories.map(({ id }) => id)],
      ["stands", first.stands.map(({ id }) => id)],
      ["entrepreneurs", first.entrepreneurs.map(({ id }) => id)],
      ["entrepreneurPosts", first.entrepreneurPosts.map(({ id }) => id)],
      ["products", first.products.map(({ id }) => id)],
      ["tutors", first.tutors.map(({ id }) => id)],
      ["tutoringOffers", first.tutoringOffers.map(({ id }) => id)],
    ] as const) {
      assertUnique(ids, label);
    }
  });

  it("rechaza una fecha de referencia ambigua", () => {
    assert.throws(
      () => createDemoSeed("2026-08-10T12:00:00"),
      RangeError,
    );
  });
});
