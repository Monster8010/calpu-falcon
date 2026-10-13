import { useCallback } from "react";

import { loadPublicFavoritesData } from "../services/public-favorites-data";
import { useRepositoryResource } from "./use-repository-resource";

export function useFavoritesData() {
  const load = useCallback(() => loadPublicFavoritesData(), []);
  return useRepositoryResource(load, "public-favorites");
}
