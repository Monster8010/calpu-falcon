import type { DomainValidationResult, ID } from "@calpulli/domain";

import {
  RepositoryError,
  domainValidationFailed,
  entityNotFound,
} from "./errors";

export interface EntityWithId {
  id: ID;
}

export function findEntityById<T extends EntityWithId>(
  entities: readonly T[],
  id: ID,
): T | undefined {
  return entities.find((entity) => entity.id === id);
}

export function requireEntityById<T extends EntityWithId>(
  entities: readonly T[],
  id: ID,
  entityName: string,
): T {
  const entity = findEntityById(entities, id);

  if (entity === undefined) {
    throw entityNotFound(entityName, id);
  }

  return entity;
}

export function assertUniqueEntityId<T extends EntityWithId>(
  entities: readonly T[],
  id: ID,
  entityName: string,
): void {
  if (findEntityById(entities, id) !== undefined) {
    throw new RepositoryError(
      "DUPLICATE_ID",
      `Ya existe ${entityName} con id ${id}.`,
      { details: { entityName, id } },
    );
  }
}

export function assertReference(
  exists: boolean,
  message: string,
  details?: Readonly<Record<string, unknown>>,
): void {
  if (!exists) {
    throw new RepositoryError("REFERENTIAL_INTEGRITY", message, { details });
  }
}

export function assertNotInUse(
  inUse: boolean,
  message: string,
  details?: Readonly<Record<string, unknown>>,
): void {
  if (inUse) {
    throw new RepositoryError("ENTITY_IN_USE", message, { details });
  }
}

export function assertDomainValidation(
  result: DomainValidationResult,
  message: string,
): void {
  if (!result.valid) {
    throw domainValidationFailed(message, result.issues);
  }
}
