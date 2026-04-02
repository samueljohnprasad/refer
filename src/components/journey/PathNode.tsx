/**
 * PathNode
 * A single node on the journey path. Handles all 3 visual states:
 * locked (grey), active (green + glow + progress ring), completed (gold).
 *
 * Animations (all on UI thread via react-native-reanimated):
 * - Breathing scale (1.0 ↔ 1.08) on active node
 * - Synced glow (shadow opacity/radius pulses with breathing)
 * - Bouncing "START" tooltip above active node
 * - Completion pop (scale 1→1.3→1 spring) when node becomes completed
 * - `react-native-circular-progress` for the animated progress ring
 */

import React, { useEffect, useRef } from "react";
import { View } from "react-native";
import { PressableScale } from "@/src/components/ui/PressableScale";
import { Text } from "@/components/ui/text";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSpring,
  withSequence,
  Easing,
  interpolate,
} from "react-native-reanimated";

import type { PathNodeData, NodePosition } from "@/src/types/journey";
import { NodeStatus, NodeType } from "@/src/types/journey";
import { useReducedMotion } from "@/src/hooks/useReducedMotion";
import {
  NODE_COLORS,
  NODE_SIZE,
  ANIMATION_TIMING,
} from "@/src/data/journey/constants";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const ICON_MAP: Record<string, string> = {
  star: "⭐",
  lock: "🔒",
  checkmark: "✅",
  book: "📖",
  chest: "🎁",
};

const NODE_BG_COLORS: Record<string, string> = {
  [NodeStatus.COMPLETED]: NODE_COLORS.completed,
  [NodeStatus.ACTIVE]: NODE_COLORS.active,
  [NodeStatus.LOCKED]: NODE_COLORS.locked,
};

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface PathNodeProps {
  node: PathNodeData;
  position: NodePosition;
  onPress: (node: PathNodeData) => void;
}

// ---------------------------------------------------------------------------
// Bouncing Tooltip sub-component (Task 3.5.1)
// ---------------------------------------------------------------------------

interface BouncingTooltipProps {
  label: string | undefined;
}

function BouncingTooltip({ label }: BouncingTooltipProps): React.JSX.Element {
  const translateY = useSharedValue(0);
  // Always animate — hooks must be called unconditionally
  const isVisible: boolean = Boolean(label);

  useEffect(() => {
    translateY.value = withRepeat(
      withTiming(-6, {
        duration: ANIMATION_TIMING.tooltipBounce,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true,
    );
  }, [translateY]);

  const bounceStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  // Always render — hiding via opacity keeps hook call count stable
  return (
    <Animated.View
      className="absolute -top-10 bg-white rounded-lg px-3 py-1.5 z-10"
      style={[
        bounceStyle,
        {
          opacity: isVisible ? 1 : 0,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        },
      ]}
      pointerEvents={isVisible ? "auto" : "none"}
    >
      <Text
        className="text-xs font-extrabold tracking-wider"
        style={{ color: NODE_COLORS.active }}
      >
        {label ?? ""}
      </Text>
      <View
        className="absolute -bottom-1.5 self-center w-3 h-3 bg-white"
        style={{ transform: [{ rotate: "45deg" }], left: "42%" }}
      />
    </Animated.View>
  );
}

// ---------------------------------------------------------------------------
// PathNode
// ---------------------------------------------------------------------------

function PathNode({
  node,
  position,
  onPress,
}: PathNodeProps): React.JSX.Element {
  const size: number =
    node.type === "chest" ? NODE_SIZE.chest : NODE_SIZE.regular;
  const halfSize: number = size / 2;
  const bgColor: string = NODE_BG_COLORS[node.status] ?? NODE_COLORS.locked;
  const isInteractive: boolean = node.status !== NodeStatus.LOCKED;
  const isActive: boolean = node.status === NodeStatus.ACTIVE;
  const isCompleted: boolean = node.status === NodeStatus.COMPLETED;
  const reducedMotion: boolean = useReducedMotion();

  // Track previous status for completion pop detection
  const prevStatusRef = useRef<string>(node.status);

  // ── Breathing animation (Task 3.1.1) ──
  const breathProgress = useSharedValue(0);

  useEffect(() => {
    if (isActive && !reducedMotion) {
      breathProgress.value = withRepeat(
        withTiming(1, {
          duration: ANIMATION_TIMING.breathing,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        true,
      );
    } else {
      breathProgress.value = 0;
    }
  }, [isActive, breathProgress, reducedMotion]);

  // Breathing scale style
  const breathingStyle = useAnimatedStyle(() => {
    const scale: number = interpolate(breathProgress.value, [0, 1], [1, 1.08]);
    return { transform: [{ scale }] };
  });

  // ── Animated glow synced to breathing (Task 3.1.2) ──
  const glowStyle = useAnimatedStyle(() => {
    const shadowOpacity: number = interpolate(
      breathProgress.value,
      [0, 1],
      [0.3, 0.7],
    );
    const shadowRadius: number = interpolate(
      breathProgress.value,
      [0, 1],
      [8, 20],
    );
    return {
      shadowColor: NODE_COLORS.active,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity,
      shadowRadius,
      elevation: 8,
    };
  });

  // ── Completion pop animation (Task 3.4.1) ──
  const popScale = useSharedValue(1);

  useEffect(() => {
    if (
      isCompleted &&
      prevStatusRef.current === NodeStatus.ACTIVE &&
      !reducedMotion
    ) {
      popScale.value = withSequence(
        withSpring(1.3, { damping: 8, stiffness: 200 }),
        withSpring(1, { damping: 12, stiffness: 180 }),
      );
    }
    prevStatusRef.current = node.status;
  }, [node.status, isCompleted, popScale, reducedMotion]);

  const popStyle = useAnimatedStyle(() => ({
    transform: [{ scale: popScale.value }],
  }));

  const handlePress = (): void => {
    if (!isInteractive) return;
    onPress(node);
  };

  // Progress ring size — slightly larger than node
  const ringSize: number =
    size + NODE_SIZE.progressRingGap * 2 + NODE_SIZE.progressRingStroke * 2;
  const progressPercent: number = (node.progress ?? 0) * 100;

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
      {/* Bouncing tooltip ("START") — Task 3.5.1: always rendered, hidden via opacity */}
      <BouncingTooltip label={node.label} />

      {/* Progress ring around active node */}
      {isActive && (
        <View
          className="absolute items-center justify-center"
          style={{
            width: ringSize,
            height: ringSize,
            left: -(ringSize - size) / 2,
            top: -(ringSize - size) / 2,
          }}
        >
          <AnimatedCircularProgress
            size={ringSize}
            width={NODE_SIZE.progressRingStroke}
            fill={progressPercent}
            tintColor={NODE_COLORS.active}
            backgroundColor="rgba(88, 204, 2, 0.2)"
            rotation={0}
            lineCap="round"
          />
        </View>
      )}

      {/* Node circle — breathing + glow (active) or pop (completed) */}
      <Animated.View
        style={[
          isActive ? breathingStyle : undefined,
          isCompleted ? popStyle : undefined,
        ]}
      >
        <Animated.View style={isActive ? glowStyle : undefined}>
          <PressableScale
            onPress={handlePress}
            disabled={!isInteractive}
            scale={0.9}
            hapticStyle="medium"
            accessibilityRole="button"
            accessibilityLabel={`${node.type === NodeType.CHECKPOINT ? "Checkpoint" : "Lesson"} ${node.index + 1}, ${node.status}${isActive && node.progress !== undefined ? `, ${Math.round(node.progress * 100)}% complete` : ""}`}
            accessibilityState={{ disabled: !isInteractive }}
            style={{
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: bgColor,
              alignItems: "center",
              justifyContent: "center",
              borderBottomWidth: 4,
              borderBottomColor: isActive
                ? "#45A802"
                : isCompleted
                  ? "#E5A800"
                  : "#A0AEC0",
              ...(isCompleted
                ? {
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.15,
                    shadowRadius: 8,
                    elevation: 5,
                  }
                : {}),
            }}
          >
            <Text className="text-2xl">{ICON_MAP[node.icon] ?? "⭐"}</Text>
          </PressableScale>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

export default React.memo(PathNode);
