import type { ViewToken } from "@legendapp/list";

import type {
  ScrollToActiveButtonDirection,
  ScrollToActiveButtonMode,
} from "@/src/components/journey/ScrollToActiveButton";
import type { JourneyFlashListItem } from "@/src/types/journey";

export const ACTIVE_NODE_VIEW_POSITION = 0.35;
export const ACTIVE_NODE_VIEW_OFFSET = 24;

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

export const HIDDEN_SCROLL_HINT: ActiveNodeScrollHint = {
  isVisible: false,
  direction: "down",
  mode: "direction",
};

const FOCUS_SCROLL_HINT: ActiveNodeScrollHint = {
  isVisible: true,
  direction: "down",
  mode: "focus",
};

export function getActiveNodeInitialScrollIndex(
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

export function getNextScrollHint({
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

export function showFocusHint(
  currentHint: ActiveNodeScrollHint,
): ActiveNodeScrollHint {
  if (currentHint.isVisible && currentHint.mode === "focus") {
    return currentHint;
  }

  return FOCUS_SCROLL_HINT;
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
