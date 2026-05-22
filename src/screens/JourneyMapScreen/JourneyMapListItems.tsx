import React from "react";
import { Dimensions, Text, View } from "react-native";

import { DividerCell } from "@/src/components/journey/DividerCell";
import { JourneyNodeCell } from "@/src/components/journey/JourneyNodeCell";
import { MascotCell } from "@/src/components/journey/MascotCell";
import type { JourneyFlashListItem, PathNodeData } from "@/src/types/journey";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const ESTIMATED_ITEM_SIZE = 120;
export const LIST_BOTTOM_SPACER_HEIGHT = 132;
export const JOURNEY_VIEWABILITY_CONFIG = {
  itemVisiblePercentThreshold: 10,
  minimumViewTime: 100,
};

type JourneyMapListItemProps = {
  activeGlobalIndex: number;
  item: JourneyFlashListItem;
  onNodePress: (node: PathNodeData) => void;
};

export const JourneyMapListItem = React.memo(function JourneyMapListItem({
  activeGlobalIndex,
  item,
  onNodePress,
}: JourneyMapListItemProps): React.JSX.Element {
  switch (item.itemType) {
    case "node":
      return (
        <JourneyNodeCell
          item={item}
          screenWidth={SCREEN_WIDTH}
          activeGlobalIndex={activeGlobalIndex}
          onNodePress={onNodePress}
        />
      );
    case "divider":
      return (
        <DividerCell
          item={item}
          screenWidth={SCREEN_WIDTH}
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
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-ink-muted">Loading...</Text>
    </View>
  );
}

export function JourneyMapEmptyState(): React.JSX.Element {
  return (
    <View>
      <Text>This course is being prepared. Check back shortly.</Text>
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
