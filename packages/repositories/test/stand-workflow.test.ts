import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { createDemoSeed, DEMO_FAIR_ID, ENTREPRENEUR_IDS } from "@calpulli/mock-data";

import { RepositoryError, createRepositories } from "../src";
import { InMemorySharedStateStore } from "./in-memory-store";

const NOW = "2026-08-10T14:00:00.000Z";

function createHarness() {
  const store = new InMemorySharedStateStore(createDemoSeed(NOW));
  let id = 0;
  const repositories = createRepositories(store, {
    now: () => NOW,
    createId: (prefix) => `${prefix}-workflow-${++id}`,
  });
  return { repositories, store };
}

describe("stand request workflow", () => {
  it("crea y aprueba una solicitud conservando stand y solicitud coherentes", async () => {
    const { repositories, store } = createHarness();
    const request = await repositories.standRequests.create({
      fairId: DEMO_FAIR_ID,
      standId: "stand-01",
      entrepreneurId: ENTREPRENEUR_IDS.quetzalCafe,
    });
    const requestedStand = await repositories.stands.getById("stand-01");
    assert.equal(requestedStand?.status, "requested");
    assert.equal(requestedStand?.activeRequestId, request.id);

    await assert.rejects(
      repositories.standRequests.create({
        fairId: DEMO_FAIR_ID,
        standId: "stand-02",
        entrepreneurId: ENTREPRENEUR_IDS.quetzalCafe,
      }),
      (error: unknown) =>
        error instanceof RepositoryError &&
        error.code === "DOMAIN_VALIDATION_FAILED",
    );

    const approved = await repositories.standRequests.approve(request.id);
    const assignedStand = await repositories.stands.getById("stand-01");
    assert.equal(approved.status, "approved");
    assert.equal(assignedStand?.status, "assigned");
    assert.equal(
      assignedStand?.assignedEntrepreneurId,
      ENTREPRENEUR_IDS.quetzalCafe,
    );
    assert.equal(store.mutationCount, 2);
  });

  it("rechaza, reabre y cancela restaurando el estado del stand", async () => {
    const { repositories } = createHarness();
    const request = await repositories.standRequests.create({
      fairId: DEMO_FAIR_ID,
      standId: "stand-03",
      entrepreneurId: ENTREPRENEUR_IDS.nopalStudio,
    });
    const rejected = await repositories.standRequests.reject(
      request.id,
      "fair-admin",
      "Revisar datos",
    );
    assert.equal(rejected.status, "rejected");
    assert.equal((await repositories.stands.getById("stand-03"))?.status, "available");

    const reopened = await repositories.standRequests.reopen(request.id);
    assert.equal(reopened.status, "pending");
    assert.equal(reopened.reviewedAt, undefined);
    assert.equal((await repositories.stands.getById("stand-03"))?.status, "requested");

    const cancelled = await repositories.standRequests.cancel(request.id);
    assert.equal(cancelled.status, "cancelled");
    assert.equal((await repositories.stands.getById("stand-03"))?.status, "available");
    await repositories.standRequests.delete(request.id);
    assert.equal(await repositories.standRequests.getById(request.id), undefined);
  });

  it("libera un stand asignado y cancela su solicitud aprobada", async () => {
    const { repositories } = createHarness();
    const request = await repositories.standRequests.create({
      fairId: DEMO_FAIR_ID,
      standId: "stand-04",
      entrepreneurId: ENTREPRENEUR_IDS.tenochtliTech,
    });
    await repositories.standRequests.approve(request.id);
    const released = await repositories.stands.release("stand-04");
    assert.equal(released.status, "available");
    assert.equal(released.assignedEntrepreneurId, undefined);
    assert.equal((await repositories.standRequests.getById(request.id))?.status, "cancelled");
  });

  it("finaliza la feria liberando stands y cancelando solicitudes activas", async () => {
    const { repositories } = createHarness();
    const approvedRequest = await repositories.standRequests.create({
      fairId: DEMO_FAIR_ID,
      standId: "stand-05",
      entrepreneurId: ENTREPRENEUR_IDS.quetzalCafe,
    });
    await repositories.standRequests.approve(approvedRequest.id);
    const pendingRequest = await repositories.standRequests.create({
      fairId: DEMO_FAIR_ID,
      standId: "stand-06",
      entrepreneurId: ENTREPRENEUR_IDS.nopalStudio,
    });
    await repositories.fairs.activate(DEMO_FAIR_ID);

    const finished = await repositories.fairs.finish(
      DEMO_FAIR_ID,
      "2026-09-02T18:00:00.000Z",
    );

    assert.equal(finished.status, "upcoming");
    assert.equal(finished.endedAt, NOW);
    assert.equal(
      (await repositories.stands.list(DEMO_FAIR_ID)).every(
        (stand) =>
          stand.status === "available" &&
          stand.assignedEntrepreneurId === undefined &&
          stand.activeRequestId === undefined,
      ),
      true,
    );
    assert.equal(
      (await repositories.standRequests.getById(approvedRequest.id))?.status,
      "cancelled",
    );
    assert.equal(
      (await repositories.standRequests.getById(pendingRequest.id))?.status,
      "cancelled",
    );
  });
});
