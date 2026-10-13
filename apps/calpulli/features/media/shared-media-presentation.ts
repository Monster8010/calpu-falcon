import type { MediaReference } from "@calpulli/domain";

export function selectFirstSharedImage(
  media: readonly MediaReference[],
): Extract<MediaReference, { type: "shared" }> | undefined {
  return media.find(
    (reference): reference is Extract<MediaReference, { type: "shared" }> =>
      reference.type === "shared"
      && (reference.mimeType === undefined || reference.mimeType.startsWith("image/")),
  );
}
