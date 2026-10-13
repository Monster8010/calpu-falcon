import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { createDemoSeed, DEMO_FAIR_ID } from "@calpulli/mock-data";

import {
  selectInstitutionalFeed,
  selectManagementSummary,
  selectStandsForFair,
  selectUpcomingFair,
  selectVisibleStories,
} from "../src";

const NOW = "2026-08-10T14:00:00.000Z";

describe("repository selectors", () => {
  it("compone contenido público sin mutar el estado", () => {
    const state = createDemoSeed(NOW);
    const originalFirstPost = state.institutionalPosts[0];
    assert.ok(originalFirstPost);
    state.departments = state.departments.map((department, index) =>
      index === 0 ? { ...department, isActive: false } : department,
    );

    const feed = selectInstitutionalFeed(state);
    const stories = selectVisibleStories(state, NOW);
    assert.equal(
      feed.some(({ departmentId }) => departmentId === originalFirstPost.departmentId),
      false,
    );
    assert.equal(
      stories.some(({ departmentId }) => departmentId === originalFirstPost.departmentId),
      false,
    );
    assert.equal(state.institutionalPosts[0], originalFirstPost);
  });

  it("ordena stands y resume el estado de gestión", () => {
    const state = createDemoSeed(NOW);
    state.stands.reverse();
    const stands = selectStandsForFair(state, DEMO_FAIR_ID);
    assert.equal(stands.length, 40);
    assert.equal(stands[0]?.number, 1);
    assert.equal(stands.at(-1)?.number, 40);
    assert.equal(selectUpcomingFair(state)?.id, DEMO_FAIR_ID);

    const summary = selectManagementSummary(state);
    assert.equal(summary.activeDepartments, 10);
    assert.equal(summary.availableStands, 40);
    assert.equal(summary.pendingStandRequests, 0);
  });
});
