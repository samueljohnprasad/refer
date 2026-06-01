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
  /** Screen width used to route the title away from the connector lane */
  screenWidth: number;
  /** Dynamic accent color derived from the unit theme (optional) */
  accentColor?: string;
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

// ---------------------------------------------------------------------------
// UnitDivider
// ---------------------------------------------------------------------------

function UnitDivider({
  title,
  screenWidth,
  accentColor,
}: UnitDividerProps): React.JSX.Element {

  const titlePill = (
    <View
      className="rounded-full px-4 py-1.5 shadow-sm border-2 border-sage-50"
      style={{
        backgroundColor: accentColor || DIVIDER_LAYOUT.titlePillColor,
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
      className="w-full"
      style={{
        paddingHorizontal: DIVIDER_LAYOUT.edgePadding,
      }}
    >
      <View className="flex-row items-center w-full">
        <DividerLine flex={1} />
        <View style={{ width: DIVIDER_LAYOUT.titleGap }} />
        {titlePill}
        <View style={{ width: DIVIDER_LAYOUT.titleGap }} />
        <DividerLine flex={1} />
      </View>
    </View>
  );
}

export default React.memo(UnitDivider);
