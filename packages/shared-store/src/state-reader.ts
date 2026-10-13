import type { SharedCalpulliState, SharedMeta } from "@calpulli/domain";

import { SHARED_STATE_SCHEMA_VERSION } from "./constants";
import {
  SharedStoreError,
  isSharedStoreError,
  toSharedStoreError,
} from "./errors";
import {
  locateSharedStoreFiles,
  type SharedStoreFileSystem,
} from "./file-system";
import { parseSharedCalpulliState, parseSharedMeta } from "./validation";

export type SharedStateSource = "primary" | "backup";

export interface SharedStateSnapshot {
  state: SharedCalpulliState;
  source: SharedStateSource;
}

async function readText(
  fileSystem: SharedStoreFileSystem,
  fileUri: string,
): Promise<string> {
  try {
    return await fileSystem.readText(fileUri);
  } catch (error) {
    throw toSharedStoreError(
      error,
      "STATE_READ_FAILED",
      "No se pudo leer el archivo compartido.",
      { fileUri },
    );
  }
}

async function readStateFile(
  fileSystem: SharedStoreFileSystem,
  fileUri: string,
  expectedSchemaVersion: number,
): Promise<SharedCalpulliState> {
  const contents = await readText(fileSystem, fileUri);
  return parseSharedCalpulliState(contents, expectedSchemaVersion);
}

function canRecoverFromBackup(error: unknown): boolean {
  return (
    isSharedStoreError(error) &&
    (error.code === "INVALID_JSON" ||
      error.code === "INVALID_STATE" ||
      error.code === "STATE_READ_FAILED")
  );
}

export async function readSharedStateSnapshot(
  fileSystem: SharedStoreFileSystem,
  directoryUri: string,
  expectedSchemaVersion = SHARED_STATE_SCHEMA_VERSION,
): Promise<SharedStateSnapshot> {
  const files = await locateSharedStoreFiles(fileSystem, directoryUri);
  let primaryError: unknown;

  if (files.state !== undefined) {
    try {
      return {
        state: await readStateFile(
          fileSystem,
          files.state,
          expectedSchemaVersion,
        ),
        source: "primary",
      };
    } catch (error) {
      if (!canRecoverFromBackup(error)) {
        throw error;
      }

      primaryError = error;
    }
  }

  if (files.backup !== undefined) {
    try {
      return {
        state: await readStateFile(
          fileSystem,
          files.backup,
          expectedSchemaVersion,
        ),
        source: "backup",
      };
    } catch (error) {
      if (
        isSharedStoreError(error) &&
        error.code === "SCHEMA_VERSION_MISMATCH"
      ) {
        throw error;
      }

      throw new SharedStoreError(
        "BACKUP_RECOVERY_FAILED",
        "El estado principal no está disponible y el respaldo tampoco pudo recuperarse.",
        {
          cause: error,
          details: {
            primaryErrorCode: isSharedStoreError(primaryError)
              ? primaryError.code
              : undefined,
          },
        },
      );
    }
  }

  if (primaryError !== undefined) {
    throw primaryError;
  }

  throw new SharedStoreError(
    "STATE_NOT_FOUND",
    "La carpeta está conectada, pero todavía no contiene datos de Calpulli.",
  );
}

export async function readSharedMeta(
  fileSystem: SharedStoreFileSystem,
  directoryUri: string,
  expectedSchemaVersion = SHARED_STATE_SCHEMA_VERSION,
): Promise<SharedMeta> {
  const files = await locateSharedStoreFiles(fileSystem, directoryUri);

  if (files.meta === undefined) {
    throw new SharedStoreError(
      "META_NOT_FOUND",
      "No se encontró shared-meta.json.",
    );
  }

  const contents = await readText(fileSystem, files.meta);
  return parseSharedMeta(contents, expectedSchemaVersion);
}
