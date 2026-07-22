import React from "react";
import { View } from "react-native";
import Animated from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";
import { GlassView } from "expo-glass-effect";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { Link } from "expo-router";
import { Text } from "@/src/components/ui/Text";
import { NodeStatus } from "@/src/types/journey";
import { DuolingoSvgNodeButton } from "./DuolingoSvgNodeButton";
import {
  useJourneyNodeCellViewModel,
  type JourneyNodeCellProps,
} from "../hooks/useJourneyNodeCellViewModel";

const AnimatedPath = Animated.createAnimatedComponent(Path);

function BouncingTooltip({
  label,
  accentColor,
}: {
  label?: string;
  accentColor: string;
}) {
  if (!label) return null;

  return (
    <Animated.View
      className="absolute z-10 items-center justify-center"
      style={[{ top: -46, width: 200, alignSelf: "center" }]}
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
          style={{
            transform: [{ rotate: "45deg" }],
            backgroundColor: accentColor,
            opacity: 0.75,
            borderRadius: 2,
          }}
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

export interface JourneyNodeCellViewProps
  extends ReturnType<typeof useJourneyNodeCellViewModel> {}

/**
 * Presentational View component for JourneyNodeCell.
 * Strictly contains JSX code without internal hooks.
 */
export const JourneyNodeCellView = React.memo(function JourneyNodeCellView({
  item,
  courseId,
  screenWidth,
  pathStrokeWidth,
  settings,
  theme,
  segmentColor,
  animatedPathProps,
  nodePosition,
  faceColor,
  rimColor,
  iconColor,
  size,
  hugeiconSize,
  halfSize,
  isInteractive,
  showProgressRing,
  showTooltip,
  handlePress,
  activeScaleStyle,
  ringSize,
  ringOffset,
  dashedConfig,
  progressPercent,
  iconObj,
}: JourneyNodeCellViewProps): React.JSX.Element {
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
              tintColor={theme.pathActiveColor || faceColor}
              backgroundColor="#E2E8F0"
              rotation={0}
              lineCap="round"
              dashedBackground={dashedConfig}
              dashedTint={dashedConfig}
            />
          </View>
        )}

        <Animated.View
          style={
            item.status === NodeStatus.ACTIVE ? activeScaleStyle : undefined
          }
        >
          {isInteractive ? (
            <Link
              href={{
                pathname: "/tabs/screens/journey-flow",
                params: { courseId, nodeId: item.id },
              }}
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
});

function JourneyNodeCellInner(props: JourneyNodeCellProps): React.JSX.Element {
  const viewModel = useJourneyNodeCellViewModel(props);
  return <JourneyNodeCellView {...viewModel} />;
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
export type { JourneyNodeCellProps };
