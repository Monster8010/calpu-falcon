import type {
  ISODateTime,
  SharedCalpulliState,
  SharedMeta,
  SharedWriter,
} from "@calpulli/domain";

import {
  MAX_MUTATION_ATTEMPTS,
  SHARED_STATE_SCHEMA_VERSION,
} from "./constants";
import {
  SharedStoreError,
  isSharedStoreError,
} from "./errors";
import {
  ensureSharedStoreFiles,
  locateSharedStoreFiles,
  validateSharedDirectoryUri,
  type DirectoryValidationOptions,
  type LocatedSharedStoreFiles,
  type SharedStoreFileSystem,
} from "./file-system";
import {
  readSharedMeta,
  readSharedStateSnapshot,
  type SharedStateSnapshot,
} from "./state-reader";
import {
  initializeSharedStateFiles,
  writeStateSetVerified,
  type InitializeSharedStateOptions,
} from "./state-writer";
import {
  assertSharedCalpulliState,
  parseSharedCalpulliState,
} from "./validation";
import {
  copyImageToSharedMedia,
  type CopySharedImageOptions,
  type SharedImageSource,
} from "./shared-media";

export type SharedStateMutation = (
  draft: SharedCalpulliState,
) => SharedCalpulliState | void;

export interface SharedStoreOptions {
  fileSystem: SharedStoreFileSystem;
  directoryUri: string;
  writer: SharedWriter;
  schemaVersion?: number;
  maxMutationAttempts?: number;
  now?: () => ISODateTime;
}

function cloneState(
  state: SharedCalpulliState,
  schemaVersion: number,
): SharedCalpulliState {
  return parseSharedCalpulliState(JSON.stringify(state), schemaVersion);
}

export class SharedStore {
  readonly directoryUri: string;

  private readonly fileSystem: SharedStoreFileSystem;
  private readonly writer: SharedWriter;
  private readonly schemaVersion: number;
  private readonly maxMutationAttempts: number;
  private readonly now: () => ISODateTime;

  constructor(options: SharedStoreOptions) {
    this.fileSystem = options.fileSystem;
    this.directoryUri = options.directoryUri;
    this.writer = options.writer;
    this.schemaVersion =
      options.schemaVersion ?? SHARED_STATE_SCHEMA_VERSION;
    this.maxMutationAttempts =
      options.maxMutationAttempts ?? MAX_MUTATION_ATTEMPTS;
    this.now = options.now ?? (() => new Date().toISOString());

    if (!Number.isInteger(this.maxMutationAttempts) || this.maxMutationAttempts < 1) {
      throw new RangeError("maxMutationAttempts debe ser un entero positivo.");
    }
  }

  validateDirectory(options?: DirectoryValidationOptions): Promise<void> {
    return validateSharedDirectoryUri(
      this.fileSystem,
      this.directoryUri,
      options,
    );
  }

  locateFiles(): Promise<LocatedSharedStoreFiles> {
    return locateSharedStoreFiles(this.fileSystem, this.directoryUri);
  }

  readStateSnapshot(): Promise<SharedStateSnapshot> {
    return readSharedStateSnapshot(
      this.fileSystem,
      this.directoryUri,
      this.schemaVersion,
    );
  }

  async readState(): Promise<SharedCalpulliState> {
    return (await this.readStateSnapshot()).state;
  }

  readMeta(): Promise<SharedMeta> {
    return readSharedMeta(
      this.fileSystem,
      this.directoryUri,
      this.schemaVersion,
    );
  }

  copyImageToMedia(
    source: SharedImageSource,
    options?: CopySharedImageOptions,
  ) {
    return copyImageToSharedMedia(
      this.fileSystem,
      this.directoryUri,
      source,
      options,
    );
  }

  initializeState(
    state: SharedCalpulliState,
    options?: InitializeSharedStateOptions,
  ): Promise<SharedCalpulliState> {
    return initializeSharedStateFiles(
      this.fileSystem,
      this.directoryUri,
      state,
      options,
      this.schemaVersion,
    );
  }

  async mutateSharedState(
    operation: SharedStateMutation,
  ): Promise<SharedCalpulliState> {
    for (let attempt = 1; attempt <= this.maxMutationAttempts; attempt += 1) {
      const baseSnapshot = await this.readStateSnapshot();
      const baseState = baseSnapshot.state;
      const draft = cloneState(baseState, this.schemaVersion);
      let operationResult: SharedCalpulliState | void;

      try {
        operationResult = operation(draft);
      } catch (error) {
        if (isSharedStoreError(error)) {
          throw error;
        }

        throw new SharedStoreError(
          "MUTATION_FAILED",
          "La operación de dominio no pudo aplicarse.",
          { cause: error },
        );
      }

      const operationState = operationResult ?? draft;
      const nextState: SharedCalpulliState = {
        ...operationState,
        meta: {
          ...baseState.meta,
          schemaVersion: this.schemaVersion,
          revision: baseState.meta.revision + 1,
          updatedAt: this.now(),
          lastWriter: this.writer,
        },
      };

      assertSharedCalpulliState(nextState, this.schemaVersion);

      const latestSnapshot = await this.readStateSnapshot();

      if (latestSnapshot.state.meta.revision !== baseState.meta.revision) {
        continue;
      }

      const files = await ensureSharedStoreFiles(
        this.fileSystem,
        this.directoryUri,
      );

      await writeStateSetVerified(
        this.fileSystem,
        files,
        baseState,
        nextState,
        this.schemaVersion,
      );

      return nextState;
    }

    throw new SharedStoreError(
      "REVISION_CONFLICT",
      `El estado cambió durante ${this.maxMutationAttempts} intentos consecutivos.`,
      { details: { attempts: this.maxMutationAttempts } },
    );
  }
}
