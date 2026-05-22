import { useCallback, useEffect, useRef } from "react";
import type { RefObject } from "react";
import type { LegendListRef } from "@legendapp/list";

import {
  ACTIVE_NODE_VIEW_OFFSET,
  ACTIVE_NODE_VIEW_POSITION,
} from "./currentNodeScrollHintUtils";

const AUTO_SCROLL_DELAY_MS = 120;
const AUTO_SCROLL_RETRY_DELAY_MS = 80;
const AUTO_SCROLL_MAX_ATTEMPTS = 4;

interface UseAutoScrollToActiveNodeOptions {
  activeListIndex: number;
  isEnabled: boolean;
  listKey: string;
  listRef: RefObject<LegendListRef | null>;
}

interface UseAutoScrollToActiveNodeResult {
  resetLastAutoScrolledIndex: () => void;
  scrollToActiveNode: () => boolean;
}

export function useAutoScrollToActiveNode({
  activeListIndex,
  isEnabled,
  listKey,
  listRef,
}: UseAutoScrollToActiveNodeOptions): UseAutoScrollToActiveNodeResult {
  const lastAutoScrolledIndexRef = useRef<number>(-1);

  const resetLastAutoScrolledIndex = useCallback((): void => {
    lastAutoScrolledIndexRef.current = -1;
  }, []);

  const scrollToActiveNode = useCallback((): boolean => {
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
        animated: true,
        viewOffset: ACTIVE_NODE_VIEW_OFFSET,
        viewPosition: ACTIVE_NODE_VIEW_POSITION,
      });
      return true;
    } catch {
      return false;
    }
  }, [activeListIndex, listRef]);

  useEffect(() => {
    resetLastAutoScrolledIndex();
  }, [listKey, resetLastAutoScrolledIndex]);

  useEffect(() => {
    if (!isEnabled || activeListIndex < 0) {
      return;
    }

    if (activeListIndex === lastAutoScrolledIndexRef.current) {
      return;
    }

    let retryTimeoutId: ReturnType<typeof setTimeout> | null = null;
    let attemptCount = 0;

    const tryScroll = () => {
      attemptCount += 1;

      if (scrollToActiveNode()) {
        lastAutoScrolledIndexRef.current = activeListIndex;
        return;
      }

      if (attemptCount < AUTO_SCROLL_MAX_ATTEMPTS) {
        retryTimeoutId = setTimeout(tryScroll, AUTO_SCROLL_RETRY_DELAY_MS);
      }
    };

    retryTimeoutId = setTimeout(tryScroll, AUTO_SCROLL_DELAY_MS);

    return () => {
      if (retryTimeoutId) {
        clearTimeout(retryTimeoutId);
      }
    };
  }, [activeListIndex, isEnabled, scrollToActiveNode]);

  return {
    resetLastAutoScrolledIndex,
    scrollToActiveNode,
  };
}
