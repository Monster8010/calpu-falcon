import assert from "node:assert/strict";
import test from "node:test";

import type { Fair, Stand, StandRequest } from "@calpulli/domain";

import {
  FairAdminDateError,
  getFairAdminSummary,
  normalizeFutureFairDate,
  selectFairForAdministration,
  sortFairRequests,
  suggestNextFairDate,
} from "../features/fair-admin/fair-admin-models";

const NOW = "2026-08-10T14:00:00.000Z";

function fair(patch: Partial<Fair> = {}): Fair {
  return {
    id: "fair-1",
    name: "Feria Calpulli",
    status: "upcoming",
    nextDate: "2026-08-12T18:00:00.000Z",
    recurrenceHintDays: 15,
    recurrenceHintWeekday: 3,
    createdAt: NOW,
    updatedAt: NOW,
    ...patch,
  };
}

test("selecciona primero la feria activa y luego la upcoming más cercana", () => {
  const later = fair({ id: "later", nextDate: "2026-09-02T18:00:00.000Z" });
  const active = fair({ id: "active", status: "active" });
  const earlier = fair({ id: "earlier", nextDate: "2026-08-19T18:00:00.000Z" });

  assert.equal(selectFairForAdministration([later, active, earlier])?.id, "active");
  assert.equal(selectFairForAdministration([later, earlier])?.id, "earlier");
});

test("resume stands y solicitudes de la edición", () => {
  const stands = [
    { status: "available" },
    { status: "requested" },
    { status: "assigned" },
  ] as Stand[];
  const requests = [
    { status: "pending" },
    { status: "approved" },
  ] as StandRequest[];

  assert.deepEqual(getFairAdminSummary(stands, requests), {
    stands: 3,
    available: 1,
    requested: 1,
    assigned: 1,
    pendingRequests: 1,
  });
});

test("sugiere el primer miércoles en o después del intervalo +15", () => {
  assert.equal(
    suggestNextFairDate(fair(), NOW),
    "2026-09-02T18:00:00.000Z",
  );
});

test("la fecha editable debe permanecer en el futuro", () => {
  assert.equal(
    normalizeFutureFairDate("2026-08-20T18:00:00.000Z", NOW),
    "2026-08-20T18:00:00.000Z",
  );
  assert.throws(
    () => normalizeFutureFairDate("2026-08-09T18:00:00.000Z", NOW),
    FairAdminDateError,
  );
});

test("ordena solicitudes pendientes primero y por fecha descendente", () => {
  const requests = [
    { id: "approved", status: "approved", requestedAt: "2026-08-10T13:00:00.000Z" },
    { id: "pending-old", status: "pending", requestedAt: "2026-08-10T12:00:00.000Z" },
    { id: "pending-new", status: "pending", requestedAt: "2026-08-10T14:00:00.000Z" },
  ] as StandRequest[];

  assert.deepEqual(
    sortFairRequests(requests).map(({ id }) => id),
    ["pending-new", "pending-old", "approved"],
  );
});
