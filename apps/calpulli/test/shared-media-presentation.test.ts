import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { MediaReference } from "@calpulli/domain";

import { selectFirstSharedImage } from "../features/media/shared-media-presentation";

describe("presentación de media compartida", () => {
  it("selecciona la primera imagen compartida aunque haya media empaquetada antes", () => {
    const media: MediaReference[] = [
      { type: "bundled", key: "posts/demo" },
      { type: "shared", uri: "content://calpulli/media/photo.jpg", mimeType: "image/jpeg" },
      { type: "shared", uri: "content://calpulli/media/second.png", mimeType: "image/png" },
    ];

    assert.equal(
      selectFirstSharedImage(media)?.uri,
      "content://calpulli/media/photo.jpg",
    );
  });

  it("admite referencias heredadas sin mimeType", () => {
    const media: MediaReference[] = [
      { type: "shared", uri: "content://calpulli/media/legacy" },
    ];

    assert.equal(selectFirstSharedImage(media), media[0]);
  });

  it("ignora referencias compartidas que declaran un tipo no visual", () => {
    const media: MediaReference[] = [
      { type: "shared", uri: "content://calpulli/media/document.pdf", mimeType: "application/pdf" },
      { type: "bundled", key: "posts/demo" },
    ];

    assert.equal(selectFirstSharedImage(media), undefined);
  });
});
