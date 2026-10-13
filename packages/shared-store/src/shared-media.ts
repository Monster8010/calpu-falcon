import type { MediaReference } from "@calpulli/domain";

import {
  isSafDirectoryUri,
  uriHasFileName,
  type SharedStoreFileSystem,
} from "./file-system";
import { SharedStoreError, toSharedStoreError } from "./errors";

export const SHARED_MEDIA_DIRECTORY_NAME = "media";
export const DEFAULT_SHARED_IMAGE_MAX_BYTES = 8 * 1024 * 1024;

const IMAGE_EXTENSION_BY_MIME_TYPE = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
} as const;

export type SupportedSharedImageMimeType =
  keyof typeof IMAGE_EXTENSION_BY_MIME_TYPE;

export interface SharedImageSource {
  fileName?: string;
  mimeType: string;
  uri: string;
}

export interface CopySharedImageOptions {
  fileId?: string;
  maxBytes?: number;
}

function normalizedMimeType(value: string): string {
  return value.trim().toLowerCase().split(";", 1)[0] ?? "";
}

function requireSupportedMimeType(value: string): SupportedSharedImageMimeType {
  const normalized = normalizedMimeType(value);
  if (normalized in IMAGE_EXTENSION_BY_MIME_TYPE) {
    return normalized as SupportedSharedImageMimeType;
  }
  throw new SharedStoreError(
    "UNSUPPORTED_MEDIA_TYPE",
    "Selecciona una imagen JPEG, PNG o WebP.",
    { details: { mimeType: value } },
  );
}

function base64ByteLength(contents: string): number {
  const padding = contents.endsWith("==") ? 2 : contents.endsWith("=") ? 1 : 0;
  return Math.max(0, Math.floor((contents.length * 3) / 4) - padding);
}

function safeFileId(value: string): string {
  const normalized = value.replace(/[^a-zA-Z0-9_-]/g, "-").slice(0, 80);
  return normalized || "image";
}

function createDefaultFileId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

async function ensureMediaDirectory(
  fileSystem: SharedStoreFileSystem,
  directoryUri: string,
): Promise<string> {
  if (!isSafDirectoryUri(directoryUri)) {
    throw new SharedStoreError(
      "INVALID_DIRECTORY_URI",
      "La URI no corresponde a un directorio SAF de Android.",
    );
  }

  try {
    const entries = await fileSystem.listDirectory(directoryUri);
    const existing = entries.find((uri) =>
      uriHasFileName(uri, SHARED_MEDIA_DIRECTORY_NAME),
    );
    return existing ?? await fileSystem.createDirectory(
      directoryUri,
      SHARED_MEDIA_DIRECTORY_NAME,
    );
  } catch (error) {
    throw toSharedStoreError(
      error,
      "MEDIA_DIRECTORY_FAILED",
      "No se pudo localizar o crear la carpeta media compartida.",
    );
  }
}

export async function copyImageToSharedMedia(
  fileSystem: SharedStoreFileSystem,
  directoryUri: string,
  source: SharedImageSource,
  options: CopySharedImageOptions = {},
): Promise<Extract<MediaReference, { type: "shared" }>> {
  const mimeType = requireSupportedMimeType(source.mimeType);
  const maxBytes = options.maxBytes ?? DEFAULT_SHARED_IMAGE_MAX_BYTES;
  if (!Number.isInteger(maxBytes) || maxBytes < 1) {
    throw new RangeError("maxBytes debe ser un entero positivo.");
  }
  if (source.uri.trim().length === 0) {
    throw new SharedStoreError(
      "MEDIA_READ_FAILED",
      "La imagen seleccionada no tiene una URI legible.",
    );
  }

  let contents: string;
  try {
    contents = await fileSystem.readBase64(source.uri);
  } catch (error) {
    throw toSharedStoreError(
      error,
      "MEDIA_READ_FAILED",
      "No se pudo leer la imagen seleccionada.",
    );
  }

  const size = base64ByteLength(contents);
  if (size === 0 || size > maxBytes) {
    throw new SharedStoreError(
      "MEDIA_TOO_LARGE",
      size === 0
        ? "La imagen seleccionada está vacía."
        : `La imagen supera el límite de ${Math.floor(maxBytes / 1024 / 1024)} MB.`,
      { details: { maxBytes, size } },
    );
  }

  const mediaDirectoryUri = await ensureMediaDirectory(fileSystem, directoryUri);
  const fileId = safeFileId(options.fileId ?? createDefaultFileId());
  const storageName = `calpulli-image-${fileId}`;
  let targetUri: string;
  try {
    targetUri = await fileSystem.createFile(
      mediaDirectoryUri,
      storageName,
      mimeType,
    );
  } catch (error) {
    throw toSharedStoreError(
      error,
      "MEDIA_CREATE_FAILED",
      "No se pudo crear el archivo de imagen compartido.",
    );
  }

  try {
    await fileSystem.writeBase64(targetUri, contents);
    const persisted = await fileSystem.readBase64(targetUri);
    if (persisted !== contents) {
      throw new SharedStoreError(
        "MEDIA_VERIFICATION_FAILED",
        "La imagen copiada no superó la verificación posterior a escritura.",
      );
    }
  } catch (error) {
    await fileSystem.deleteFile(targetUri).catch(() => undefined);
    throw toSharedStoreError(
      error,
      "MEDIA_WRITE_FAILED",
      "No se pudo guardar y verificar la imagen compartida.",
    );
  }

  const extension = IMAGE_EXTENSION_BY_MIME_TYPE[mimeType];
  return {
    type: "shared",
    uri: targetUri,
    mimeType,
    fileName: source.fileName?.trim() || `${storageName}.${extension}`,
  };
}
