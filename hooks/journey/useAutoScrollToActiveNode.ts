import { useCallback, useEffect, useRef } from "react";
import type { RefObject } from "react";
import type { LegendListRef } from "@legendapp/list";
import { InteractionManager } from "react-native";

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
  const hasScrollableActiveNode = activeListIndex >= 0;

  const resetLastAutoScrolledIndex = useCallback((): void => {
    lastAutoScrolledIndexRef.current = -1;
  }, []);

  const scrollToActiveNode = useCallback((): boolean => {
    if (!hasScrollableActiveNode) {
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
  }, [activeListIndex, hasScrollableActiveNode, listRef]);

  useEffect(() => {
    resetLastAutoScrolledIndex();
  }, [listKey, resetLastAutoScrolledIndex]);

  useEffect(() => {
    if (!isEnabled || !hasScrollableActiveNode) {
      return;
    }

    if (activeListIndex === lastAutoScrolledIndexRef.current) {
      return;
    }

    let retryTimeoutId: ReturnType<typeof setTimeout> | null = null;
    let interactionHandle: ReturnType<
      typeof InteractionManager.runAfterInteractions
    > | null = null;
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

    interactionHandle = InteractionManager.runAfterInteractions(() => {
      retryTimeoutId = setTimeout(tryScroll, AUTO_SCROLL_DELAY_MS);
    });

    return () => {
      interactionHandle?.cancel();

      if (retryTimeoutId) {
        clearTimeout(retryTimeoutId);
      }
    };
  }, [activeListIndex, hasScrollableActiveNode, isEnabled, scrollToActiveNode]);

  return {
    resetLastAutoScrolledIndex,
    scrollToActiveNode,
  };
}
