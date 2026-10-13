import type { ID } from "@calpulli/domain";

import type {
  RepositoryContext,
  RepositoryOptions,
  SharedStateStore,
} from "./types";

function defaultCreateId(prefix: string): ID {
  const time = Date.now().toString(36);
  const random = Math.random().toString(36).slice(2, 10);
  return `${prefix}-${time}-${random}`;
}

export function createRepositoryContext(
  store: SharedStateStore,
  options: RepositoryOptions = {},
): RepositoryContext {
  return {
    store,
    now: options.now ?? (() => new Date().toISOString()),
    createId: options.createId ?? defaultCreateId,
  };
}
