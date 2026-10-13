import type { AppRole } from "@calpulli/domain";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { loadDemoRole, saveDemoRole } from "../../services/demo-role-storage";

interface DemoRoleContextValue {
  isHydrated: boolean;
  role: AppRole | null;
  selectRole(role: AppRole): Promise<void>;
}

const DemoRoleContext = createContext<DemoRoleContextValue | undefined>(undefined);

export function DemoRoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<AppRole | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    const restore = async () => {
      try {
        const storedRole = await loadDemoRole();
        if (mountedRef.current) setRole(storedRole);
      } catch {
        if (mountedRef.current) setRole(null);
      } finally {
        if (mountedRef.current) setIsHydrated(true);
      }
    };

    void restore();
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const selectRole = useCallback(async (nextRole: AppRole) => {
    if (mountedRef.current) setRole(nextRole);
    await saveDemoRole(nextRole);
  }, []);

  const value = useMemo(
    () => ({ isHydrated, role, selectRole }),
    [isHydrated, role, selectRole],
  );

  return <DemoRoleContext.Provider value={value}>{children}</DemoRoleContext.Provider>;
}

export function useDemoRole(): DemoRoleContextValue {
  const value = useContext(DemoRoleContext);

  if (value === undefined) {
    throw new Error("useDemoRole debe usarse dentro de DemoRoleProvider.");
  }

  return value;
}
