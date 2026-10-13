import { useCallback } from "react";

import {
  loadPublicTutoringData,
  loadPublicTutorProfile,
} from "../services/public-tutoring-data";
import { useRepositoryResource } from "./use-repository-resource";

export function useTutoringData() {
  const load = useCallback(() => loadPublicTutoringData(), []);
  return useRepositoryResource(load, "public-tutoring");
}

export function useTutorProfile(tutorId: string) {
  const load = useCallback(
    () => loadPublicTutorProfile(tutorId),
    [tutorId],
  );
  return useRepositoryResource(load, `tutor:${tutorId}`);
}
