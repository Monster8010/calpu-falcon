import { useEffect } from "react";
import { AppState, type AppStateStatus } from "react-native";

export function useRefreshOnForeground(refresh: () => void): void {
  useEffect(() => {
    let previousState: AppStateStatus = AppState.currentState;
    const subscription = AppState.addEventListener("change", (nextState) => {
      const wasAway =
        previousState === "background" || previousState === "inactive";
      previousState = nextState;

      if (wasAway && nextState === "active") {
        refresh();
      }
    });

    return () => subscription.remove();
  }, [refresh]);
}
