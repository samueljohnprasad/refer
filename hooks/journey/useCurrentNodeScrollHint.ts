import { useCallback, useEffect, useRef, useState } from "react";
import type { RefObject } from "react";
import type { LegendListRef, ViewToken } from "@legendapp/list";

import type {
  ScrollToActiveButtonDirection,
  ScrollToActiveButtonMode,
} from "@/src/components/journey/ScrollToActiveButton";
import type { JourneyFlashListItem } from "@/src/types/journey";

const ACTIVE_NODE_VIEW_POSITION = 0.35;
const ACTIVE_NODE_VIEW_OFFSET = 24;
const AUTO_SCROLL_DELAY_MS = 120;
const AUTO_SCROLL_RETRY_DELAY_MS = 80;
const AUTO_SCROLL_MAX_ATTEMPTS = 4;

export type ActiveNodeInitialScrollIndex =
  | number
  | {
      index: number;
      viewOffset?: number;
    }
  | undefined;

export interface ActiveNodeScrollHint {
  isVisible: boolean;
  direction: ScrollToActiveButtonDirection;
  mode: ScrollToActiveButtonMode;
}

export interface UseCurrentNodeScrollHintOptions {
  activeListIndex: number;
  isCourseLoaded: boolean;
  isViewingPreviewSection: boolean;
  listKey: string;
  listRef: RefObject<LegendListRef | null>;
  onFocusCurrentProgress: () => void;
}

export interface UseCurrentNodeScrollHintResult {
  activeNodeInitialScrollIndex: ActiveNodeInitialScrollIndex;
  scrollHint: ActiveNodeScrollHint;
  handleListLoad: () => void;
  handleScrollHintPress: () => void;
  updateScrollHintFromViewableItems: (
    viewableItems: ViewToken<JourneyFlashListItem>[],
  ) => void;
}

const HIDDEN_SCROLL_HINT: ActiveNodeScrollHint = {
  isVisible: false,
  direction: "down",
  mode: "direction",
};

const FOCUS_SCROLL_HINT: ActiveNodeScrollHint = {
  isVisible: true,
  direction: "down",
  mode: "focus",
};

export function useCurrentNodeScrollHint({
  activeListIndex,
  isCourseLoaded,
  isViewingPreviewSection,
  listKey,
  listRef,
  onFocusCurrentProgress,
}: UseCurrentNodeScrollHintOptions): UseCurrentNodeScrollHintResult {
  const [loadedListKey, setLoadedListKey] = useState<string | null>(null);
  const [scrollHint, setScrollHint] =
    useState<ActiveNodeScrollHint>(HIDDEN_SCROLL_HINT);
  const lastScrolledIndexRef = useRef<number>(-1);

  const scrollToActiveNode = useCallback(
    (animated = true): boolean => {
      if (activeListIndex < 0) {
        return false;
      }

      const list = listRef.current;
      if (!list) {
        return false;
      }

      try {
        list.scrollToIndex({
          index: activeListIndex,
          animated,
          viewOffset: ACTIVE_NODE_VIEW_OFFSET,
          viewPosition: ACTIVE_NODE_VIEW_POSITION,
        });
        return true;
      } catch {
        return false;
      }
    },
    [activeListIndex, listRef],
  );

  useEffect(() => {
    lastScrolledIndexRef.current = -1;
    setScrollHint(HIDDEN_SCROLL_HINT);
  }, [listKey]);

  useEffect(() => {
    if (!isViewingPreviewSection) {
      return;
    }

    setScrollHint(showFocusHint);
  }, [isViewingPreviewSection]);

  useEffect(() => {
    if (isViewingPreviewSection) return;
    if (!isCourseLoaded || loadedListKey !== listKey || activeListIndex < 0) {
      return;
    }
    if (activeListIndex === lastScrolledIndexRef.current) {
      return;
    }

    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let attemptCount = 0;

    const tryScroll = () => {
      attemptCount += 1;

      if (scrollToActiveNode(true)) {
        lastScrolledIndexRef.current = activeListIndex;
        return;
      }

      if (attemptCount < AUTO_SCROLL_MAX_ATTEMPTS) {
        timeoutId = setTimeout(tryScroll, AUTO_SCROLL_RETRY_DELAY_MS);
      }
    };

    timeoutId = setTimeout(tryScroll, AUTO_SCROLL_DELAY_MS);

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [
    activeListIndex,
    isCourseLoaded,
    isViewingPreviewSection,
    listKey,
    loadedListKey,
    scrollToActiveNode,
  ]);

  const handleListLoad = useCallback(() => {
    setLoadedListKey(listKey);
  }, [listKey]);

  const updateScrollHintFromViewableItems = useCallback(
    (viewableItems: ViewToken<JourneyFlashListItem>[]): void => {
      setScrollHint((currentHint) =>
        resolveScrollHint({
          activeListIndex,
          currentHint,
          isViewingPreviewSection,
          viewableItems,
        }),
      );
    },
    [activeListIndex, isViewingPreviewSection],
  );

  const handleScrollHintPress = useCallback((): void => {
    if (scrollHint.mode === "focus") {
      onFocusCurrentProgress();
      lastScrolledIndexRef.current = -1;
      setScrollHint(HIDDEN_SCROLL_HINT);
      return;
    }

    if (scrollToActiveNode(true)) {
      setScrollHint(HIDDEN_SCROLL_HINT);
    }
  }, [onFocusCurrentProgress, scrollHint.mode, scrollToActiveNode]);

  return {
    activeNodeInitialScrollIndex:
      getActiveNodeInitialScrollIndex(activeListIndex),
    scrollHint,
    handleListLoad,
    handleScrollHintPress,
    updateScrollHintFromViewableItems,
  };
}

function getActiveNodeInitialScrollIndex(
  activeListIndex: number,
): ActiveNodeInitialScrollIndex {
  if (activeListIndex < 0) {
    return undefined;
  }

  return {
    index: activeListIndex,
    viewOffset: ACTIVE_NODE_VIEW_OFFSET,
  };
}

function resolveScrollHint({
  activeListIndex,
  currentHint,
  isViewingPreviewSection,
  viewableItems,
}: {
  activeListIndex: number;
  currentHint: ActiveNodeScrollHint;
  isViewingPreviewSection: boolean;
  viewableItems: ViewToken<JourneyFlashListItem>[];
}): ActiveNodeScrollHint {
  if (isViewingPreviewSection) {
    return showFocusHint(currentHint);
  }

  if (activeListIndex < 0) {
    return hideScrollHint(currentHint);
  }

  const viewableIndices = getViewableIndices(viewableItems);
  if (viewableIndices.length === 0) {
    return currentHint;
  }

  if (viewableIndices.includes(activeListIndex)) {
    return hideScrollHint(currentHint);
  }

  return showDirectionHint(
    currentHint,
    getScrollDirection(activeListIndex, viewableIndices),
  );
}

function getViewableIndices(
  viewableItems: ViewToken<JourneyFlashListItem>[],
): number[] {
  return viewableItems
    .map((item) => item.index)
    .filter((index): index is number => typeof index === "number");
}

function getScrollDirection(
  activeListIndex: number,
  viewableIndices: number[],
): ScrollToActiveButtonDirection {
  return activeListIndex < Math.min(...viewableIndices) ? "up" : "down";
}

function hideScrollHint(currentHint: ActiveNodeScrollHint): ActiveNodeScrollHint {
  return currentHint.isVisible ? HIDDEN_SCROLL_HINT : currentHint;
}

function showFocusHint(currentHint: ActiveNodeScrollHint): ActiveNodeScrollHint {
  if (currentHint.isVisible && currentHint.mode === "focus") {
    return currentHint;
  }

  return FOCUS_SCROLL_HINT;
}

function showDirectionHint(
  currentHint: ActiveNodeScrollHint,
  direction: ScrollToActiveButtonDirection,
): ActiveNodeScrollHint {
  if (
    currentHint.isVisible &&
    currentHint.mode === "direction" &&
    currentHint.direction === direction
  ) {
    return currentHint;
  }

  return {
    isVisible: true,
    direction,
    mode: "direction",
  };
}
