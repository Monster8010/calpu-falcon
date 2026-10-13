import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { SharedStoreError } from "../src/errors";
import {
  SHARED_MEDIA_DIRECTORY_NAME,
  copyImageToSharedMedia,
} from "../src/shared-media";
import { MemoryFileSystem } from "./memory-file-system";

describe("medios compartidos SAF", () => {
  it("crea media, copia Base64 y devuelve una referencia shared", async () => {
    const fileSystem = new MemoryFileSystem();
    fileSystem.setFile("selected.jpg", "aW1hZ2VuLWRlbW8=");
    const sourceUri = fileSystem.fileUri("selected.jpg");

    const media = await copyImageToSharedMedia(
      fileSystem,
      fileSystem.directoryUri,
      { fileName: "foto feria.jpg", mimeType: "image/jpeg", uri: sourceUri },
      { fileId: "unit" },
    );

    assert.equal(media.type, "shared");
    assert.equal(media.mimeType, "image/jpeg");
    assert.equal(media.fileName, "foto feria.jpg");
    assert.match(media.uri, /media\/calpulli-image-unit$/);
    assert.equal(fileSystem.readRaw("calpulli-image-unit"), "aW1hZ2VuLWRlbW8=");
    assert.equal(
      (await fileSystem.listDirectory(fileSystem.directoryUri)).some(
        (uri) => decodeURIComponent(uri).endsWith(`/${SHARED_MEDIA_DIRECTORY_NAME}`),
      ),
      true,
    );
  });

  it("reutiliza el directorio media para copias posteriores", async () => {
    const fileSystem = new MemoryFileSystem();
    fileSystem.setFile("selected.png", "aW1hZ2Vu");
    const uri = fileSystem.fileUri("selected.png");

    await copyImageToSharedMedia(
      fileSystem,
      fileSystem.directoryUri,
      { mimeType: "image/png", uri },
      { fileId: "one" },
    );
    await copyImageToSharedMedia(
      fileSystem,
      fileSystem.directoryUri,
      { mimeType: "image/png", uri },
      { fileId: "two" },
    );

    const directories = await fileSystem.listDirectory(fileSystem.directoryUri);
    assert.equal(directories.filter((entry) => decodeURIComponent(entry).endsWith("/media")).length, 1);
  });

  it("rechaza formatos no soportados e imágenes mayores al límite", async () => {
    const fileSystem = new MemoryFileSystem();
    fileSystem.setFile("selected.gif", "aW1hZ2Vu");
    const uri = fileSystem.fileUri("selected.gif");

    await assert.rejects(
      copyImageToSharedMedia(fileSystem, fileSystem.directoryUri, {
        mimeType: "image/gif",
        uri,
      }),
      (error: unknown) =>
        error instanceof SharedStoreError && error.code === "UNSUPPORTED_MEDIA_TYPE",
    );
    await assert.rejects(
      copyImageToSharedMedia(
        fileSystem,
        fileSystem.directoryUri,
        { mimeType: "image/png", uri },
        { maxBytes: 2 },
      ),
      (error: unknown) =>
        error instanceof SharedStoreError && error.code === "MEDIA_TOO_LARGE",
    );
  });

  it("elimina el archivo incompleto si falla la verificación", async () => {
    const fileSystem = new MemoryFileSystem();
    fileSystem.setFile("selected.webp", "aW1hZ2Vu");
    fileSystem.corruptNextWriteToFileName = "calpulli-image-broken";

    await assert.rejects(
      copyImageToSharedMedia(
        fileSystem,
        fileSystem.directoryUri,
        { mimeType: "image/webp", uri: fileSystem.fileUri("selected.webp") },
        { fileId: "broken" },
      ),
      (error: unknown) =>
        error instanceof SharedStoreError && error.code === "MEDIA_VERIFICATION_FAILED",
    );
    assert.equal(fileSystem.listFileNames().includes("calpulli-image-broken"), false);
  });
});
