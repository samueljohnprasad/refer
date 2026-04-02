/**
 * useScrollToActive (Task 5.1.4)
 * Tracks scroll position to determine if the active node is off-screen.
 * Provides a callback to scroll back to the active node.
 */

import { useCallback, useMemo, useRef, useState } from "react";
import type {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
} from "react-native";
import type { NodePosition } from "@/src/types/journey";

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
  /** onScroll handler to pass to the ScrollView */
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Buffer zone (dp) — node is considered "off-screen" when this far past the viewport edge */
const VISIBILITY_BUFFER = 80;

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useScrollToActive(
  scrollViewRef: React.RefObject<ScrollView | null>,
  activeNodeY: number | null,
  viewportHeight: number,
): ScrollToActiveResult {
  const [isOffScreen, setIsOffScreen] = useState<boolean>(false);
  const [direction, setDirection] = useState<"up" | "down">("down");
  const scrollYRef = useRef<number>(0);

  const onScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>): void => {
      const scrollY: number = event.nativeEvent.contentOffset.y;
      scrollYRef.current = scrollY;

      if (activeNodeY === null) {
        setIsOffScreen(false);
        return;
      }

      const viewportTop: number = scrollY;
      const viewportBottom: number = scrollY + viewportHeight;

      if (activeNodeY < viewportTop + VISIBILITY_BUFFER) {
        setIsOffScreen(true);
        setDirection("up");
      } else if (activeNodeY > viewportBottom - VISIBILITY_BUFFER) {
        setIsOffScreen(true);
        setDirection("down");
      } else {
        setIsOffScreen(false);
      }
    },
    [activeNodeY, viewportHeight],
  );

  const scrollToActive = useCallback((): void => {
    if (activeNodeY === null) return;

    scrollViewRef.current?.scrollTo({
      y: Math.max(0, activeNodeY - viewportHeight / 3),
      animated: true,
    });
  }, [scrollViewRef, activeNodeY, viewportHeight]);

  return useMemo(
    () => ({ isOffScreen, direction, scrollToActive, onScroll }),
    [isOffScreen, direction, scrollToActive, onScroll],
  );
}
