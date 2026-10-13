import { isSharedStoreError } from "@calpulli/shared-store";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { AppState, type AppStateStatus } from "react-native";

export function readableManagementError(error: unknown): string {
  if (isSharedStoreError(error)) {
    const cause = (error as Error & { cause?: unknown }).cause;
    if (cause instanceof Error) return cause.message;
    return error.message;
  }
  if (error instanceof Error) return error.message;
  return "No pudimos completar la operación en el almacenamiento compartido.";
}

export interface ManagementResource<T> {
  data: T | null;
  error: string | null;
  isLoading: boolean;
  isRefreshing: boolean;
  refresh(): Promise<void>;
}

export function useManagementResource<T>(
  load: () => Promise<T>,
  resourceKey: string,
): ManagementResource<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const mountedRef = useRef(true);
  const hasDataRef = useRef(false);
  const requestRef = useRef(0);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      requestRef.current += 1;
    };
  }, []);

  useEffect(() => {
    hasDataRef.current = false;
    requestRef.current += 1;
    setData(null);
    setError(null);
    setIsLoading(true);
    setIsRefreshing(false);
  }, [resourceKey]);

  const refresh = useCallback(async () => {
    const requestId = ++requestRef.current;
    hasDataRef.current ? setIsRefreshing(true) : setIsLoading(true);

    try {
      const nextData = await load();
      if (mountedRef.current && requestRef.current === requestId) {
        hasDataRef.current = true;
        setData(nextData);
        setError(null);
      }
    } catch (loadError) {
      if (mountedRef.current && requestRef.current === requestId) {
        setError(readableManagementError(loadError));
      }
    } finally {
      if (mountedRef.current && requestRef.current === requestId) {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    }
  }, [load]);

  useFocusEffect(useCallback(() => {
    void refresh();
  }, [refresh]));

  useEffect(() => {
    let previousState: AppStateStatus = AppState.currentState;
    const subscription = AppState.addEventListener("change", (nextState) => {
      const wasAway = previousState === "background" || previousState === "inactive";
      previousState = nextState;
      if (wasAway && nextState === "active") void refresh();
    });

    return () => subscription.remove();
  }, [refresh]);

  return { data, error, isLoading, isRefreshing, refresh };
}
