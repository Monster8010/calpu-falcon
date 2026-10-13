import { useCallback } from "react";

import { loadPublicFairData } from "../services/public-fair-data";
import { useRepositoryResource } from "./use-repository-resource";

export function useFairData() {
  const load = useCallback(() => loadPublicFairData(), []);
  return useRepositoryResource(load, "public-fair");
}
