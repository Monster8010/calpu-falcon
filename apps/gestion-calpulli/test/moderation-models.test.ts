import assert from "node:assert/strict";
import test from "node:test";

import { createDemoSeed } from "@calpulli/mock-data";

import {
  composeModerationItems,
  filterModerationItems,
  getModerationMetrics,
  getModerationStatus,
  getModerationStatusLabel,
  sortModerationItems,
} from "../features/moderation/moderation-models";

const NOW = "2026-08-10T18:00:00.000Z";

test("la ocultación tiene precedencia sobre borrador y propietario inactivo", () => {
  assert.equal(getModerationStatus({
    isHiddenByModerator: true,
    isPublished: false,
    ownerIsActive: false,
  }), "hidden");
  assert.equal(getModerationStatusLabel("hidden"), "Oculta por moderación");
  assert.equal(getModerationStatus({
    isHiddenByModerator: false,
    isPublished: false,
    ownerIsActive: true,
  }), "unpublished");
  assert.equal(getModerationStatus({
    isHiddenByModerator: false,
    isPublished: true,
    ownerIsActive: false,
  }), "owner-inactive");
});

test("compone publicaciones con propietarios, clases y métricas", () => {
  const seed = createDemoSeed(NOW);
  const items = composeModerationItems(seed);
  const metrics = getModerationMetrics(items);

  assert.equal(items.length, seed.institutionalPosts.length + seed.entrepreneurPosts.length);
  assert.equal(metrics.total, items.length);
  assert.equal(metrics.institutionalPosts, seed.institutionalPosts.length);
  assert.equal(metrics.entrepreneurPosts, seed.entrepreneurPosts.length);
  assert.equal(
    metrics.public + metrics.hidden + metrics.unpublished + metrics.ownerInactive,
    metrics.total,
  );
  assert.equal(items.every(({ ownerLabel }) => ownerLabel.length > 0), true);
});

test("filtra por badge sin mutar la lista y conserva orden determinista", () => {
  const seed = createDemoSeed(NOW);
  seed.institutionalPosts[0]!.isHiddenByModerator = true;
  seed.institutionalPosts[0]!.updatedAt = "2026-08-10T20:00:00.000Z";
  seed.entrepreneurPosts[0]!.isPublished = false;
  const items = composeModerationItems(seed);
  const snapshot = items.map(({ id }) => id);

  assert.equal(filterModerationItems(items, "hidden").length, 1);
  assert.equal(
    filterModerationItems(items, "unpublished").some(
      ({ id }) => id === seed.entrepreneurPosts[0]!.id,
    ),
    true,
  );
  assert.equal(sortModerationItems(items)[0]?.id, seed.institutionalPosts[0]!.id);
  assert.deepEqual(items.map(({ id }) => id), snapshot);
  assert.notEqual(filterModerationItems(items, "all"), items);
});
