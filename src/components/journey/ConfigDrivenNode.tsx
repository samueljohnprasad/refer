/**
 * ConfigDrivenNode
 * Config-driven node renderer using the Duolingo-style SVG node shell.
 *
 * Architecture:
 * - Icons:     Resolved from HUGEICON_REGISTRY
 * - Colors:    Button bg comes from the node variant config per state.
 * - Animation: Resolved from variant.activeAnimation via ANIMATION_FACTORIES
 * - ProgressRing conditionally shown from variant.showProgressRing
 * - BouncingTooltip for active node label
 *
 * ZERO svg XML, ZERO if/else for node type/icon/color.
 */

import React, { useCallback, useEffect, useRef } from "react";
import { View } from "react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import * as Haptics from "expo-haptics";
import { GlassView } from "expo-glass-effect";

import { Text } from "@/components/ui/text";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSpring,
  withSequence,
  withDelay,
  Easing,
  interpolate,
  type SharedValue,
} from "react-native-reanimated";

import type {
  PathNodeData,
  NodePosition,
  NodeIconConfig,
  NodeVariantConfig,
  NodeColorConfig,
} from "@/src/types/journey";
import { useReducedMotion } from "@/src/hooks/useReducedMotion";
import { ANIMATION_TIMING } from "@/src/data/journey/constants";
import {
  useJourneySettings,
  useNodeVariant,
  useColorTheme,
} from "@/src/context/JourneyConfigContext";
import { darkenHex } from "@/src/utils/colorUtils";
import {
  getHugeicon,
} from "@/src/data/journey/hugeiconsRegistry";
import { DuolingoSvgNodeButton } from "./DuolingoSvgNodeButton";

// ---------------------------------------------------------------------------
// Animation Factory Registry — maps animation key → setup function
// No if/else: looked up by string key from variant.activeAnimation
// ---------------------------------------------------------------------------

type AnimationSetup = (
  progress: SharedValue<number>,
  reducedMotion: boolean,
) => void;

const ANIMATION_FACTORIES: Record<string, AnimationSetup> = {
  breathing: (progress: SharedValue<number>, reducedMotion: boolean): void => {
    if (reducedMotion) {
      progress.value = 0;
      return;
    }
    progress.value = withRepeat(
      withTiming(1, {
        duration: ANIMATION_TIMING.breathing,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true,
    );
  },
  shine: (progress: SharedValue<number>, reducedMotion: boolean): void => {
    if (reducedMotion) {
      progress.value = 0;
      return;
    }
    progress.value = withRepeat(
      withTiming(1, {
        duration: ANIMATION_TIMING.chestShine,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true,
    );
  },
  shake: (progress: SharedValue<number>, reducedMotion: boolean): void => {
    if (reducedMotion) {
      progress.value = 0;
      return;
    }
    progress.value = withRepeat(
      withSequence(
        withTiming(1, { duration: ANIMATION_TIMING.chestShake }),
        withTiming(-1, { duration: ANIMATION_TIMING.chestShake }),
        withTiming(0, { duration: ANIMATION_TIMING.chestShake }),
      ),
      -1,
      false,
    );
  },
  none: (): void => {
    // No animation
  },
};

// ---------------------------------------------------------------------------
// NodeShellContent — icon-driven Duolingo node button
//
// - Icon:  resolved from HUGEICON_REGISTRY
// - Color: resolved from the node variant's color config
// ---------------------------------------------------------------------------

const ICON_COLOR_ACTIVE = "#FFFFFF";
const ICON_COLOR_LOCKED = "#FFFFFF";
const HUGEICON_SIZE_RATIO = 0.6;

interface NodeShellContentProps {
  iconConfig: NodeIconConfig;
  /** Full node size — sets button minHeight/width */
  size: number;
  /** Resolved background color for this status */
  backgroundColor: string;
  /** Accessibility label */
  accessibilityLabel: string;
  /** Whether press is enabled */
  isInteractive: boolean;
  /** Press callback */
  onPress: () => void;
}

function NodeShellContent({
  iconConfig,
  size,
  backgroundColor,
  accessibilityLabel,
  isInteractive,
  onPress,
}: NodeShellContentProps): React.JSX.Element {
  const faceColor: string = backgroundColor;
  const rimColor: string = darkenHex(faceColor, 0.22);
  const iconColor: string = isInteractive ? ICON_COLOR_ACTIVE : ICON_COLOR_LOCKED;
  const hugeiconSize = size * HUGEICON_SIZE_RATIO;

  const icon = useCallback((): React.ReactNode => {
    const iconObj = getHugeicon(iconConfig.value);
    return (
      <HugeiconsIcon
        icon={iconObj}
        size={hugeiconSize}
        color={iconColor}
        strokeWidth={1.8}
      />
    );
  }, [hugeiconSize, iconColor, iconConfig.value]);

  return (
    <DuolingoSvgNodeButton
      size={size}
      onPress={onPress}
      disabled={!isInteractive}
      faceColor={faceColor}
      rimColor={rimColor}
      icon={icon()}
      iconSize={hugeiconSize}
      accessibilityLabel={accessibilityLabel}
    />
  );
}

// ---------------------------------------------------------------------------
// BouncingTooltip (reused from PathNode — identical behavior)
// ---------------------------------------------------------------------------

interface BouncingTooltipProps {
  label: string | undefined;
  accentColor: string;
}

function BouncingTooltip({
  label,
  accentColor,
}: BouncingTooltipProps): React.JSX.Element | null {
  const isVisible: boolean = Boolean(label);

  // If there is no label to display, do not render the tooltip at all.
  // This prevents ghost tooltips from appearing when FlashList recycles cells.
  if (!isVisible) return null;

  return (
    <Animated.View
      className="absolute z-10 items-center justify-center"
      style={[
        {
          top: -46, // Adjusted slightly for the pointer
          width: 120, // Give it plenty of room so the text doesn't wrap
        },
      ]}
      pointerEvents="auto"
      accessibilityRole="text"
      accessibilityLabel={label ? `Current task: ${label}` : undefined}
    >
      <View
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.12,
          shadowRadius: 10,
          elevation: 5,
          alignItems: "center",
        }}
      >
        {/* The pointer triangle (rendered behind the main bubble) */}
        <View
          className="absolute -bottom-1.5 w-3.5 h-3.5 overflow-hidden"
          style={{ transform: [{ rotate: "45deg" }], borderRadius: 2 }}
        >
          <GlassView glassEffectStyle="regular" style={{ flex: 1 }} />
        </View>

        <GlassView 
          glassEffectStyle="clear" 
          style={{ 
            borderRadius: 14, 
            paddingHorizontal: 16, 
            paddingVertical: 8,
            overflow: "hidden", 
          }}
          isInteractive
        >
          <Text
            className="text-[13px] font-extrabold tracking-widest"
            style={{ color: accentColor }}
            numberOfLines={1}
          >
            {label ?? ""}
          </Text>
        </GlassView>
      </View>
    </Animated.View>
  );
}

// ---------------------------------------------------------------------------
// ConfigDrivenNode — Props
// ---------------------------------------------------------------------------

export interface ConfigDrivenNodeProps {
  /** Runtime node data (status, progress, label, etc.) */
  node: PathNodeData;
  /** Screen position for absolute placement */
  position: NodePosition;
  /** Variant key to look up from config */
  variantKey: string;
  /** Theme key from the parent unit to adapt the node color */
  colorThemeKey: string;
  /** Press handler */
  onPress: (node: PathNodeData) => void;
}

// ---------------------------------------------------------------------------
// ConfigDrivenNode — Main Component
// ---------------------------------------------------------------------------

function ConfigDrivenNodeInner({
  node,
  position,
  variantKey,
  colorThemeKey,
  onPress,
}: ConfigDrivenNodeProps): React.JSX.Element {
  const variant: NodeVariantConfig = useNodeVariant(variantKey);
  const theme = useColorTheme(colorThemeKey);
  const settings = useJourneySettings();
  const reducedMotion: boolean = useReducedMotion();

  // Resolve all visuals from config — ZERO hardcoded values
  const colorConfig: NodeColorConfig = variant.colors[node.status];
  const iconConfig: NodeIconConfig = variant.icons[node.status];
  const size: number = variant.size ?? settings.defaultNodeSize;
  const halfSize: number = size / 2;
  const isInteractive: boolean = node.status !== "locked";
  const isActive: boolean = node.status === "active";
  const isCompleted: boolean = node.status === "completed";

  // Track previous status for completion pop
  const prevStatusRef = useRef<string>(node.status);

  // ── Active animation (resolved from config key — no if/else) ──
  const animProgress = useSharedValue(0);

  useEffect(() => {
    if (isActive) {
      const factory: AnimationSetup =
        ANIMATION_FACTORIES[variant.activeAnimation] ??
        ANIMATION_FACTORIES.none;
      factory(animProgress, reducedMotion);
    } else {
      animProgress.value = 0;
    }
  }, [isActive, variant.activeAnimation, animProgress, reducedMotion]);

  // Breathing/shine scale style
  const activeScaleStyle = useAnimatedStyle(() => {
    const scale: number = interpolate(animProgress.value, [0, 1], [1, 1.12]);
    return { transform: [{ scale }] };
  });

  // Glow style synced to animation progress (only for active nodes)
  const glowStyle = useAnimatedStyle(() => {
    const shadowOpacity: number = interpolate(
      animProgress.value,
      [0, 1],
      [0.3, 0.7],
    );
    const shadowRadius: number = interpolate(
      animProgress.value,
      [0, 1],
      [8, 20],
    );
    return {
      shadowColor: colorConfig.glow ?? colorConfig.fill,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity,
      shadowRadius,
      elevation: 8,
    };
  });

  // ── Completion pop ──
  const popScale = useSharedValue(1);

  useEffect(() => {
    if (isCompleted && prevStatusRef.current === "active" && !reducedMotion) {
      popScale.value = withSequence(
        withSpring(1.3, { damping: 20, stiffness: 100, overshootClamping: true }),
        withSpring(1, { damping: 20, stiffness: 100, overshootClamping: true }),
      );
    }
    prevStatusRef.current = node.status;
  }, [node.status, isCompleted, popScale, reducedMotion]);

  const handlePress = (): void => {
    if (!isInteractive) return;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(
      () => { },
    );
    onPress(node);
  };

  // Progress ring dimensions and segmentation
  const ringSize: number =
    size + settings.progressRingGap * 2 + settings.progressRingStroke * 2;
  const ringOffset: number = -(ringSize - size) / 2;
  const ringRadius = (ringSize - settings.progressRingStroke) / 2;
  const circumference = 2 * Math.PI * ringRadius;

  // Adding strokeWidth to the gap accounts for round lineCaps overlapping.
  const segmentsCount = 8;
  const dashGap = 8 + settings.progressRingStroke;
  const dashWidth = (circumference - dashGap * segmentsCount) / segmentsCount;
  // Object properties must be precisely in this order for Object.values to destructure correctly
  const dashedConfig = { width: dashWidth, gap: dashGap };

  const progressPercent: number = (node.progress ?? 0) * 100;

  const a11yLabel: string = `${variant.label} ${node.index + 1}, ${node.status}${isActive && node.progress !== undefined
    ? `, ${Math.round(node.progress * 100)}% complete`
    : ""
    }`;

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
      {/* Bouncing tooltip — use theme color for active node, else config fill */}
      <BouncingTooltip
        label={node.label}
        accentColor={isActive ? theme.pathActiveColor : colorConfig.fill}
      />

      {/* Progress ring — segmented active and background tracks */}
      {variant.showProgressRing && isActive && (
        <View
          className="absolute items-center justify-center"
          style={{
            width: ringSize,
            height: ringSize,
            left: ringOffset,
            top: ringOffset,
          }}
        >
          <AnimatedCircularProgress
            size={ringSize}
            width={settings.progressRingStroke}
            fill={progressPercent}
            tintColor={theme.pathActiveColor}
            backgroundColor={"#E2E8F0"} // Inactive path grey from constants
            rotation={0}
            lineCap="round"
            dashedBackground={dashedConfig}
            dashedTint={dashedConfig}
          />
        </View>
      )}

      {/* Node visual — animated wrapper */}
      <Animated.View style={[isActive ? activeScaleStyle : undefined]}>
        <Animated.View style={isActive ? glowStyle : undefined}>
          <NodeShellContent
            iconConfig={iconConfig}
            size={size}
            backgroundColor={colorConfig.fill}
            accessibilityLabel={a11yLabel}
            isInteractive={isInteractive}
            onPress={handlePress}
          />
        </Animated.View>
      </Animated.View>
    </View>
  );
}

// Highly aggressive memoization to preserve scroll performance
export const ConfigDrivenNode = React.memo(
  ConfigDrivenNodeInner,
  (prev, next) => {
    // Only re-render if the core status changes, progress ticks, or theme changes.
    // X,Y positions never change at runtime so we don't bother deep comparing them.
    return (
      prev.node.id === next.node.id &&
      prev.node.status === next.node.status &&
      prev.node.progress === next.node.progress &&
      prev.variantKey === next.variantKey &&
      prev.colorThemeKey === next.colorThemeKey &&
      prev.position.x === next.position.x &&
      prev.position.y === next.position.y
    );
  },
);

export default ConfigDrivenNode;
