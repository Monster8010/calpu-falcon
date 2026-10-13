import { isSharedStoreError } from "@calpulli/shared-store";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  loadPublicHomeData,
  type PublicHomeData,
} from "../services/public-home-data";

function readableHomeError(error: unknown): string {
  if (isSharedStoreError(error)) {
    if (error.code === "STATE_NOT_FOUND") {
      return "Gestión todavía no ha inicializado los datos compartidos.";
    }

    if (
      error.code === "DIRECTORY_ACCESS_FAILED" ||
      error.code === "INVALID_DIRECTORY_URI"
    ) {
      return "La carpeta compartida ya no está disponible. Vuelve a conectarla.";
    }

    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "No pudimos leer los avisos compartidos.";
}

export interface HomeDataState {
  data: PublicHomeData | null;
  error: string | null;
  isLoading: boolean;
  isRefreshing: boolean;
  refresh(): Promise<void>;
}

export function useHomeData(): HomeDataState {
  const [data, setData] = useState<PublicHomeData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const mountedRef = useRef(true);
  const hasDataRef = useRef(false);
  const requestRef = useRef(0);

  useEffect(
    () => () => {
      mountedRef.current = false;
      requestRef.current += 1;
    },
    [],
  );

  const refresh = useCallback(async () => {
    const requestId = ++requestRef.current;

    if (hasDataRef.current) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      const nextData = await loadPublicHomeData(new Date().toISOString());

      if (mountedRef.current && requestRef.current === requestId) {
        hasDataRef.current = true;
        setData(nextData);
        setError(null);
      }
    } catch (refreshError) {
      if (mountedRef.current && requestRef.current === requestId) {
        setError(readableHomeError(refreshError));
      }
    } finally {
      if (mountedRef.current && requestRef.current === requestId) {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    }
  }, []);

  return { data, error, isLoading, isRefreshing, refresh };
}
