import type { DomainValidationIssue, ID } from "@calpulli/domain";

export type RepositoryErrorCode =
  | "ENTITY_NOT_FOUND"
  | "DUPLICATE_ID"
  | "ENTITY_IN_USE"
  | "REFERENTIAL_INTEGRITY"
  | "DOMAIN_VALIDATION_FAILED"
  | "INVALID_TRANSITION";

export interface RepositoryErrorOptions {
  cause?: unknown;
  details?: Readonly<Record<string, unknown>>;
}

export class RepositoryError extends Error {
  readonly code: RepositoryErrorCode;
  readonly details?: Readonly<Record<string, unknown>>;

  constructor(
    code: RepositoryErrorCode,
    message: string,
    options: RepositoryErrorOptions = {},
  ) {
    super(message);
    this.name = "RepositoryError";
    this.code = code;
    this.details = options.details;

    if (options.cause !== undefined) {
      Object.defineProperty(this, "cause", {
        configurable: true,
        value: options.cause,
      });
    }
  }
}

export function entityNotFound(entityName: string, id: ID): RepositoryError {
  return new RepositoryError(
    "ENTITY_NOT_FOUND",
    `No existe ${entityName} con id ${id}.`,
    { details: { entityName, id } },
  );
}

export function domainValidationFailed(
  message: string,
  issues: readonly DomainValidationIssue[],
): RepositoryError {
  return new RepositoryError("DOMAIN_VALIDATION_FAILED", message, {
    details: { issues },
  });
}

export function isRepositoryError(error: unknown): error is RepositoryError {
  return error instanceof RepositoryError;
}
