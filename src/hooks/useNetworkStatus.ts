/**
 * useNetworkStatus (Task 5.1.1)
 * Cross-platform hook for detecting online/offline connectivity.
 *
 * Uses:
 * - Web: `navigator.onLine` + `online`/`offline` events
 * - Mobile: Periodic fetch-based connectivity check (lightweight)
 *
 * Returns:
 * - isOnline: boolean — current connectivity state
 * - lastOnlineAt: Date | null — timestamp of last confirmed online state
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { AppState, Platform } from "react-native";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface NetworkStatus {
  /** Whether the device currently has network connectivity */
  isOnline: boolean;
  /** Timestamp of last confirmed online state */
  lastOnlineAt: Date | null;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useNetworkStatus(): NetworkStatus {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [lastOnlineAt, setLastOnlineAt] = useState<Date | null>(new Date());
  const appStateRef = useRef<string>(AppState.currentState);

  const markOnline = useCallback((): void => {
    setIsOnline(true);
    setLastOnlineAt(new Date());
  }, []);

  const markOffline = useCallback((): void => {
    setIsOnline(false);
  }, []);

  useEffect(() => {
    // ── Web: use navigator.onLine + events ──
    if (Platform.OS === "web" && typeof window !== "undefined") {
      setIsOnline(navigator.onLine);

      const handleOnline = (): void => markOnline();
      const handleOffline = (): void => markOffline();

      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);

      return () => {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      };
    }

    // ── Mobile: lightweight connectivity check on app foreground ──
    const checkConnectivity = async (): Promise<void> => {
      try {
        // Lightweight HEAD request to a known-good endpoint
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        await fetch("https://clients3.google.com/generate_204", {
          method: "HEAD",
          signal: controller.signal,
        });

        clearTimeout(timeoutId);
        markOnline();
      } catch {
        markOffline();
      }
    };

    // Check immediately
    checkConnectivity();

    // Re-check when app returns to foreground
    const subscription = AppState.addEventListener(
      "change",
      (nextState: string) => {
        if (
          appStateRef.current.match(/inactive|background/) &&
          nextState === "active"
        ) {
          checkConnectivity();
        }
        appStateRef.current = nextState;
      },
    );

    // Periodic check every 30 seconds while active
    const interval = setInterval(checkConnectivity, 30_000);

    return () => {
      subscription.remove();
      clearInterval(interval);
    };
  }, [markOnline, markOffline]);

  return { isOnline, lastOnlineAt };
}
