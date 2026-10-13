import type { SharedWriter } from "@calpulli/domain";
import {
  EncodingType,
  StorageAccessFramework,
} from "expo-file-system/legacy";

import { SharedStoreError, toSharedStoreError } from "./errors";
import {
  validateSharedDirectoryUri,
  type DirectoryValidationOptions,
  type SharedStoreFileSystem,
} from "./file-system";
import { SharedStore } from "./shared-store";

const expoSafFileSystem: SharedStoreFileSystem = {
  listDirectory(directoryUri) {
    return StorageAccessFramework.readDirectoryAsync(directoryUri);
  },
  createDirectory(directoryUri, directoryName) {
    return StorageAccessFramework.makeDirectoryAsync(
      directoryUri,
      directoryName,
    );
  },
  createFile(directoryUri, fileName, mimeType) {
    return StorageAccessFramework.createFileAsync(
      directoryUri,
      fileName,
      mimeType,
    );
  },
  readText(fileUri) {
    return StorageAccessFramework.readAsStringAsync(fileUri);
  },
  readBase64(fileUri) {
    return StorageAccessFramework.readAsStringAsync(fileUri, {
      encoding: EncodingType.Base64,
    });
  },
  writeText(fileUri, contents) {
    return StorageAccessFramework.writeAsStringAsync(fileUri, contents);
  },
  writeBase64(fileUri, contents) {
    return StorageAccessFramework.writeAsStringAsync(fileUri, contents, {
      encoding: EncodingType.Base64,
    });
  },
  deleteFile(fileUri) {
    return StorageAccessFramework.deleteAsync(fileUri, { idempotent: true });
  },
};

export async function requestSharedDirectory(
  initialDirectoryUri?: string,
): Promise<string> {
  try {
    const permission =
      await StorageAccessFramework.requestDirectoryPermissionsAsync(
        initialDirectoryUri,
      );

    if (!permission.granted) {
      throw new SharedStoreError(
        "DIRECTORY_PERMISSION_DENIED",
        "No se concedió acceso a una carpeta compartida.",
      );
    }

    return permission.directoryUri;
  } catch (error) {
    throw toSharedStoreError(
      error,
      "SAF_UNAVAILABLE",
      "No se pudo abrir el selector de carpetas de Android.",
    );
  }
}

export function validateExpoSharedDirectory(
  directoryUri: string,
  options?: DirectoryValidationOptions,
): Promise<void> {
  return validateSharedDirectoryUri(
    expoSafFileSystem,
    directoryUri,
    options,
  );
}

export function createExpoSafSharedStore(
  directoryUri: string,
  writer: SharedWriter,
): SharedStore {
  return new SharedStore({
    directoryUri,
    fileSystem: expoSafFileSystem,
    writer,
  });
}
