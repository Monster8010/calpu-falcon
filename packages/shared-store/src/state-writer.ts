import type { SharedCalpulliState, SharedMeta } from "@calpulli/domain";

import { SHARED_STATE_SCHEMA_VERSION } from "./constants";
import { SharedStoreError, toSharedStoreError } from "./errors";
import {
  ensureSharedStoreFiles,
  locateSharedStoreFiles,
  type SharedStoreFileSystem,
  type SharedStoreFiles,
} from "./file-system";
import {
  assertSharedCalpulliState,
  parseSharedCalpulliState,
  parseSharedMeta,
  serializeSharedJson,
  sharedJsonEquals,
} from "./validation";

export interface InitializeSharedStateOptions {
  overwrite?: boolean;
}

async function writeText(
  fileSystem: SharedStoreFileSystem,
  fileUri: string,
  contents: string,
): Promise<void> {
  try {
    await fileSystem.writeText(fileUri, contents);
  } catch (error) {
    throw toSharedStoreError(
      error,
      "STATE_WRITE_FAILED",
      "No se pudo escribir el archivo compartido.",
      { fileUri },
    );
  }
}

export async function writeStateFileVerified(
  fileSystem: SharedStoreFileSystem,
  fileUri: string,
  state: SharedCalpulliState,
  expectedSchemaVersion = SHARED_STATE_SCHEMA_VERSION,
): Promise<void> {
  const serialized = serializeSharedJson(state);
  await writeText(fileSystem, fileUri, serialized);

  try {
    const persistedContents = await fileSystem.readText(fileUri);
    const persistedState = parseSharedCalpulliState(
      persistedContents,
      expectedSchemaVersion,
    );

    if (!sharedJsonEquals(persistedState, state)) {
      throw new Error("El estado releído no coincide con el estado escrito.");
    }
  } catch (error) {
    throw new SharedStoreError(
      "WRITE_VERIFICATION_FAILED",
      "No se pudo verificar el estado después de escribirlo.",
      { cause: error, details: { fileUri } },
    );
  }
}

export async function writeMetaFileVerified(
  fileSystem: SharedStoreFileSystem,
  fileUri: string,
  meta: SharedMeta,
  expectedSchemaVersion = SHARED_STATE_SCHEMA_VERSION,
): Promise<void> {
  const serialized = serializeSharedJson(meta);
  await writeText(fileSystem, fileUri, serialized);

  try {
    const persistedContents = await fileSystem.readText(fileUri);
    const persistedMeta = parseSharedMeta(
      persistedContents,
      expectedSchemaVersion,
    );

    if (!sharedJsonEquals(persistedMeta, meta)) {
      throw new Error("Los metadatos releídos no coinciden.");
    }
  } catch (error) {
    throw new SharedStoreError(
      "WRITE_VERIFICATION_FAILED",
      "No se pudo verificar shared-meta.json después de escribirlo.",
      { cause: error, details: { fileUri } },
    );
  }
}

export async function writeStateSetVerified(
  fileSystem: SharedStoreFileSystem,
  files: SharedStoreFiles,
  previousState: SharedCalpulliState,
  nextState: SharedCalpulliState,
  expectedSchemaVersion = SHARED_STATE_SCHEMA_VERSION,
): Promise<void> {
  await writeStateFileVerified(
    fileSystem,
    files.backup,
    previousState,
    expectedSchemaVersion,
  );
  await writeMetaFileVerified(
    fileSystem,
    files.meta,
    nextState.meta,
    expectedSchemaVersion,
  );
  await writeStateFileVerified(
    fileSystem,
    files.state,
    nextState,
    expectedSchemaVersion,
  );
}

export async function initializeSharedStateFiles(
  fileSystem: SharedStoreFileSystem,
  directoryUri: string,
  state: SharedCalpulliState,
  options: InitializeSharedStateOptions = {},
  expectedSchemaVersion = SHARED_STATE_SCHEMA_VERSION,
): Promise<SharedCalpulliState> {
  assertSharedCalpulliState(state, expectedSchemaVersion);
  const located = await locateSharedStoreFiles(fileSystem, directoryUri);

  if (located.state !== undefined && options.overwrite !== true) {
    throw new SharedStoreError(
      "STATE_ALREADY_EXISTS",
      "La carpeta ya contiene calpulli-state.json.",
    );
  }

  const files = await ensureSharedStoreFiles(fileSystem, directoryUri);

  await writeStateFileVerified(
    fileSystem,
    files.backup,
    state,
    expectedSchemaVersion,
  );
  await writeMetaFileVerified(
    fileSystem,
    files.meta,
    state.meta,
    expectedSchemaVersion,
  );
  await writeStateFileVerified(
    fileSystem,
    files.state,
    state,
    expectedSchemaVersion,
  );

  return state;
}
