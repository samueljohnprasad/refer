import { useCallback, useRef, useEffect } from "react";
import { useAnimatedRef, useSharedValue, withTiming, useAnimatedReaction, scrollTo } from "react-native-reanimated";
import { FlashListRef } from "@shopify/flash-list";
import { useFocusEffect } from "expo-router";
import type { JourneyFlashListItem } from "@/src/types/journey";
import { useScrollToActive } from "@/src/hooks/useScrollToActive";

interface UseJourneyScrollProps {
  flashActiveNodeY: number | null;
  viewportHeight: number;
  flashActiveNodeIndex: number;
  flashListData: JourneyFlashListItem[];
  USE_FLASH_LIST?: boolean;
}

export function useJourneyScroll({
  flashActiveNodeY,
  viewportHeight,
  flashActiveNodeIndex,
  flashListData,
  USE_FLASH_LIST = true,
}: UseJourneyScrollProps) {
  const flashListRef = useAnimatedRef<FlashListRef<JourneyFlashListItem>>();
  
  // Track real scroll position for custom animation anchor point
  const currentScrollY = useRef(0);
  const scrollY = useSharedValue(0);

  const {
    isOffScreen: isActiveOffScreen,
    direction: scrollDirection,
    updateVisibility,
  } = useScrollToActive(null, flashActiveNodeY, viewportHeight);

  // FlashList scroll-to-active handler
  const handleFlashListScrollToActive = useCallback(
    (duration = 3000) => {
      if (flashActiveNodeY !== null && flashListRef.current) {
        const targetOffset = Math.max(0, flashActiveNodeY - viewportHeight / 3);

        // Start the animation from our actual current scroll position!
        scrollY.value = currentScrollY.current;

        // Now slowly glide to the target over 800ms
        scrollY.value = withTiming(targetOffset, {
          duration,
        });
      }
    },
    [flashActiveNodeY, viewportHeight, scrollY, flashListRef],
  );

  useAnimatedReaction(
    () => scrollY.value,
    (y) => {
      scrollTo(flashListRef, 0, y, false); // ✅ Custom smooth scroll hook
    },
  );

  // FlashList jump-to-unit handler
  const handleFlashListJumpToUnit = useCallback(
    (unitId: string): void => {
      const targetIndex: number = flashListData.findIndex(
        (item: JourneyFlashListItem) =>
          item.itemType === "divider" && item.id === `divider_${unitId}`,
      );
      if (targetIndex >= 0 && flashListRef.current) {
        flashListRef.current.scrollToIndex({
          index: targetIndex,
          animated: true,
          viewPosition: 0,
        });
      }
    },
    [flashListData, flashListRef],
  );

  // Auto-scroll FlashList to active node on mount / focus
  useFocusEffect(
    useCallback(() => {
      if (flashActiveNodeIndex >= 0) {
        const timer = setTimeout(() => {
          handleFlashListScrollToActive(2000);
        }, 500);
        return () => clearTimeout(timer);
      }
    }, [flashActiveNodeIndex, handleFlashListScrollToActive]),
  );

  // Auto-scroll when the active node index changes (e.g., node completed)
  useEffect(() => {
    if (flashActiveNodeIndex >= 0) {
      const timer = setTimeout(() => {
        handleFlashListScrollToActive(1000);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [flashActiveNodeIndex, handleFlashListScrollToActive]);

  return {
    flashListRef,
    handleFlashListScrollToActive,
    handleFlashListJumpToUnit,
    currentScrollY,
    scrollY,
    isActiveOffScreen,
    scrollDirection,
    updateVisibility,
  };
}
