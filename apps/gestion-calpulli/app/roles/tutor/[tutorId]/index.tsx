import { Redirect, useLocalSearchParams } from "expo-router";

import { TutorManager } from "../../../../features/tutors/tutor-manager";

export default function TutorManagerScreen() {
  const params = useLocalSearchParams<{ tutorId?: string | string[] }>();
  const tutorId = Array.isArray(params.tutorId) ? params.tutorId[0] : params.tutorId;

  if (tutorId === undefined || tutorId.trim().length === 0) {
    return <Redirect href="/roles/tutor" />;
  }

  return <TutorManager tutorId={tutorId} />;
}
