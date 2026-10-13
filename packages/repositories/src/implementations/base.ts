import type { RepositoryContext } from "../core";

export abstract class RepositoryBase {
  protected constructor(protected readonly context: RepositoryContext) {}
}
