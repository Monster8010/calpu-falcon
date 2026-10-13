import AsyncStorage from "@react-native-async-storage/async-storage";
import type { LocalFavoritesState } from "@calpulli/domain";

import {
  EMPTY_FAVORITES_STATE,
  normalizeFavoritesState,
} from "../features/favorites/favorites-state";

const FAVORITES_KEY = "@calpulli/calpulli/favorites/v1";

export async function loadFavorites(): Promise<LocalFavoritesState> {
  const serialized = await AsyncStorage.getItem(FAVORITES_KEY);

  if (serialized === null) {
    return EMPTY_FAVORITES_STATE;
  }

  try {
    return normalizeFavoritesState(JSON.parse(serialized) as unknown);
  } catch {
    return EMPTY_FAVORITES_STATE;
  }
}

export function saveFavorites(state: LocalFavoritesState): Promise<void> {
  const normalized = normalizeFavoritesState(state);
  return AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(normalized));
}
