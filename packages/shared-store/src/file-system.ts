import {
  SHARED_JSON_MIME_TYPE,
  SHARED_META_FILE_NAME,
  SHARED_STATE_BACKUP_FILE_NAME,
  SHARED_STATE_FILE_NAME,
  SHARED_STORE_FILE_NAMES,
  type SharedStoreFileName,
} from "./constants";
import { SharedStoreError, toSharedStoreError } from "./errors";

export interface SharedStoreFileSystem {
  listDirectory(directoryUri: string): Promise<string[]>;
  createDirectory(directoryUri: string, directoryName: string): Promise<string>;
  createFile(
    directoryUri: string,
    fileName: string,
    mimeType: string,
  ): Promise<string>;
  readText(fileUri: string): Promise<string>;
  readBase64(fileUri: string): Promise<string>;
  writeText(fileUri: string, contents: string): Promise<void>;
  writeBase64(fileUri: string, contents: string): Promise<void>;
  deleteFile(fileUri: string): Promise<void>;
}

export interface LocatedSharedStoreFiles {
  state?: string;
  backup?: string;
  meta?: string;
}

export interface SharedStoreFiles {
  state: string;
  backup: string;
  meta: string;
}

export interface DirectoryValidationOptions {
  writeProbe?: boolean;
  probeId?: string;
}

function decodeUri(uri: string): string {
  try {
    return decodeURIComponent(uri);
  } catch {
    return uri;
  }
}

export function isSafDirectoryUri(directoryUri: string): boolean {
  return directoryUri.trim().startsWith("content://");
}

export function uriHasFileName(uri: string, fileName: string): boolean {
  const decodedUri = decodeUri(uri).replace(/\/+$/, "");

  return (
    decodedUri.endsWith(`/${fileName}`) ||
    decodedUri.endsWith(`:${fileName}`)
  );
}

function assignLocatedFile(
  located: LocatedSharedStoreFiles,
  fileName: SharedStoreFileName,
  uri: string,
): void {
  if (fileName === SHARED_STATE_FILE_NAME) {
    located.state = uri;
  } else if (fileName === SHARED_STATE_BACKUP_FILE_NAME) {
    located.backup = uri;
  } else if (fileName === SHARED_META_FILE_NAME) {
    located.meta = uri;
  }
}

export async function locateSharedStoreFiles(
  fileSystem: SharedStoreFileSystem,
  directoryUri: string,
): Promise<LocatedSharedStoreFiles> {
  if (!isSafDirectoryUri(directoryUri)) {
    throw new SharedStoreError(
      "INVALID_DIRECTORY_URI",
      "La URI no corresponde a un directorio SAF de Android.",
    );
  }

  let entries: string[];

  try {
    entries = await fileSystem.listDirectory(directoryUri);
  } catch (error) {
    throw toSharedStoreError(
      error,
      "DIRECTORY_ACCESS_FAILED",
      "No se pudo leer el directorio compartido.",
    );
  }

  const located: LocatedSharedStoreFiles = {};

  for (const entryUri of entries) {
    for (const fileName of SHARED_STORE_FILE_NAMES) {
      if (uriHasFileName(entryUri, fileName)) {
        assignLocatedFile(located, fileName, entryUri);
      }
    }
  }

  return located;
}

async function createSharedStoreFile(
  fileSystem: SharedStoreFileSystem,
  directoryUri: string,
  fileName: SharedStoreFileName,
): Promise<string> {
  try {
    return await fileSystem.createFile(
      directoryUri,
      fileName,
      SHARED_JSON_MIME_TYPE,
    );
  } catch (error) {
    throw toSharedStoreError(
      error,
      "FILE_CREATE_FAILED",
      `No se pudo crear ${fileName}.`,
      { fileName },
    );
  }
}

export async function ensureSharedStoreFiles(
  fileSystem: SharedStoreFileSystem,
  directoryUri: string,
): Promise<SharedStoreFiles> {
  const located = await locateSharedStoreFiles(fileSystem, directoryUri);

  return {
    state:
      located.state ??
      (await createSharedStoreFile(
        fileSystem,
        directoryUri,
        SHARED_STATE_FILE_NAME,
      )),
    backup:
      located.backup ??
      (await createSharedStoreFile(
        fileSystem,
        directoryUri,
        SHARED_STATE_BACKUP_FILE_NAME,
      )),
    meta:
      located.meta ??
      (await createSharedStoreFile(
        fileSystem,
        directoryUri,
        SHARED_META_FILE_NAME,
      )),
  };
}

export async function validateSharedDirectoryUri(
  fileSystem: SharedStoreFileSystem,
  directoryUri: string,
  options: DirectoryValidationOptions = {},
): Promise<void> {
  await locateSharedStoreFiles(fileSystem, directoryUri);

  if (options.writeProbe === false) {
    return;
  }

  const probeId =
    options.probeId ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const probeName = `calpulli-write-test-${probeId}.txt`;
  const probeContents = `calpulli:${probeId}`;
  let probeUri: string | undefined;
  let probeError: unknown;

  try {
    probeUri = await fileSystem.createFile(
      directoryUri,
      probeName,
      "text/plain",
    );
    await fileSystem.writeText(probeUri, probeContents);
    const persistedContents = await fileSystem.readText(probeUri);

    if (persistedContents !== probeContents) {
      throw new Error("El contenido de prueba no coincide.");
    }
  } catch (error) {
    probeError = error;
  }

  if (probeUri !== undefined) {
    try {
      await fileSystem.deleteFile(probeUri);
    } catch (error) {
      probeError ??= error;
    }
  }

  if (probeError !== undefined) {
    throw toSharedStoreError(
      probeError,
      "DIRECTORY_WRITE_TEST_FAILED",
      "La carpeta no superó la prueba de lectura y escritura.",
    );
  }
}
