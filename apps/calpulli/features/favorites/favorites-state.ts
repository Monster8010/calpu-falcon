import type { ID, LocalFavoritesState } from "@calpulli/domain";

export const EMPTY_FAVORITES_STATE: LocalFavoritesState = {
  institutionalPostIds: [],
};

export function normalizeFavoritesState(value: unknown): LocalFavoritesState {
  if (
    typeof value !== "object" ||
    value === null ||
    !("institutionalPostIds" in value) ||
    !Array.isArray(value.institutionalPostIds)
  ) {
    return EMPTY_FAVORITES_STATE;
  }

  const ids = value.institutionalPostIds.filter(
    (id): id is ID => typeof id === "string" && id.trim().length > 0,
  );

  return { institutionalPostIds: [...new Set(ids)] };
}

export function toggleFavoriteId(
  state: LocalFavoritesState,
  postId: ID,
): LocalFavoritesState {
  const isFavorite = state.institutionalPostIds.includes(postId);

  return {
    institutionalPostIds: isFavorite
      ? state.institutionalPostIds.filter((id) => id !== postId)
      : [...state.institutionalPostIds, postId],
  };
}

export function removeFavoriteId(
  state: LocalFavoritesState,
  postId: ID,
): LocalFavoritesState {
  return {
    institutionalPostIds: state.institutionalPostIds.filter(
      (id) => id !== postId,
    ),
  };
}

export function reconcileFavoriteIds(
  state: LocalFavoritesState,
  validPostIds: ReadonlySet<ID>,
): LocalFavoritesState {
  return {
    institutionalPostIds: state.institutionalPostIds.filter((id) =>
      validPostIds.has(id),
    ),
  };
}
