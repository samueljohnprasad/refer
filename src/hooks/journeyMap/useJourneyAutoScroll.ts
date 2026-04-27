import { useEffect, useCallback, useState, type MutableRefObject } from "react";
import type { JourneyFlashListItem, JourneyNode } from "@/src/types/journey";
import { NodeStatus } from "@/src/types/journey";

export interface UseJourneyAutoScrollParams {
  flashListData: JourneyFlashListItem[];
  pendingFocusNodeId: string | null;
  setPendingFocusNodeId: (id: string | null) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  legendListRef: MutableRefObject<any>;
  onVisibleUnitChanged: (info: { viewableItems: any[] }) => void;
}

export interface UseJourneyAutoScrollReturn {
  isActiveOffScreen: boolean;
  scrollDirection: "up" | "down";
  handleFlashListScrollToActive: () => void;
  onViewableItemsChangedWrapper: (info: { viewableItems: any[] }) => void;
}

export function useJourneyAutoScroll({
  flashListData,
  pendingFocusNodeId,
  setPendingFocusNodeId,
  legendListRef,
  onVisibleUnitChanged,
}: UseJourneyAutoScrollParams): UseJourneyAutoScrollReturn {
  const [isActiveOffScreen, setIsActiveOffScreen] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("down");

  // 1. Auto-scroll after completion
  useEffect(() => {
    if (!pendingFocusNodeId || flashListData.length === 0) return;

    const targetIndex = flashListData.findIndex(
      (item: JourneyFlashListItem) =>
        item.itemType === "node" && item.id === pendingFocusNodeId,
    );

    if (targetIndex < 0) return;

    const timer = setTimeout(() => {
      legendListRef.current?.scrollToIndex?.({
        index: targetIndex,
        animated: true,
      });
      setPendingFocusNodeId(null);
    }, 250);

    return () => clearTimeout(timer);
  }, [flashListData, pendingFocusNodeId, legendListRef, setPendingFocusNodeId]);

  // 2. Track if active node is off-screen
  const onViewableItemsChangedWrapper = useCallback(
    (info: { viewableItems: any[] }) => {
      // Call original unit tracker
      onVisibleUnitChanged(info);

      const activeItemIndex = flashListData.findIndex(
        (item) => item.itemType === "node" && (item as JourneyNode).status === NodeStatus.ACTIVE
      );

      if (activeItemIndex === -1 || info.viewableItems.length === 0) {
        setIsActiveOffScreen(false);
        return;
      }

      const firstVisible = info.viewableItems[0].index;
      const lastVisible = info.viewableItems[info.viewableItems.length - 1].index;

      if (firstVisible != null && lastVisible != null) {
        if (activeItemIndex < firstVisible) {
          setIsActiveOffScreen(true);
          setScrollDirection("up");
        } else if (activeItemIndex > lastVisible) {
          setIsActiveOffScreen(true);
          setScrollDirection("down");
        } else {
          setIsActiveOffScreen(false);
        }
      }
    },
    [onVisibleUnitChanged, flashListData]
  );

  // 3. Manual scroll to active node
  const handleFlashListScrollToActive = useCallback(() => {
    const activeItemIndex = flashListData.findIndex(
      (item) => item.itemType === "node" && (item as JourneyNode).status === NodeStatus.ACTIVE
    );
    if (activeItemIndex >= 0) {
      legendListRef.current?.scrollToIndex?.({
        index: activeItemIndex,
        animated: true,
      });
    }
  }, [flashListData, legendListRef]);

  return {
    isActiveOffScreen,
    scrollDirection,
    handleFlashListScrollToActive,
    onViewableItemsChangedWrapper,
  };
}
