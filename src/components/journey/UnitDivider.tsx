/**
 * UnitDivider
 * Quiet divider row rendered between units in the journey map.
 *
 * The title pill deliberately avoids the connector lane so the path transition
 * stays legible even when the next unit begins on the opposite side.
 */

import React from "react";
import { View } from "react-native";
import { GlassView } from "expo-glass-effect";
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
  const baseColor = accentColor || DIVIDER_LAYOUT.titlePillColor;

  const titlePill = (
    <View
      style={{
        maxWidth: screenWidth * DIVIDER_LAYOUT.titleMaxWidthRatio,
      }}
    >
      <View
        style={{
          borderRadius: 20,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            backgroundColor: baseColor,
            opacity: 0.75,
            position: "absolute",
            width: "100%",
            height: "100%",
          }}
        />

        {/* The text content */}
        <GlassView
          glassEffectStyle="clear"
          isInteractive
          style={{
            borderRadius: 20,
            paddingHorizontal: 16,
            paddingVertical: 8,
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
        </GlassView>
      </View>
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
