import { useEffect, useMemo } from "react";
import { useWindowDimensions } from "react-native";
import {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";

export interface SkeletonBoxProps {
  width: number | string;
  height: number;
  borderRadius?: number;
  className?: string;
}

export function useSkeletonBoxViewModel() {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.7, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return {
    animatedStyle,
  };
}

export function useJourneyLoadingSkeletonViewModel() {
  const { width: screenWidth } = useWindowDimensions();
  const nodeSize = 64;
  const centerX: number = screenWidth / 2;
  const amplitude: number = screenWidth * 0.22;

  const skeletonPositions = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => ({
        x: centerX + Math.sin((i * Math.PI) / 2.5) * amplitude - nodeSize / 2,
        y: 100 + i * 120,
      })),
    [centerX, amplitude, nodeSize],
  );

  return {
    nodeSize,
    skeletonPositions,
  };
}
