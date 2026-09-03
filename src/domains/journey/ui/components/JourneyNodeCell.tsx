import React from "react";
import { View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { FontAwesome5 } from "@expo/vector-icons";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { Link } from "expo-router";
import { SEMANTIC_COLORS } from "@/src/theme/colors";
import { RADIUS } from "@/src/theme/radius";
import { Text } from "@/src/components/ui/Text";
import { NodeType } from "@/src/types/journey";
import { DuolingoSvgNodeButton } from "./DuolingoSvgNodeButton";
import ChestNode from "./ChestNode";
import TrophyNode from "./TrophyNode";
import {
  useJourneyNodeCellViewModel,
  type JourneyNodeCellProps,
} from "../hooks/useJourneyNodeCellViewModel";

const FONTAWESOME_MAP: Record<string, string> = {
  star: "star",
  checkpoint: "check-circle",
  chest: "box",
  microphone: "microphone",
  video: "video",
  gamepad: "gamepad",
  headphones: "headphones",
  book: "book",
  brain: "brain",
  journal: "book-open",
  quiz: "question-circle",
  heart: "heart",
  mood_check: "smile",
  story: "comments",
  practice: "redo",
  challenge: "shield-alt",
  boss: "skull",
  lock: "lock",
};

function CurrentNodeLabel({
  label,
  nodeSize,
}: {
  label?: string;
  nodeSize: number;
}) {
  if (!label) return null;

  return (
    <View
      className="absolute z-10 items-center justify-center"
      style={{
        top: -50,
        left: (nodeSize - 104) / 2,
        width: 104,
      }}
      pointerEvents="none"
      accessibilityRole="text"
      accessibilityLabel={`Current task: ${label}`}
    >
      <View
        style={{
          borderRadius: 12,
          borderCurve: "continuous",
          backgroundColor: SEMANTIC_COLORS.brand.onSoft,
          paddingHorizontal: 14,
          paddingVertical: 7,
        }}
      >
        <Text
          variant="body-bold"
          style={{ color: "#FFFFFF" }}
          numberOfLines={1}
        >
          {label}
        </Text>
      </View>
      <View
        className="-mt-1 h-3 w-3"
        style={{
          transform: [{ rotate: "45deg" }],
          backgroundColor: SEMANTIC_COLORS.brand.onSoft,
          borderRadius: 2,
        }}
      />
    </View>
  );
}

export interface JourneyNodeCellViewProps extends ReturnType<
  typeof useJourneyNodeCellViewModel
> {}

export const JourneyNodeCellView = React.memo(function JourneyNodeCellView({
  item,
  courseId,
  screenWidth,
  pathStrokeWidth,
  settings,
  segmentColor,
  nodePosition,
  faceColor,
  rimColor,
  iconColor,
  iconName,
  size,
  hugeiconSize,
  halfSize,
  isInteractive,
  showProgressRing,
  showTooltip,
  handlePress,
  ringSize,
  ringOffset,
  dashedConfig,
  progressPercent,
  ringBackgroundColor,
  pathNodeData,
}: JourneyNodeCellViewProps): React.JSX.Element {
  const accessibilityLabel = `${item.label ?? "Lesson"} ${item.status}`;
  const nodeIcon = (
    <FontAwesome5
      name={FONTAWESOME_MAP[iconName] ?? "star"}
      size={hugeiconSize * 0.6}
      color={iconColor}
    />
  );
  const button = (
    <DuolingoSvgNodeButton
      size={size}
      onPress={handlePress}
      disabled={!isInteractive}
      faceColor={faceColor}
      rimColor={rimColor}
      icon={nodeIcon}
      iconSize={hugeiconSize}
      accessibilityLabel={accessibilityLabel}
    />
  );

  return (
    <View
      style={{
        height: item.cellHeight,
        width: screenWidth,
        zIndex: 1000 - item.globalIndex,
      }}
    >
      {item.segmentD.length > 0 ? (
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
      ) : null}

      {item.type === NodeType.CHEST ? (
        <ChestNode node={pathNodeData} position={nodePosition} onPress={handlePress} />
      ) : item.type === NodeType.TROPHY ? (
        <TrophyNode node={pathNodeData} position={nodePosition} onPress={handlePress} />
      ) : (
        <View
          className="items-center justify-center"
          style={{
            position: "absolute",
            left: nodePosition.x - halfSize,
            top: nodePosition.y - halfSize,
            width: size,
            height: size,
          }}
        >
          <CurrentNodeLabel
            label={showTooltip ? item.label : undefined}
            nodeSize={size}
          />
          {showProgressRing ? (
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
                tintColor={faceColor}
                backgroundColor={ringBackgroundColor}
                rotation={0}
                lineCap="round"
                dashedBackground={dashedConfig}
                dashedTint={dashedConfig}
              />
            </View>
          ) : null}

          {isInteractive ? (
            <Link
              href={{
                pathname: "/tabs/screens/journey-flow",
                params: { courseId, nodeId: item.id },
              }}
              asChild
            >
              <Link.Trigger>
                <Link.AppleZoom>{button}</Link.AppleZoom>
              </Link.Trigger>
            </Link>
          ) : (
            button
          )}
        </View>
      )}
    </View>
  );
});

function JourneyNodeCellInner(props: JourneyNodeCellProps): React.JSX.Element {
  const viewModel = useJourneyNodeCellViewModel(props);
  return <JourneyNodeCellView {...viewModel} />;
}

export const JourneyNodeCell = React.memo(
  JourneyNodeCellInner,
  (previous: JourneyNodeCellProps, next: JourneyNodeCellProps): boolean =>
    previous.item.id === next.item.id &&
    previous.item.status === next.item.status &&
    previous.item.progress === next.item.progress &&
    previous.activeGlobalIndex === next.activeGlobalIndex &&
    previous.screenWidth === next.screenWidth,
);

export default JourneyNodeCell;
export type { JourneyNodeCellProps };
