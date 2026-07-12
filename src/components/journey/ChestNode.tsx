/**
 * ChestNode (Task 4.2.1)
 * Treasure chest node on the journey path — larger than regular nodes (80px).
 *
 * Animations (all on UI thread via react-native-reanimated):
 * - Idle shine sweep: rotating highlight that loops every ANIMATION_TIMING.chestShine ms
 * - Shake on tap: quick horizontal oscillation before opening
 * - Locked state: greyed out, no shine, not interactive
 */

import React, { useCallback, useEffect } from "react";
import { View } from "react-native";
import { Text } from "@/src/components/ui/Text";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  withSpring,
  Easing,
  interpolate,
  runOnJS,
} from "react-native-reanimated";

import AnimatedNodeButton from "@/src/components/journey/AnimatedNodeButton";
import { useReducedMotion } from "@/src/hooks/useReducedMotion";
import { NodePosition, PathNodeData } from "@/src/types/journey/node";
import { NodeStatus } from "@/src/types/journey/enums";
import {
  ANIMATION_TIMING,
  CHEST_COLORS,
  NODE_SIZE,
} from "@/src/data/journey/constants";
import { darkenHex } from "@/src/utils/colorUtils";
import { triggerIfEnabledSync } from "@/lib/haptics/hapticUtils";
import { HAPTIC_INTENSITIES } from "@/lib/haptics/hapticConfig";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface ChestNodeProps {
  node: PathNodeData;
  position: NodePosition;
  onPress: (node: PathNodeData, e?: any, color?: string) => void;
}

// ---------------------------------------------------------------------------
// ChestNode
// ---------------------------------------------------------------------------

function ChestNode({
  node,
  position,
  onPress,
}: ChestNodeProps): React.JSX.Element {
  const size: number = NODE_SIZE.chest;
  const halfSize: number = size / 2;
  const isLocked: boolean = node.status === NodeStatus.LOCKED;
  const isInteractive: boolean = !isLocked;
  const reducedMotion: boolean = useReducedMotion();

  // ── Shine animation (idle loop for non-locked chests) ──
  const shineProgress = useSharedValue(0);

  useEffect(() => {
    if (!isLocked && !reducedMotion) {
      shineProgress.value = withRepeat(
        withTiming(1, {
          duration: ANIMATION_TIMING.chestShine,
          easing: Easing.linear,
        }),
        -1,
        false,
      );
    } else {
      shineProgress.value = 0;
      if (isLocked) {
        void triggerIfEnabledSync("whisper", HAPTIC_INTENSITIES.WHISPER_SUBTLE);
      }
    }
  }, [isLocked, shineProgress, reducedMotion]);

  const shineStyle = useAnimatedStyle(() => {
    const rotation: number = interpolate(shineProgress.value, [0, 1], [0, 360]);
    const opacity: number = interpolate(
      shineProgress.value,
      [0, 0.3, 0.5, 0.7, 1],
      [0.2, 0.6, 1, 0.6, 0.2],
    );
    return {
      transform: [{ rotate: `${rotation}deg` }],
      opacity,
    };
  });

  // ── Shake animation (triggered on tap) ──
  const shakeX = useSharedValue(0);

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
  }));

  // ── Press handler ──
  const handlePress = useCallback((e?: any): void => {
    if (!isInteractive) return;

    if (reducedMotion) {
      onPress(node, e, bodyColor);
      return;
    }

    const d: number = ANIMATION_TIMING.chestShake;
    shakeX.value = withSequence(
      withTiming(-4, { duration: d }),
      withTiming(4, { duration: d }),
      withTiming(-3, { duration: d }),
      withTiming(3, { duration: d }),
      withTiming(0, { duration: d }, (finished) => {
        if (finished) {
          runOnJS(onPress)(node, e, bodyColor);
        }
      }),
    );
  }, [isInteractive, shakeX, reducedMotion, onPress, node, bodyColor]);

  // Colors based on locked state
  const bodyColor: string = isLocked ? CHEST_COLORS.locked : CHEST_COLORS.body;
  const shadowFaceColor: string = darkenHex(bodyColor, 0.25);
  const borderColor: string = isLocked
    ? CHEST_COLORS.lockedBorder
    : CHEST_COLORS.bodyBorder;

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
      {/* Shine glow behind the chest */}
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

      {/* Chest body with shake */}
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
          {/* Chest icon */}
          <Text className="text-3xl">{isLocked ? "🔒" : "🎁"}</Text>

          {/* Decorative clasp/latch */}
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
}

export default React.memo(ChestNode);
