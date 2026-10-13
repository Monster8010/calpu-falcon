export type SharedStoreErrorCode =
  | "SAF_UNAVAILABLE"
  | "DIRECTORY_PERMISSION_DENIED"
  | "INVALID_DIRECTORY_URI"
  | "DIRECTORY_ACCESS_FAILED"
  | "DIRECTORY_WRITE_TEST_FAILED"
  | "FILE_CREATE_FAILED"
  | "MEDIA_DIRECTORY_FAILED"
  | "MEDIA_CREATE_FAILED"
  | "MEDIA_READ_FAILED"
  | "MEDIA_TOO_LARGE"
  | "MEDIA_WRITE_FAILED"
  | "MEDIA_VERIFICATION_FAILED"
  | "UNSUPPORTED_MEDIA_TYPE"
  | "STATE_NOT_FOUND"
  | "META_NOT_FOUND"
  | "STATE_READ_FAILED"
  | "STATE_WRITE_FAILED"
  | "INVALID_JSON"
  | "INVALID_STATE"
  | "SCHEMA_VERSION_MISMATCH"
  | "STATE_ALREADY_EXISTS"
  | "REVISION_CONFLICT"
  | "WRITE_VERIFICATION_FAILED"
  | "BACKUP_RECOVERY_FAILED"
  | "MUTATION_FAILED";

export interface SharedStoreErrorOptions {
  cause?: unknown;
  details?: Readonly<Record<string, unknown>>;
}

export class SharedStoreError extends Error {
  readonly code: SharedStoreErrorCode;
  readonly details?: Readonly<Record<string, unknown>>;

  constructor(
    code: SharedStoreErrorCode,
    message: string,
    options: SharedStoreErrorOptions = {},
  ) {
    super(message);
    this.name = "SharedStoreError";
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

export function isSharedStoreError(error: unknown): error is SharedStoreError {
  return error instanceof SharedStoreError;
}

export function toSharedStoreError(
  error: unknown,
  code: SharedStoreErrorCode,
  message: string,
  details?: Readonly<Record<string, unknown>>,
): SharedStoreError {
  if (isSharedStoreError(error)) {
    return error;
  }

  return new SharedStoreError(code, message, { cause: error, details });
}
