/**
 * JourneyNodeCell
 * FlashList cell component for the segment-per-cell architecture.
 *
 * Each cell renders:
 * 1. Its own <Svg height={cellHeight}> with the pre-built bezier segment
 * 2. An inline Node renderer absolutely positioned at the path endpoint
 */

import React, { useCallback, useEffect } from "react";
import { View } from "react-native";
import Animated, { 
  useSharedValue, 
  useAnimatedProps, 
  withRepeat, 
  withTiming, 
  Easing,
  interpolate,
  useAnimatedStyle
} from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";
import * as Haptics from "expo-haptics";
import { GlassView } from "expo-glass-effect";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { Link } from "expo-router";

import { Text } from "@/src/components/ui/Text";
import type { JourneyNode, PathNodeData, NodePosition } from "@/src/types/journey";
import { NodeStatus } from "@/src/types/journey";
import { useHighContrast } from "@/src/hooks/useHighContrast";
import { DuolingoSvgNodeButton } from "./DuolingoSvgNodeButton";
import { darkenHex } from "@/src/utils/colorUtils";
import { getHugeicon } from "@/src/data/journey/hugeiconsRegistry";
import { useJourneySettings, useColorTheme } from "@/src/context/JourneyConfigContext";
import { RevealNode } from "@/src/components/journey/animations/RevealNode";
import { RevealPath } from "@/src/components/journey/animations/RevealPath";

const AnimatedPath = Animated.createAnimatedComponent(Path);

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const NODE_VERTICAL_POSITION_RATIO = 0.85;
const HUGEICON_SIZE_RATIO = 0.6;

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface JourneyNodeCellProps {
  item: JourneyNode;
  courseId: string;
  screenWidth: number;
  activeGlobalIndex: number;
  onNodePress: (node: PathNodeData, e?: any, color?: string) => void;
}

// ---------------------------------------------------------------------------
// Helper: convert JourneyNode → PathNodeData
// ---------------------------------------------------------------------------

function toPathNodeData(item: JourneyNode): PathNodeData {
  return {
    id: item.id,
    index: item.globalIndex,
    type: item.type,
    status: item.status,
    icon: item.icon,
    progress: item.progress,
    label: item.status === NodeStatus.ACTIVE ? item.label : undefined,
    taskId: item.taskId,
    rewards: item.rewards,
  };
}

// ---------------------------------------------------------------------------
// BouncingTooltip
// ---------------------------------------------------------------------------

function BouncingTooltip({ label, accentColor }: { label?: string; accentColor: string }) {
  if (!label) return null;

  return (
    <Animated.View
      className="absolute z-10 items-center justify-center"
      style={[{ top: -46, width: 200, alignSelf: 'center' }]}
      pointerEvents="auto"
      accessibilityRole="text"
      accessibilityLabel={`Current task: ${label}`}
    >
      <View
        style={{
          shadowColor: accentColor,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 5,
          alignItems: "center",
        }}
      >
        <View
          className="absolute -bottom-1 w-3 h-3"
          style={{ transform: [{ rotate: "45deg" }], backgroundColor: accentColor, opacity: 0.75, borderRadius: 2 }}
        />

        <View
          style={{
            borderRadius: 14,
            overflow: "hidden",
          }}
        >
          <View
            style={{
              backgroundColor: accentColor,
              opacity: 0.75,
              position: "absolute",
              width: "100%",
              height: "100%",
            }}
          />
          <GlassView 
            glassEffectStyle="clear"
            style={{ 
              borderRadius: 14, 
              paddingHorizontal: 16, 
              paddingVertical: 8,
            }}
          >
            <Text
              variant="body-bold"
              className="text-ink text-[13px]"
              numberOfLines={1}
            >
              {label}
            </Text>
          </GlassView>
        </View>
      </View>
    </Animated.View>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

function JourneyNodeCellInner({
  item,
  courseId,
  screenWidth,
  activeGlobalIndex,
  onNodePress,
}: JourneyNodeCellProps): React.JSX.Element {
  const { pathColors, pathStrokeWidth } = useHighContrast();
  const settings = useJourneySettings();
  const theme = useColorTheme(item.colorThemeKey);

  const isProgressSegment: boolean =
    item.status === NodeStatus.COMPLETED ||
    (activeGlobalIndex >= 0 && item.globalIndex <= activeGlobalIndex);
  
  const segmentColor: string = isProgressSegment
    ? pathColors.active
    : pathColors.inactive;

  const dashLength = 20;
  const dashOffset = useSharedValue(0);
  const isActiveSegment = activeGlobalIndex >= 0 && item.globalIndex === activeGlobalIndex;

  useEffect(() => {
    if (isActiveSegment) {
      dashOffset.value = withRepeat(
        withTiming(-dashLength, { duration: 1000, easing: Easing.linear }),
        -1,
        false
      );
    } else {
      dashOffset.value = 0;
    }
  }, [isActiveSegment, dashOffset]);

  const animatedPathProps = useAnimatedProps(() => ({
    strokeDashoffset: dashOffset.value,
  }));

  const nodePosition: NodePosition = {
    x: item.x,
    y: item.cellHeight * NODE_VERTICAL_POSITION_RATIO,
  };

  const pathNodeData = toPathNodeData(item);

  // ── Node Visuals via Simple Switch ──
  let faceColor = "#E2E8F0";
  let iconName = item.icon || "star";
  let isInteractive = false;
  let showProgressRing = false;
  let showTooltip = false;

  switch (item.status) {
    case NodeStatus.COMPLETED:
      faceColor = theme.headerGradient[1];
      iconName = item.icon || "checkpoint";
      isInteractive = true;
      break;
    case NodeStatus.ACTIVE:
      faceColor = theme.headerGradient[1];
      iconName = item.icon || "star";
      isInteractive = true;
      showTooltip = true;
      break;
    case NodeStatus.LOCKED:
    default:
      faceColor = "#CBD5E1";
      iconName = item.icon || "star";
      isInteractive = false;
      break;
  }

  const rimColor = darkenHex(faceColor, 0.22);
  const iconColor = darkenHex(faceColor, 0.55); // Tone-on-tone icon color
  const size = settings.defaultNodeSize;
  const hugeiconSize = size * HUGEICON_SIZE_RATIO;
  const halfSize = size / 2;

  const handlePress = useCallback(
    (e?: any) => {
      if (!isInteractive) return;
      void Haptics.selectionAsync().catch(() => {});
      onNodePress(pathNodeData, e, faceColor);
    },
    [isInteractive, onNodePress, pathNodeData, faceColor]
  );

  const animProgress = useSharedValue(0);
  useEffect(() => {
    if (item.status === NodeStatus.ACTIVE) {
      animProgress.value = withRepeat(
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
    } else {
      animProgress.value = 0;
    }
  }, [item.status, animProgress]);

  const activeScaleStyle = useAnimatedStyle(() => {
    const scale = interpolate(animProgress.value, [0, 1], [1, 1.05]);
    return { transform: [{ scale }] };
  });

  const ringSize = size + settings.progressRingGap * 2 + settings.progressRingStroke * 2;
  const ringOffset = -(ringSize - size) / 2;
  const ringRadius = (ringSize - settings.progressRingStroke) / 2;
  const circumference = 2 * Math.PI * ringRadius;
  const segmentsCount = 8;
  const dashGap = 8 + settings.progressRingStroke;
  const dashWidth = (circumference - dashGap * segmentsCount) / segmentsCount;
  const dashedConfig = { width: dashWidth, gap: dashGap };
  const progressPercent = (item.progress ?? 0) * 100;

  const iconObj = getHugeicon(iconName);

  return (
    <Animated.View
      style={{
        height: item.cellHeight,
        width: screenWidth,
        zIndex: 1000 - item.globalIndex,
      }}
    >
      {item.segmentD.length > 0 && (
          <Svg
            width={screenWidth}
            height={item.cellHeight}
            style={{ position: "absolute", top: 0, left: 0 }}
            pointerEvents="none"
          >
            <Path
              d={item.segmentD}
              stroke={segmentColor}
              strokeWidth={pathStrokeWidth}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="0 28"
            />
            {/* Removed the translucent dashed overlay that created the 'rope' stitching */}
          </Svg>
      )}

      <View
        style={{
          position: "absolute",
          left: nodePosition.x - halfSize,
          top: nodePosition.y - halfSize,
          width: size,
          height: size,
        }}
        className="items-center justify-center"
      >
          <BouncingTooltip
            label={showTooltip ? item.label : undefined}
            accentColor={faceColor}
          />

          {showProgressRing && (
            <View
              className="absolute items-center justify-center"
              style={{ width: ringSize, height: ringSize, left: ringOffset, top: ringOffset }}
            >
              <AnimatedCircularProgress
                size={ringSize}
                width={settings.progressRingStroke}
                fill={progressPercent}
                tintColor={theme.pathActiveColor || faceColor}
                backgroundColor="#E2E8F0"
                rotation={0}
                lineCap="round"
                dashedBackground={dashedConfig}
                dashedTint={dashedConfig}
              />
            </View>
          )}

          <Animated.View style={item.status === NodeStatus.ACTIVE ? activeScaleStyle : undefined}>
            {isInteractive ? (
              <Link
                href={{ pathname: "/tabs/screens/journey-flow", params: { courseId, nodeId: item.id } }}
                asChild
              >
                <Link.Trigger>
                  <Link.AppleZoom>
                    <DuolingoSvgNodeButton
                      size={size}
                      onPress={handlePress}
                      disabled={!isInteractive}
                      faceColor={faceColor}
                      rimColor={rimColor}
                      icon={
                        <HugeiconsIcon
                          icon={iconObj}
                          size={hugeiconSize}
                          color={iconColor}
                          strokeWidth={2.5}
                        />
                      }
                      iconSize={hugeiconSize}
                      accessibilityLabel={`${item.label} ${item.status}`}
                    />
                  </Link.AppleZoom>
                </Link.Trigger>
              </Link>
            ) : (
              <DuolingoSvgNodeButton
                size={size}
                onPress={handlePress}
                disabled={!isInteractive}
                faceColor={faceColor}
                rimColor={rimColor}
                icon={
                  <HugeiconsIcon
                    icon={iconObj}
                    size={hugeiconSize}
                    color={iconColor}
                    strokeWidth={2.5}
                  />
                }
                iconSize={hugeiconSize}
                accessibilityLabel={`${item.label} ${item.status}`}
              />
            )}
          </Animated.View>
      </View>
    </Animated.View>
  );
}

export const JourneyNodeCell = React.memo(
  JourneyNodeCellInner,
  (prev: JourneyNodeCellProps, next: JourneyNodeCellProps): boolean => {
    return (
      prev.item.id === next.item.id &&
      prev.item.status === next.item.status &&
      prev.item.progress === next.item.progress &&
      prev.activeGlobalIndex === next.activeGlobalIndex &&
      prev.screenWidth === next.screenWidth
    );
  },
);

export default JourneyNodeCell;
