import { useCallback, useEffect } from "react";
import {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  interpolate,
  runOnJS,
} from "react-native-reanimated";
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

export interface ChestNodeProps {
  node: PathNodeData;
  position: NodePosition;
  onPress: (node: PathNodeData, e?: any, color?: string) => void;
}

export function useChestNodeViewModel({
  node,
  position,
  onPress,
}: ChestNodeProps) {
  const size: number = NODE_SIZE.chest;
  const halfSize: number = size / 2;
  const isLocked: boolean = node.status === NodeStatus.LOCKED;
  const isInteractive: boolean = !isLocked;
  const reducedMotion: boolean = useReducedMotion();

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

  const shakeX = useSharedValue(0);

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
  }));

  const bodyColor: string = isLocked ? CHEST_COLORS.locked : CHEST_COLORS.body;
  const shadowFaceColor: string = darkenHex(bodyColor, 0.25);

  const handlePress = useCallback((e?: any) => {
    if (!isInteractive) return;

    if (reducedMotion) {
      onPress(node, e, bodyColor);
      return;
    }

    const d = 45;
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

  return {
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
  };
}
