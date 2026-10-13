import { Redirect, useLocalSearchParams } from "expo-router";

import { EntrepreneurManager } from "../../../../features/entrepreneurs/entrepreneur-manager";

export default function EntrepreneurManagerScreen() {
  const params = useLocalSearchParams<{ entrepreneurId?: string | string[] }>();
  const entrepreneurId = Array.isArray(params.entrepreneurId)
    ? params.entrepreneurId[0]
    : params.entrepreneurId;

  if (entrepreneurId === undefined || entrepreneurId.trim().length === 0) {
    return <Redirect href="/roles/entrepreneur" />;
  }

  return <EntrepreneurManager entrepreneurId={entrepreneurId} />;
}
