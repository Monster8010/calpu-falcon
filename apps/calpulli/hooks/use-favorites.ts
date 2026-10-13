import type { ID, LocalFavoritesState } from "@calpulli/domain";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  EMPTY_FAVORITES_STATE,
  reconcileFavoriteIds,
  removeFavoriteId,
  toggleFavoriteId,
} from "../features/favorites/favorites-state";
import {
  loadFavorites,
  saveFavorites,
} from "../services/favorites-storage";

export interface FavoritesController {
  error: string | null;
  favoriteIds: readonly ID[];
  isFavorite(postId: ID): boolean;
  isLoading: boolean;
  isSaving: boolean;
  reconcile(validPostIds: ReadonlySet<ID>): Promise<number>;
  refresh(): Promise<void>;
  remove(postId: ID): Promise<void>;
  toggle(postId: ID): Promise<void>;
}

export function useFavorites(): FavoritesController {
  const [state, setState] = useState<LocalFavoritesState>(EMPTY_FAVORITES_STATE);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const stateRef = useRef(state);
  const savingRef = useRef(false);
  const mountedRef = useRef(true);
  const loadedRef = useRef(false);
  const loadRequestRef = useRef(0);

  const refresh = useCallback(async () => {
    if (savingRef.current) return;
    const requestId = ++loadRequestRef.current;
    if (!loadedRef.current) setIsLoading(true);

    try {
      const restored = await loadFavorites();

      if (mountedRef.current && loadRequestRef.current === requestId) {
        stateRef.current = restored;
        setState(restored);
        setError(null);
        loadedRef.current = true;
      }
    } catch {
      if (mountedRef.current && loadRequestRef.current === requestId) {
        setError("No pudimos leer tus favoritos locales.");
      }
    } finally {
      if (mountedRef.current && loadRequestRef.current === requestId) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    void refresh();

    return () => {
      mountedRef.current = false;
      loadRequestRef.current += 1;
    };
  }, [refresh]);

  const toggle = useCallback(async (postId: ID) => {
    if (savingRef.current) {
      return;
    }

    savingRef.current = true;
    loadRequestRef.current += 1;
    setIsSaving(true);
    setError(null);
    const previous = stateRef.current;
    const next = toggleFavoriteId(previous, postId);
    stateRef.current = next;
    setState(next);

    try {
      await saveFavorites(next);
    } catch {
      stateRef.current = previous;
      setState(previous);
      setError("No se pudo guardar el favorito en este dispositivo.");
    } finally {
      savingRef.current = false;
      setIsSaving(false);
    }
  }, []);

  const remove = useCallback(async (postId: ID) => {
    if (savingRef.current || !stateRef.current.institutionalPostIds.includes(postId)) {
      return;
    }

    savingRef.current = true;
    loadRequestRef.current += 1;
    setIsSaving(true);
    setError(null);
    const previous = stateRef.current;
    const next = removeFavoriteId(previous, postId);
    stateRef.current = next;
    setState(next);

    try {
      await saveFavorites(next);
    } catch {
      stateRef.current = previous;
      setState(previous);
      setError("No se pudo quitar el favorito en este dispositivo.");
    } finally {
      savingRef.current = false;
      setIsSaving(false);
    }
  }, []);

  const reconcile = useCallback(async (validPostIds: ReadonlySet<ID>) => {
    if (savingRef.current) return 0;

    const previous = stateRef.current;
    const next = reconcileFavoriteIds(previous, validPostIds);
    const removedCount =
      previous.institutionalPostIds.length - next.institutionalPostIds.length;

    if (removedCount === 0) return 0;

    savingRef.current = true;
    loadRequestRef.current += 1;
    setIsSaving(true);
    setError(null);

    try {
      await saveFavorites(next);
      stateRef.current = next;
      setState(next);
      return removedCount;
    } catch {
      setError("No pudimos limpiar referencias de favoritos no disponibles.");
      return 0;
    } finally {
      savingRef.current = false;
      setIsSaving(false);
    }
  }, []);

  const favoriteIds = new Set(state.institutionalPostIds);

  return {
    error,
    favoriteIds: state.institutionalPostIds,
    isFavorite: (postId) => favoriteIds.has(postId),
    isLoading,
    isSaving,
    reconcile,
    refresh,
    remove,
    toggle,
  };
}
