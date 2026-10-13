import type { Stand, StandBranch } from "@calpulli/domain";

import { DEMO_FAIR_ID } from "./fair";
import type { DemoSeedContext } from "./seed-context";

interface StandBranchSpec {
  branch: StandBranch;
  firstNumber: number;
  column: number;
}

const BRANCH_SPECS: readonly StandBranchSpec[] = [
  { branch: "from-3", firstNumber: 8, column: 2 },
  { branch: "from-5", firstNumber: 19, column: 4 },
  { branch: "from-7", firstNumber: 30, column: 6 },
];

function createStand(
  context: DemoSeedContext,
  number: number,
  row: number,
  column: number,
  branch: StandBranch,
  order: number,
): Stand {
  return {
    id: `stand-${String(number).padStart(2, "0")}`,
    fairId: DEMO_FAIR_ID,
    number,
    coordinate: { row, column, branch, order },
    status: "available",
    updatedAt: context.referenceTime,
  };
}

export function createDemoStands(context: DemoSeedContext): Stand[] {
  const topStands = Array.from({ length: 7 }, (_, index) =>
    createStand(context, index + 1, 0, index, "top", index + 1),
  );
  const branchStands = BRANCH_SPECS.flatMap((branch) =>
    Array.from({ length: 11 }, (_, index) =>
      createStand(
        context,
        branch.firstNumber + index,
        index + 1,
        branch.column,
        branch.branch,
        index + 1,
      ),
    ),
  );

  return [...topStands, ...branchStands];
}
