import assert from "node:assert/strict";
import test from "node:test";

import { getCountdown, type SharedCalpulliState } from "@calpulli/domain";
import {
  createDemoSeed,
  DEMO_FAIR_ID,
  ENTREPRENEUR_IDS,
} from "@calpulli/mock-data";
import {
  createRepositories,
  selectActiveFair,
  selectUpcomingFair,
  type SharedStateStore,
} from "@calpulli/repositories";

import { suggestNextFairDate } from "../features/fair-admin/fair-admin-models";

const NOW = "2026-08-10T14:00:00.000Z";

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

test("fecha y activación cambian la misma feria que consulta la app pública", async () => {
  const store = createMemoryStore(createDemoSeed(NOW));
  const repositories = createRepositories(store, { now: () => NOW });
  const changedDate = "2026-08-26T18:00:00.000Z";

  await repositories.fairs.update(DEMO_FAIR_ID, { nextDate: changedDate });
  const upcoming = selectUpcomingFair(await store.readState());
  assert.equal(upcoming?.nextDate, changedDate);
  assert.ok((getCountdown(changedDate, NOW)?.totalMilliseconds ?? 0) > 0);

  await repositories.fairs.activate(DEMO_FAIR_ID);
  const stateAfterActivation = await store.readState();
  assert.equal(selectActiveFair(stateAfterActivation)?.id, DEMO_FAIR_ID);
  assert.equal(
    stateAfterActivation.stands.filter(({ fairId }) => fairId === DEMO_FAIR_ID).length,
    40,
  );
});

test("aprobar, liberar y finalizar conservan asociaciones coherentes", async () => {
  const store = createMemoryStore(createDemoSeed(NOW));
  const repositories = createRepositories(store, { now: () => NOW });
  const approved = await repositories.standRequests.create({
    fairId: DEMO_FAIR_ID,
    standId: "stand-01",
    entrepreneurId: ENTREPRENEUR_IDS.quetzalCafe,
  });
  await repositories.standRequests.approve(approved.id, "fair-admin");
  assert.equal((await repositories.stands.getById("stand-01"))?.status, "assigned");

  await repositories.stands.release("stand-01", "fair-admin");
  assert.equal((await repositories.stands.getById("stand-01"))?.status, "available");
  assert.equal((await repositories.standRequests.getById(approved.id))?.status, "cancelled");

  const pending = await repositories.standRequests.create({
    fairId: DEMO_FAIR_ID,
    standId: "stand-02",
    entrepreneurId: ENTREPRENEUR_IDS.nopalStudio,
  });
  const activeFair = await repositories.fairs.activate(DEMO_FAIR_ID);
  const nextDate = suggestNextFairDate(activeFair, NOW);
  await repositories.fairs.finish(DEMO_FAIR_ID, nextDate, "fair-admin");

  const finishedState = await store.readState();
  assert.equal(selectUpcomingFair(finishedState)?.nextDate, nextDate);
  assert.equal(
    finishedState.stands.filter(({ fairId }) => fairId === DEMO_FAIR_ID).every(
      (stand) => stand.status === "available" && stand.activeRequestId === undefined,
    ),
    true,
  );
  assert.equal(
    finishedState.standRequests.find(({ id }) => id === pending.id)?.status,
    "cancelled",
  );
});
