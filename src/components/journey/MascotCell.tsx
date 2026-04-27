import React from "react";
import { View } from "react-native";
import type { JourneyMascotItem } from "@/src/types/journey";
import { MascotSide } from "@/src/types/journey";
import MascotBubble from "./MascotBubble";
import { MASCOT_SIZE } from "@/src/data/journey/constants";

export interface MascotCellProps {
  item: JourneyMascotItem;
}

/** Renders a mascot bubble overlay anchored to a journey path position. */
export function MascotCell({ item }: MascotCellProps): React.JSX.Element {
  const calculatedY =
    item.cellHeight > 0 ? item.cellHeight / 2 : MASCOT_SIZE.verticalOffset;

  return (
    <View
      style={{
        height: item.cellHeight,
        backgroundColor: "transparent",
        overflow: "visible",
      }}
    >
      <MascotBubble
        x={item.x}
        y={calculatedY}
        side={item.side as MascotSide}
        initialMessage={item.message}
        imageKey={item.imageKey}
        avatarSize={item.avatarSize}
        offsetY={item.offsetY}
      />
    </View>
  );
}
