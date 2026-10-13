import { isSharedStoreError } from "@calpulli/shared-store";
import { useCallback, useEffect, useRef, useState } from "react";

function readableResourceError(error: unknown): string {
  if (isSharedStoreError(error)) {
    if (error.code === "STATE_NOT_FOUND") {
      return "Gestión todavía no ha inicializado los datos compartidos.";
    }

    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "No pudimos leer la información compartida.";
}

export interface RepositoryResource<T> {
  data: T | null;
  error: string | null;
  isLoading: boolean;
  isRefreshing: boolean;
  refresh(): Promise<void>;
}

export function useRepositoryResource<T>(
  load: () => Promise<T>,
  resourceKey: string,
): RepositoryResource<T> {
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

    if (hasDataRef.current) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      const nextData = await load();

      if (mountedRef.current && requestRef.current === requestId) {
        hasDataRef.current = true;
        setData(nextData);
        setError(null);
      }
    } catch (loadError) {
      if (mountedRef.current && requestRef.current === requestId) {
        setError(readableResourceError(loadError));
      }
    } finally {
      if (mountedRef.current && requestRef.current === requestId) {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    }
  }, [load]);

  return { data, error, isLoading, isRefreshing, refresh };
}
