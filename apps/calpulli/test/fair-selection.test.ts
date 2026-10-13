import type { Fair, Stand, StandBranch } from "@calpulli/domain";
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  getFairMapMetrics,
  getStandMapPosition,
  selectPublicFair,
} from "../features/fair/fair-selection";

const TIMESTAMP = "2026-08-10T12:00:00.000Z";

describe("selección de feria pública", () => {
  it("prefiere la feria activa aunque exista una próxima más temprana", () => {
    const upcoming = createFair({ id: "upcoming", nextDate: "2026-08-11T12:00:00.000Z" });
    const active = createFair({ id: "active", status: "active", nextDate: "2026-08-20T12:00:00.000Z" });

    assert.equal(selectPublicFair([upcoming, active])?.id, "active");
  });

  it("sin edición activa elige la próxima fecha más cercana", () => {
    const later = createFair({ id: "later", nextDate: "2026-09-10T12:00:00.000Z" });
    const sooner = createFair({ id: "sooner", nextDate: "2026-08-20T12:00:00.000Z" });

    assert.equal(selectPublicFair([later, sooner])?.id, "sooner");
    assert.equal(selectPublicFair([]), undefined);
  });
});

describe("geometría del mapa público", () => {
  it("deriva una retícula de 7 por 12 para las 40 coordenadas documentadas", () => {
    const stands = createFortyStands();
    const metrics = getFairMapMetrics(stands, 44, 8);
    const positions = stands.map((stand) => getStandMapPosition(stand, 44, 8));

    assert.equal(stands.length, 40);
    assert.deepEqual(metrics, {
      columns: 7,
      rows: 12,
      width: 356,
      height: 616,
    });
    assert.equal(
      new Set(positions.map(({ left, top }) => `${left}:${top}`)).size,
      40,
    );
  });

  it("calcula cada posición desde row y column, no desde el número de mesa", () => {
    const stand = createStand(40, 11, 6, "from-7", 11);

    assert.deepEqual(getStandMapPosition(stand, 48, 6), {
      left: 324,
      top: 594,
    });
  });
});

function createFair(overrides: Partial<Fair> = {}): Fair {
  return {
    id: "fair",
    name: "Feria Calpulli",
    status: "upcoming",
    nextDate: "2026-08-20T12:00:00.000Z",
    recurrenceHintDays: 15,
    recurrenceHintWeekday: 3,
    createdAt: TIMESTAMP,
    updatedAt: TIMESTAMP,
    ...overrides,
  };
}

function createFortyStands(): Stand[] {
  const top = Array.from({ length: 7 }, (_, column) =>
    createStand(column + 1, 0, column, "top", column + 1),
  );
  const branches: Array<{ branch: StandBranch; column: number }> = [
    { branch: "from-3", column: 2 },
    { branch: "from-5", column: 4 },
    { branch: "from-7", column: 6 },
  ];

  return [
    ...top,
    ...branches.flatMap(({ branch, column }, branchIndex) =>
      Array.from({ length: 11 }, (_, index) =>
        createStand(8 + branchIndex * 11 + index, index + 1, column, branch, index + 1),
      ),
    ),
  ];
}

function createStand(
  number: number,
  row: number,
  column: number,
  branch: StandBranch,
  order: number,
): Stand {
  return {
    id: `stand-${number}`,
    fairId: "fair",
    number,
    coordinate: { row, column, branch, order },
    status: "available",
    updatedAt: TIMESTAMP,
  };
}
