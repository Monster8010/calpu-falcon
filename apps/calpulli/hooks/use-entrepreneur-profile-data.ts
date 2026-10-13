import { useCallback } from "react";

import { loadPublicEntrepreneurProfile } from "../services/public-fair-data";
import { useRepositoryResource } from "./use-repository-resource";

export function useEntrepreneurProfileData(entrepreneurId: string) {
  const load = useCallback(
    () => loadPublicEntrepreneurProfile(entrepreneurId),
    [entrepreneurId],
  );
  return useRepositoryResource(load, `entrepreneur:${entrepreneurId}`);
}
