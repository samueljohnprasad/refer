import { useCallback } from "react";
import { useSharedValue, useAnimatedScrollHandler, runOnJS } from "react-native-reanimated";

interface UseScrollHandlerProps {
  updateVisibility: (y: number) => void;
}

export function useScrollHandler({ updateVisibility }: UseScrollHandlerProps) {
  const scrollY = useSharedValue(0);

  const onScrollTick = useCallback(
    (y: number) => {
      updateVisibility(y);
    },
    [updateVisibility],
  );

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      "worklet";
      scrollY.value = event.contentOffset.y;
      runOnJS(onScrollTick)(event.contentOffset.y);
    },
  });

  return {
    scrollY,
    scrollHandler,
  };
}
