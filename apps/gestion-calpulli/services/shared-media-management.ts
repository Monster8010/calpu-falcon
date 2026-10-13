import {
  SharedStoreError,
  createExpoSafSharedStore,
} from "@calpulli/shared-store";
import * as ImagePicker from "expo-image-picker";

import type { PendingSharedImage } from "../features/departments/department-form-models";
import { loadDirectoryUri } from "./directory-uri-storage";
import { ManagementStorageNotConnectedError } from "./management-repositories";

const MIME_TYPE_BY_EXTENSION: Readonly<Record<string, string>> = {
  jpeg: "image/jpeg",
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

const SUPPORTED_MIME_TYPES = new Set(Object.values(MIME_TYPE_BY_EXTENSION));

function inferSupportedMimeType(asset: ImagePicker.ImagePickerAsset): string {
  const declared = asset.mimeType?.trim().toLowerCase().split(";", 1)[0];
  if (declared !== undefined && SUPPORTED_MIME_TYPES.has(declared)) {
    return declared;
  }

  const candidate = asset.fileName ?? asset.uri;
  const extension = candidate.split(/[?#]/, 1)[0]?.split(".").pop()?.toLowerCase();
  const inferred = extension === undefined ? undefined : MIME_TYPE_BY_EXTENSION[extension];
  if (inferred !== undefined) return inferred;

  throw new SharedStoreError(
    "UNSUPPORTED_MEDIA_TYPE",
    "Selecciona una imagen JPEG, PNG o WebP.",
    { details: { fileName: asset.fileName, mimeType: asset.mimeType } },
  );
}

export async function selectImageForSharedMedia(): Promise<PendingSharedImage | null> {
  const result = await ImagePicker.launchImageLibraryAsync({
    allowsEditing: false,
    allowsMultipleSelection: false,
    mediaTypes: ["images"],
    quality: 0.85,
    selectionLimit: 1,
  });

  if (result.canceled || result.assets.length === 0) return null;

  const asset = result.assets[0];
  return {
    uri: asset.uri,
    fileName: asset.fileName ?? undefined,
    mimeType: inferSupportedMimeType(asset),
  };
}

export async function persistSelectedSharedImage(
  image: PendingSharedImage,
) {
  const directoryUri = await loadDirectoryUri();
  if (directoryUri === null) throw new ManagementStorageNotConnectedError();

  return createExpoSafSharedStore(
    directoryUri,
    "gestion-calpulli",
  ).copyImageToMedia(image);
}
