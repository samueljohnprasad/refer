/**
 * JourneyLoadingSkeleton
 * Skeleton loading state for the journey map while data is being fetched.
 * Shows a pulsing placeholder mimicking the real layout.
 */

import React, { useEffect } from "react";
import { View, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";

// ---------------------------------------------------------------------------
// Skeleton Pulse wrapper
// ---------------------------------------------------------------------------

interface SkeletonBoxProps {
  width: number | string;
  height: number;
  borderRadius?: number;
  className?: string;
}

function SkeletonBox({
  width,
  height,
  borderRadius = 8,
  className = "",
}: SkeletonBoxProps): React.JSX.Element {
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

  return (
    <Animated.View
      className={`bg-sage-100 ${className}`}
      style={[{ width: width as number, height, borderRadius }, animatedStyle]}
    />
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function JourneyLoadingSkeleton(): React.JSX.Element {
  const { width: screenWidth } = useWindowDimensions();
  const nodeSize = 64;
  const centerX: number = screenWidth / 2;
  const amplitude: number = screenWidth * 0.22;

  // Generate 6 skeleton node positions
  const skeletonPositions = Array.from({ length: 6 }, (_, i) => ({
    x: centerX + Math.sin((i * Math.PI) / 2.5) * amplitude - nodeSize / 2,
    y: 100 + i * 120,
  }));

  return (
    <View className="flex-1 bg-brand-canvas">
      {/* Header skeleton */}
      <View className="w-full px-5 pt-2 pb-5 bg-brand-border">
        <SafeAreaView edges={["top"]}>
          <View className="flex-row items-center justify-between mb-4">
            <SkeletonBox width={32} height={32} borderRadius={8} />
            <View className="flex-row gap-4">
              <SkeletonBox width={50} height={24} borderRadius={12} />
              <SkeletonBox width={50} height={24} borderRadius={12} />
              <SkeletonBox width={50} height={24} borderRadius={12} />
            </View>
          </View>
          <SkeletonBox width={160} height={28} borderRadius={6} />
          <View className="mt-2">
            <SkeletonBox width={240} height={18} borderRadius={6} />
          </View>
        </SafeAreaView>
      </View>

      {/* Path skeleton */}
      <View className="flex-1">
        {skeletonPositions.map((pos, index: number) => (
          <View
            key={`skel-${index}`}
            style={{
              position: "absolute",
              left: pos.x,
              top: pos.y,
              width: nodeSize,
              height: nodeSize,
            }}
          >
            <SkeletonBox
              width={nodeSize}
              height={nodeSize}
              borderRadius={nodeSize / 2}
            />
          </View>
        ))}
      </View>
    </View>
  );
}
