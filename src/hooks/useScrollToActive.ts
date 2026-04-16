/**
 * useScrollToActive (Task 5.1.4 — Perf #1 rewrite)
 *
 * Determines whether the active node is above or below the viewport and
 * provides a callback to scroll back to it.
 *
 * Architecture (post-perf-audit):
 * - No longer owns a scroll handler or calls setState per frame.
 * - Exposes `updateVisibility(scrollY)` which the caller invokes from
 *   `runOnJS` inside a Reanimated scroll handler — only when the
 *   visibility state actually changes (crossing the threshold).
 * - This reduces React re-renders from ~60/sec to 0-1 per fling.
 */

import { useCallback, useMemo, useRef, useState } from "react";
import type { ScrollView } from "react-native";
import Animated, {
  runOnUI,
  scrollTo,
  type AnimatedRef,
} from "react-native-reanimated";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ScrollToActiveResult {
  /** Whether the floating button should be visible */
  isOffScreen: boolean;
  /** Direction to scroll: 'up' if active is above viewport, 'down' if below */
  direction: "up" | "down";
  /** Callback to scroll the ScrollView to the active node */
  scrollToActive: () => void;
  /**
   * Called from `runOnJS` inside the caller's animated scroll handler.
   * Only triggers a React re-render when the boolean state actually flips.
   */
  updateVisibility: (scrollY: number) => void;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Buffer zone (dp) — node is considered "off-screen" when this far past the viewport edge */
const VISIBILITY_BUFFER: number = 80;

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useScrollToActive(
  scrollViewRef: AnimatedRef<Animated.ScrollView> | null,
  activeNodeY: number | null,
  viewportHeight: number,
): ScrollToActiveResult {
  const [isOffScreen, setIsOffScreen] = useState<boolean>(false);
  const [direction, setDirection] = useState<"up" | "down">("down");

  // Track previous computed state so we only call setState on actual changes
  const prevStateRef = useRef<{ off: boolean; dir: "up" | "down" }>({
    off: false,
    dir: "down",
  });

  /**
   * Pure computation + guarded setState. Called from runOnJS so it runs
   * on the JS thread but only when the caller decides it's worthwhile.
   */
  const updateVisibility = useCallback(
    (scrollY: number): void => {
      if (activeNodeY === null) {
        if (prevStateRef.current.off) {
          prevStateRef.current = { off: false, dir: prevStateRef.current.dir };
          setIsOffScreen(false);
        }
        return;
      }

      const viewportTop: number = scrollY;
      const viewportBottom: number = scrollY + viewportHeight;

      let newOff: boolean = false;
      let newDir: "up" | "down" = prevStateRef.current.dir;

      if (activeNodeY < viewportTop + VISIBILITY_BUFFER) {
        newOff = true;
        newDir = "up";
      } else if (activeNodeY > viewportBottom - VISIBILITY_BUFFER) {
        newOff = true;
        newDir = "down";
      }

      // Only trigger React re-render when the state actually changed
      const prev = prevStateRef.current;
      if (newOff !== prev.off || newDir !== prev.dir) {
        prevStateRef.current = { off: newOff, dir: newDir };
        setIsOffScreen(newOff);
        setDirection(newDir);
      }
    },
    [activeNodeY, viewportHeight],
  );

  const scrollToActive = useCallback((): void => {
    if (activeNodeY === null || !scrollViewRef) return;
    const targetY = Math.max(0, activeNodeY - viewportHeight / 3);

    // Guaranteed native smooth layout scroll via Reanimated worklet
    const ref = scrollViewRef;
    runOnUI(() => {
      "worklet";
      scrollTo(ref, 0, targetY, true);
    })();
  }, [scrollViewRef, activeNodeY, viewportHeight]);

  return useMemo(
    () => ({ isOffScreen, direction, scrollToActive, updateVisibility }),
    [isOffScreen, direction, scrollToActive, updateVisibility],
  );
}
