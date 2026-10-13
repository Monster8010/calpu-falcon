import type { Fair } from "@calpulli/domain";

import type { DemoSeedContext } from "./seed-context";

export const DEMO_FAIR_ID = "fair-calpulli";

export function createDemoFairs(context: DemoSeedContext): Fair[] {
  return [
    {
      id: DEMO_FAIR_ID,
      name: "Feria de Emprendimiento Calpulli",
      status: "upcoming",
      nextDate: context.nextFairDate,
      recurrenceHintDays: 15,
      recurrenceHintWeekday: 3,
      createdAt: context.atDays(-30),
      updatedAt: context.referenceTime,
    },
  ];
}
