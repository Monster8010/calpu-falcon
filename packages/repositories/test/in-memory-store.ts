import type { SharedCalpulliState } from "@calpulli/domain";
import type { SharedStateMutation } from "@calpulli/shared-store";

import type { SharedStateStore } from "../src";

function cloneState(state: SharedCalpulliState): SharedCalpulliState {
  return structuredClone(state);
}

export class InMemorySharedStateStore implements SharedStateStore {
  readCount = 0;
  mutationCount = 0;

  private state: SharedCalpulliState;

  constructor(initialState: SharedCalpulliState) {
    this.state = cloneState(initialState);
  }

  async readState(): Promise<SharedCalpulliState> {
    this.readCount += 1;
    return cloneState(this.state);
  }

  async mutateSharedState(
    operation: SharedStateMutation,
  ): Promise<SharedCalpulliState> {
    const draft = cloneState(this.state);
    const operationResult = operation(draft);
    const next = operationResult ?? draft;
    this.mutationCount += 1;
    this.state = {
      ...next,
      meta: {
        ...next.meta,
        revision: this.state.meta.revision + 1,
        updatedAt: "2026-08-10T15:00:00.000Z",
        lastWriter: "gestion-calpulli",
      },
    };
    return cloneState(this.state);
  }
}
