import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated from "react-native-reanimated";
import {
  useSkeletonBoxViewModel,
  useJourneyLoadingSkeletonViewModel,
  type SkeletonBoxProps,
} from "../hooks/useJourneyLoadingSkeletonViewModel";

export interface SkeletonBoxViewProps
  extends ReturnType<typeof useSkeletonBoxViewModel>,
    SkeletonBoxProps {}

/**
 * Presentational View component for SkeletonBox.
 * Strictly contains JSX code without internal hooks.
 */
export const SkeletonBoxView = React.memo(function SkeletonBoxView({
  width,
  height,
  borderRadius = 8,
  className = "",
  animatedStyle,
}: SkeletonBoxViewProps): React.JSX.Element {
  return (
    <Animated.View
      className={`bg-sage-100 ${className}`}
      style={[{ width: width as number, height, borderRadius }, animatedStyle]}
    />
  );
});

function SkeletonBox({
  width,
  height,
  borderRadius = 8,
  className = "",
}: SkeletonBoxProps): React.JSX.Element {
  const viewModel = useSkeletonBoxViewModel();
  return (
    <SkeletonBoxView
      {...viewModel}
      width={width}
      height={height}
      borderRadius={borderRadius}
      className={className}
    />
  );
}

export interface JourneyLoadingSkeletonViewProps
  extends ReturnType<typeof useJourneyLoadingSkeletonViewModel> {}

/**
 * Presentational View component for JourneyLoadingSkeleton.
 * Strictly contains JSX code without internal hooks.
 */
export const JourneyLoadingSkeletonView = React.memo(
  function JourneyLoadingSkeletonView({
    nodeSize,
    skeletonPositions,
  }: JourneyLoadingSkeletonViewProps): React.JSX.Element {
    return (
      <View className="flex-1 bg-brand-canvas">
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
  },
);

/**
 * Container component for JourneyLoadingSkeleton.
 */
export default function JourneyLoadingSkeleton(): React.JSX.Element {
  const viewModel = useJourneyLoadingSkeletonViewModel();
  return <JourneyLoadingSkeletonView {...viewModel} />;
}
