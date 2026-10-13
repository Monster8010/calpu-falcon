import type { AppRole } from "@calpulli/domain";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { isDemoRole } from "../features/roles/role-definitions";

const DEMO_ROLE_KEY = "@calpulli/gestion-calpulli/demo-role/v1";

export async function loadDemoRole(): Promise<AppRole | null> {
  const value = await AsyncStorage.getItem(DEMO_ROLE_KEY);
  return isDemoRole(value) ? value : null;
}

export function saveDemoRole(role: AppRole): Promise<void> {
  return AsyncStorage.setItem(DEMO_ROLE_KEY, role);
}
