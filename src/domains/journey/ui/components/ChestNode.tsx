import React from "react";
import { View } from "react-native";
import { Text } from "@/src/components/ui/Text";
import Animated from "react-native-reanimated";
import AnimatedNodeButton from "./AnimatedNodeButton";
import { CHEST_COLORS } from "@/src/data/journey/constants";
import {
  useChestNodeViewModel,
  type ChestNodeProps,
} from "../hooks/useChestNodeViewModel";

export interface ChestNodeViewProps
  extends ReturnType<typeof useChestNodeViewModel> {}

/**
 * Presentational view component for ChestNode.
 * Strictly contains JSX code without hooks.
 */
export const ChestNodeView = React.memo(function ChestNodeView({
  size,
  halfSize,
  isLocked,
  isInteractive,
  shineStyle,
  shakeStyle,
  bodyColor,
  shadowFaceColor,
  handlePress,
  position,
  node,
}: ChestNodeViewProps): React.JSX.Element {
  return (
    <View
      className="absolute items-center justify-center"
      style={{
        left: position.x - halfSize,
        top: position.y - halfSize,
        width: size,
        height: size,
      }}
    >
      {!isLocked && (
        <Animated.View
          style={[
            shineStyle,
            {
              position: "absolute",
              width: size + 16,
              height: size + 16,
              borderRadius: (size + 16) / 2,
              backgroundColor: CHEST_COLORS.shineBg,
              left: -8,
              top: -8,
            },
          ]}
          pointerEvents="none"
        />
      )}

      <Animated.View style={shakeStyle}>
        <AnimatedNodeButton
          size={size}
          backgroundColor={bodyColor}
          shadowColor={shadowFaceColor}
          onPress={handlePress}
          disabled={!isInteractive}
          hapticStyle="heavy"
          shadowDepth={6}
          borderRadius={20}
          accessibilityLabel={`Treasure chest ${node.index + 1}, ${node.status}`}
          accessibilityState={{ disabled: !isInteractive }}
        >
          <Text className="text-3xl">{isLocked ? "🔒" : "🎁"}</Text>

          {!isLocked && (
            <View
              className="absolute rounded-sm"
              style={{
                width: 16,
                height: 8,
                backgroundColor: CHEST_COLORS.shine,
                bottom: 14,
                borderRadius: 3,
              }}
            />
          )}
        </AnimatedNodeButton>
      </Animated.View>
    </View>
  );
});

/**
 * Container component for ChestNode.
 */
function ChestNode(props: ChestNodeProps): React.JSX.Element {
  const viewModel = useChestNodeViewModel(props);
  return <ChestNodeView {...viewModel} />;
}

export default React.memo(ChestNode);
export type { ChestNodeProps };
