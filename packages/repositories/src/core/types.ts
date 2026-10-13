import type {
  ID,
  ISODateTime,
  SharedCalpulliState,
} from "@calpulli/domain";
import type { SharedStateMutation } from "@calpulli/shared-store";

export interface SharedStateStore {
  readState(): Promise<SharedCalpulliState>;
  mutateSharedState(
    operation: SharedStateMutation,
  ): Promise<SharedCalpulliState>;
}

export interface RepositoryOptions {
  now?: () => ISODateTime;
  createId?: (prefix: string) => ID;
}

export interface RepositoryContext {
  store: SharedStateStore;
  now(): ISODateTime;
  createId(prefix: string): ID;
}

export type CreateEntityInput<
  T extends { id: ID; createdAt: ISODateTime; updatedAt: ISODateTime },
> = Omit<T, "id" | "createdAt" | "updatedAt"> & { id?: ID };

export type UpdateEntityInput<
  T extends { id: ID; createdAt: ISODateTime; updatedAt: ISODateTime },
> = Partial<Omit<T, "id" | "createdAt" | "updatedAt">>;
