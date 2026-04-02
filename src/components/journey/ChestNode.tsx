



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
import { Text } from "@/components/ui/text";
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

import { PressableScale } from "@/src/components/ui/PressableScale";
import { useReducedMotion } from "@/src/hooks/useReducedMotion";
import { NodePosition, PathNodeData } from "@/src/types/journey/node";
import { NodeStatus } from "@/src/types/journey/enums";
import { ANIMATION_TIMING, CHEST_COLORS, NODE_SIZE } from "@/src/data/journey/constants";


// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface ChestNodeProps {
  node: PathNodeData;
  position: NodePosition;
  onPress: (node: PathNodeData) => void;
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

  const triggerShake = useCallback((): void => {
    if (reducedMotion) return;
    const d: number = ANIMATION_TIMING.chestShake;
    shakeX.value = withSequence(
      withTiming(-4, { duration: d }),
      withTiming(4, { duration: d }),
      withTiming(-3, { duration: d }),
      withTiming(3, { duration: d }),
      withTiming(0, { duration: d }),
    );
  }, [shakeX, reducedMotion]);

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
  }));

  // ── Press handler ──
  const handlePress = useCallback((): void => {
    if (!isInteractive) return;
    triggerShake();
    // Small delay so shake plays before the modal opens
    setTimeout(() => onPress(node), ANIMATION_TIMING.chestShake * 5);
  }, [isInteractive, triggerShake, onPress, node]);

  // Colors based on locked state
  const bodyColor: string = isLocked ? CHEST_COLORS.locked : CHEST_COLORS.body;
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
        <PressableScale
          onPress={handlePress}
          disabled={!isInteractive}
          scale={0.88}
          hapticStyle="heavy"
          accessibilityRole="button"
          accessibilityLabel={`Treasure chest ${node.index + 1}, ${node.status}`}
          accessibilityState={{ disabled: !isInteractive }}
          style={{
            width: size,
            height: size,
            borderRadius: 20,
            backgroundColor: bodyColor,
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 3,
            borderColor: borderColor,
            borderBottomWidth: 5,
            borderBottomColor: borderColor,
            shadowColor: isLocked ? "#000" : CHEST_COLORS.shine,
            shadowOffset: { width: 0, height: isLocked ? 2 : 0 },
            shadowOpacity: isLocked ? 0.1 : 0.4,
            shadowRadius: isLocked ? 4 : 12,
            elevation: isLocked ? 2 : 6,
          }}
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
        </PressableScale>
      </Animated.View>
    </View>
  );
}

export default React.memo(ChestNode);



















