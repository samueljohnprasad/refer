/**
 * useInteractionLock (Task 5.1.3)
 * Prevents rapid double-taps and locks interactions during animations.
 *
 * Provides:
 * - isLocked: boolean — whether interactions are currently blocked
 * - lock(durationMs): void — lock for a specific duration (auto-unlocks)
 * - guardedPress(handler): wraps a press handler with debounce + lock check
 *
 * Default debounce: 400ms between taps (Duolingo uses ~350ms).
 */

import { useCallback, useRef, useState } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface InteractionLockResult {
  /** Whether interactions are currently locked */
  isLocked: boolean;
  /** Lock interactions for the given duration (ms). Auto-unlocks. */
  lock: (durationMs: number) => void;
  /** Unlock interactions manually (e.g. after animation completes) */
  unlock: () => void;
  /** Wrap a press handler with debounce + lock guard */
  guardedPress: <T extends unknown[]>(
    handler: (...args: T) => void,
  ) => (...args: T) => void;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const DEFAULT_DEBOUNCE_MS = 400;

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useInteractionLock(
  debounceMs: number = DEFAULT_DEBOUNCE_MS,
): InteractionLockResult {
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const lastPressTimeRef = useRef<number>(0);
  const lockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const lock = useCallback((durationMs: number): void => {
    setIsLocked(true);

    // Clear any existing timer
    if (lockTimerRef.current) {
      clearTimeout(lockTimerRef.current);
    }

    lockTimerRef.current = setTimeout(() => {
      setIsLocked(false);
      lockTimerRef.current = null;
    }, durationMs);
  }, []);

  const unlock = useCallback((): void => {
    if (lockTimerRef.current) {
      clearTimeout(lockTimerRef.current);
      lockTimerRef.current = null;
    }
    setIsLocked(false);
  }, []);

  const guardedPress = useCallback(
    <T extends unknown[]>(
      handler: (...args: T) => void,
    ): ((...args: T) => void) => {
      return (...args: T): void => {
        const now: number = Date.now();

        // Block if locked or within debounce window
        if (isLocked || now - lastPressTimeRef.current < debounceMs) {
          return;
        }

        lastPressTimeRef.current = now;
        handler(...args);
      };
    },
    [isLocked, debounceMs],
  );

  return { isLocked, lock, unlock, guardedPress };
}
