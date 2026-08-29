import React from "react";
import { Text, View, useWindowDimensions } from "react-native";

import { DividerCell } from "./DividerCell";
import { JourneyNodeCell } from "./JourneyNodeCell";
import { MascotCell } from "./MascotCell";
import JourneyLoadingSkeleton from "./JourneyLoadingSkeleton";
import MochiMascot from "@/src/screens/OnboardingScreen/components/MochiMascot";
import type { JourneyFlashListItem, PathNodeData } from "@/src/types/journey";

export const ESTIMATED_ITEM_SIZE = 120;
export const LIST_BOTTOM_SPACER_HEIGHT = 132;
export const JOURNEY_VIEWABILITY_CONFIG = {
  itemVisiblePercentThreshold: 10,
  minimumViewTime: 100,
};

type JourneyMapListItemProps = {
  activeGlobalIndex: number;
  item: JourneyFlashListItem;
  courseId: string;
  onNodePress: (node: PathNodeData, e?: any, color?: string) => void;
};

export const JourneyMapListItem = React.memo(function JourneyMapListItem({
  activeGlobalIndex,
  item,
  courseId,
  onNodePress,
}: JourneyMapListItemProps): React.JSX.Element {
  const { width: screenWidth } = useWindowDimensions();

  switch (item.itemType) {
    case "node":
      return (
        <JourneyNodeCell
          item={item}
          courseId={courseId}
          screenWidth={screenWidth}
          activeGlobalIndex={activeGlobalIndex}
          onNodePress={onNodePress}
        />
      );
    case "divider":
      return (
        <DividerCell
          item={item}
          screenWidth={screenWidth}
          activeGlobalIndex={activeGlobalIndex}
        />
      );
    case "mascot":
      return <MascotCell item={item} />;
    default:
      return renderUnsupportedJourneyItem(item);
  }
});

type JourneyMapListFooterProps = {
  height: number;
};

export const JourneyMapListFooter = React.memo(function JourneyMapListFooter({
  height,
}: JourneyMapListFooterProps): React.JSX.Element {
  return <View pointerEvents="none" style={{ height }} />;
});

export function JourneyMapLoadingState(): React.JSX.Element {
  return <JourneyLoadingSkeleton />;
}

export function JourneyMapEmptyState(): React.JSX.Element {
  return (
    <View className="flex-1 items-center justify-center px-8 pb-16">
      <MochiMascot expression="concentrating" size={100} delay={0} />
      <Text
        style={{ fontFamily: "CormorantSemiBold" }}
        className="mt-5 text-center text-[24px] leading-tight text-ink"
        adjustsFontSizeToFit
        numberOfLines={2}
      >
        Your journey is being prepared
      </Text>
      <Text
        style={{ fontFamily: "GeistMedium" }}
        className="mt-2.5 text-center text-[15px] leading-relaxed text-ink-soft"
      >
        Check back shortly. Your personalized path will be ready soon.
      </Text>
    </View>
  );
}

export function getJourneyMapItemKey(item: JourneyFlashListItem): string {
  return item.id;
}

export function getJourneyMapItemType(
  item: JourneyFlashListItem,
): JourneyFlashListItem["itemType"] {
  return item.itemType;
}

function renderUnsupportedJourneyItem(_item: never): React.JSX.Element {
  return <View pointerEvents="none" />;
}
