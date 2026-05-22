import { useCallback, useEffect, useMemo, useState } from "react";
import type { RefObject } from "react";
import type { LegendListRef, ViewToken } from "@legendapp/list";

import type { JourneyFlashListItem } from "@/src/types/journey";
import {
  getActiveNodeInitialScrollIndex,
  getNextScrollHint,
  HIDDEN_SCROLL_HINT,
  showFocusHint,
  type ActiveNodeInitialScrollIndex,
  type ActiveNodeScrollHint,
} from "./currentNodeScrollHintUtils";
import { useAutoScrollToActiveNode } from "./useAutoScrollToActiveNode";

export type { ActiveNodeInitialScrollIndex, ActiveNodeScrollHint };

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
  const isAutoScrollEnabled =
    isCourseLoaded && loadedListKey === listKey && !isViewingPreviewSection;

  const { resetLastAutoScrolledIndex, scrollToActiveNode } =
    useAutoScrollToActiveNode({
      activeListIndex,
      isEnabled: isAutoScrollEnabled,
      listKey,
      listRef,
    });

  useEffect(() => {
    setScrollHint(HIDDEN_SCROLL_HINT);
  }, [listKey]);

  useEffect(() => {
    if (!isViewingPreviewSection) {
      return;
    }

    setScrollHint(showFocusHint);
  }, [isViewingPreviewSection]);

  const handleListLoad = useCallback(() => {
    setLoadedListKey(listKey);
  }, [listKey]);

  const updateScrollHintFromViewableItems = useCallback(
    (viewableItems: ViewToken<JourneyFlashListItem>[]): void => {
      setScrollHint((currentHint) =>
        getNextScrollHint({
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
      resetLastAutoScrolledIndex();
      setScrollHint(HIDDEN_SCROLL_HINT);
      return;
    }

    if (scrollToActiveNode()) {
      setScrollHint(HIDDEN_SCROLL_HINT);
    }
  }, [
    onFocusCurrentProgress,
    resetLastAutoScrolledIndex,
    scrollHint.mode,
    scrollToActiveNode,
  ]);

  const activeNodeInitialScrollIndex = useMemo(
    () => getActiveNodeInitialScrollIndex(activeListIndex),
    [activeListIndex],
  );

  return {
    activeNodeInitialScrollIndex,
    scrollHint,
    handleListLoad,
    handleScrollHintPress,
    updateScrollHintFromViewableItems,
  };
}
