import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { Stand, StandBranch } from "@calpulli/domain";

import { createDemoSeed } from "../src/seed";

const REFERENCE_TIME = "2026-08-10T12:00:00.000Z";

function standsInBranch(stands: Stand[], branch: StandBranch): Stand[] {
  return stands.filter((stand) => stand.coordinate.branch === branch);
}

describe("geometría de stands", () => {
  it("genera 7 arriba y 11 debajo de las mesas 3, 5 y 7", () => {
    const stands = createDemoSeed(REFERENCE_TIME).stands;

    assert.equal(stands.length, 40);
    assert.equal(standsInBranch(stands, "top").length, 7);
    assert.equal(standsInBranch(stands, "from-3").length, 11);
    assert.equal(standsInBranch(stands, "from-5").length, 11);
    assert.equal(standsInBranch(stands, "from-7").length, 11);
  });

  it("respeta numeración, columnas, filas y orden", () => {
    const stands = createDemoSeed(REFERENCE_TIME).stands;
    const expectedBranches = [
      { branch: "from-3", first: 8, last: 18, column: 2 },
      { branch: "from-5", first: 19, last: 29, column: 4 },
      { branch: "from-7", first: 30, last: 40, column: 6 },
    ] as const;

    assert.deepEqual(
      stands.map(({ number }) => number),
      Array.from({ length: 40 }, (_, index) => index + 1),
    );

    const top = standsInBranch(stands, "top");
    assert.deepEqual(
      top.map(({ coordinate }) => coordinate),
      Array.from({ length: 7 }, (_, index) => ({
        row: 0,
        column: index,
        branch: "top",
        order: index + 1,
      })),
    );

    for (const expected of expectedBranches) {
      const branchStands = standsInBranch(stands, expected.branch);
      assert.deepEqual(
        branchStands.map(({ number }) => number),
        Array.from(
          { length: expected.last - expected.first + 1 },
          (_, index) => expected.first + index,
        ),
      );
      assert.deepEqual(
        branchStands.map(({ coordinate }) => coordinate),
        Array.from({ length: 11 }, (_, index) => ({
          row: index + 1,
          column: expected.column,
          branch: expected.branch,
          order: index + 1,
        })),
      );
    }
  });

  it("no duplica coordenadas y deja todas las mesas disponibles", () => {
    const stands = createDemoSeed(REFERENCE_TIME).stands;
    const coordinates = stands.map(
      ({ coordinate }) =>
        `${coordinate.row}:${coordinate.column}:${coordinate.branch}:${coordinate.order}`,
    );

    assert.equal(new Set(coordinates).size, 40);

    for (const stand of stands) {
      assert.equal(stand.status, "available");
      assert.equal(stand.assignedEntrepreneurId, undefined);
      assert.equal(stand.activeRequestId, undefined);
    }
  });
});
