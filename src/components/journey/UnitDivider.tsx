/**
 * UnitDivider
 * Quiet divider row rendered between units in the journey map.
 *
 * The title pill deliberately avoids the connector lane so the path transition
 * stays legible even when the next unit begins on the opposite side.
 */

import React from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { DIVIDER_LAYOUT } from "@/src/data/journey/constants";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface UnitDividerProps {
  /** Title shown in the divider (e.g. "Describe your family") */
  title: string;
  /** Approximate X position of the connector lane for this divider row */
  connectorLaneX?: number;
  /** Screen width used to route the title away from the connector lane */
  screenWidth: number;
}

interface DividerLineProps {
  flex?: number;
  width?: number;
}

function DividerLine({ flex = 1, width }: DividerLineProps): React.JSX.Element {
  return (
    <View
      style={{
        ...(width === undefined ? { flex } : { width }),
        minWidth: DIVIDER_LAYOUT.minLineWidth,
        height: 1,
        backgroundColor: DIVIDER_LAYOUT.lineColor,
      }}
    />
  );
}

function resolveConnectorLaneX(
  connectorLaneX: number | undefined,
  screenWidth: number,
): number {
  const fallbackLaneX = Math.round(screenWidth / 2);
  const rawLaneX =
    typeof connectorLaneX === "number" ? connectorLaneX : fallbackLaneX;
  const minLaneX = DIVIDER_LAYOUT.edgePadding + DIVIDER_LAYOUT.minLineWidth;
  const maxLaneX =
    screenWidth - DIVIDER_LAYOUT.edgePadding - DIVIDER_LAYOUT.minLineWidth;

  return Math.round(Math.min(Math.max(rawLaneX, minLaneX), maxLaneX));
}

function resolveLaneWidth(screenWidth: number): number {
  return Math.max(
    DIVIDER_LAYOUT.laneClearance,
    Math.min(
      screenWidth * DIVIDER_LAYOUT.laneWidthFactor,
      screenWidth - DIVIDER_LAYOUT.edgePadding * 2,
    ),
  );
}

function resolveFixedLineWidth(
  availableWidth: number,
  minimumWidth: number,
): number {
  return Math.max(availableWidth, minimumWidth);
}

// ---------------------------------------------------------------------------
// UnitDivider
// ---------------------------------------------------------------------------

function UnitDivider({
  title,
  connectorLaneX,
  screenWidth,
}: UnitDividerProps): React.JSX.Element {
  const laneCenterX = resolveConnectorLaneX(connectorLaneX, screenWidth);
  const isConnectorLaneLeftOfCenter = laneCenterX <= screenWidth / 2;
  const laneWidth = resolveLaneWidth(screenWidth);
  const leftLineWidth = resolveFixedLineWidth(
    laneCenterX - DIVIDER_LAYOUT.edgePadding,
    DIVIDER_LAYOUT.minLineWidth,
  );
  const rightLineWidth = resolveFixedLineWidth(
    screenWidth - laneCenterX - DIVIDER_LAYOUT.edgePadding,
    DIVIDER_LAYOUT.minLineWidth,
  );

  const titlePill = (
    <View
      className="rounded-full px-2.5 py-1"
      style={{
        backgroundColor: DIVIDER_LAYOUT.titlePillColor,
        maxWidth: screenWidth * DIVIDER_LAYOUT.titleMaxWidthRatio,
      }}
    >
      <Text
        style={{
          fontFamily: "GeistMedium",
          color: DIVIDER_LAYOUT.titleTextColor,
          letterSpacing: -0.1,
        }}
        className="text-[13px] text-center"
        numberOfLines={1}
        accessibilityRole="header"
      >
        {title}
      </Text>
    </View>
  );

  return (
    <View
      className="w-full h-full justify-center"
      style={{
        paddingHorizontal: DIVIDER_LAYOUT.edgePadding,
      }}
    >
      <View className="flex-row items-center">
        {isConnectorLaneLeftOfCenter ? (
          <>
            <DividerLine width={leftLineWidth} />
            <View style={{ width: laneWidth }} />
            {titlePill}
            <View style={{ width: DIVIDER_LAYOUT.titleGap }} />
            <DividerLine />
          </>
        ) : (
          <>
            <DividerLine />
            <View style={{ width: DIVIDER_LAYOUT.titleGap }} />
            {titlePill}
            <View style={{ width: laneWidth }} />
            <DividerLine width={rightLineWidth} />
          </>
        )}
      </View>
    </View>
  );
}

export default React.memo(UnitDivider);
