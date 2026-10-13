import { useCallback } from "react";

import {
  loadPublicMarketplaceData,
  loadPublicMarketplaceEntry,
} from "../services/public-marketplace-data";
import { useRepositoryResource } from "./use-repository-resource";

export function useMarketplaceData() {
  const load = useCallback(() => loadPublicMarketplaceData(), []);
  return useRepositoryResource(load, "public-marketplace");
}

export function useMarketplaceEntry(
  kind: "post" | "product",
  id: string,
) {
  const load = useCallback(
    () => loadPublicMarketplaceEntry(kind, id),
    [id, kind],
  );
  return useRepositoryResource(load, `marketplace:${kind}:${id}`);
}
