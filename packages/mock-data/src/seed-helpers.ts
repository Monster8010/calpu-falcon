import type { MediaReference } from "@calpulli/domain";

export function bundledMedia(key: string): MediaReference {
  return { type: "bundled", key };
}
