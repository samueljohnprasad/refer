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

import AnimatedButton from "@/src/components/AnimatedButton";
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
import { darkenHex } from "@/src/utils/colorUtils";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/**
 * SVG content for the locked-node asset (assets/journey/lesson.svg).
 * Inlined so it works without a Metro SVG transformer.
 */
const LESSON_SVG_XML: string = `<svg width="70" height="65" viewBox="0 0 70 65" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#filter0_dd_4_5107)">
<rect width="70" height="57" rx="28.5" fill="#E5E5E5"/>
</g>
<path fill-rule="evenodd" clip-rule="evenodd" d="M34.8731 16.0382C30.9449 16.0382 27.7604 19.0241 27.7604 22.7073V24.983C27.7604 25.0386 27.7612 25.0941 27.7626 25.1493H27.7049C25.854 25.1493 24.3535 26.6498 24.3535 28.5007V37.4418C24.3535 39.2927 25.854 40.7932 27.7049 40.7932H42.0455C43.8965 40.7932 45.397 39.2927 45.397 37.4418V28.5008C45.397 26.6498 43.8965 25.1493 42.0455 25.1493H41.9837C41.9851 25.0941 41.9858 25.0386 41.9858 24.983V22.7073C41.9858 19.0241 38.8014 16.0382 34.8731 16.0382ZM38.4812 25.1493C38.484 25.0942 38.4855 25.0388 38.4855 24.983V22.7073C38.4855 20.8367 36.8682 19.3203 34.8731 19.3203C32.8781 19.3203 31.2608 20.8367 31.2608 22.7073V24.983C31.2608 25.0388 31.2622 25.0942 31.2651 25.1493H38.4812Z" fill="#AFAFAF"/>
<defs>
<filter id="filter0_dd_4_5107" x="0" y="0" width="70" height="65" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="8"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0.898039 0 0 0 0 0.898039 0 0 0 0 0.898039 0 0 0 1 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_4_5107"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="8"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"/>
<feBlend mode="normal" in2="effect1_dropShadow_4_5107" result="effect2_dropShadow_4_5107"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_4_5107" result="shape"/>
</filter>
</defs>
</svg>`;

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

/** Factor to darken the face color for the shadow layer */
const NODE_SHADOW_DARKEN_FACTOR = 0.25;

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
  const shadowColor: string = darkenHex(bgColor, NODE_SHADOW_DARKEN_FACTOR);
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
          <AnimatedButton
            title={
              node.status === NodeStatus.LOCKED
                ? ""
                : ((node.icon ? ICON_MAP[node.icon] : undefined) ?? "⭐")
            }
            onPress={handlePress}
            disabled={!isInteractive}
            backgroundColor={bgColor}
            shadowColor={shadowColor}
            hapticStyle="Medium"
            type="squircle"
            fullWidth={false}
            minHeight={size}
            iconSize={size * 0.55}
            accessibilityLabel={`${node.type === NodeType.CHECKPOINT ? "Checkpoint" : "Lesson"} ${node.index + 1}, ${node.status}${isActive && node.progress !== undefined ? `, ${Math.round(node.progress * 100)}% complete` : ""}`}
            style={{ width: size, marginBottom: 0 }}
            textStyle={
              node.status === NodeStatus.LOCKED
                ? { display: "none" }
                : { fontSize: 24 }
            }
          />
        </Animated.View>
      </Animated.View>
    </View>
  );
}

export default React.memo(PathNode);
