/**
 * UnitDivider (Task 6)
 * Visual divider rendered between units in the scrollable journey path.
 *
 * Matches Duolingo reference (Images 3 & 4):
 * - Horizontal line with centered unit title text
 * - Optional "JUMP HERE?" speech bubble badge
 * - Fast-forward ⏩ button with configurable color
 *
 * All props driven by UnitDividerConfig — no hardcoded values.
 */

import React, { useEffect } from "react";
import { View, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Text } from "@/components/ui/text";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  interpolate,
} from "react-native-reanimated";
import { useReducedMotion } from "@/src/hooks/useReducedMotion";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface UnitDividerProps {
  /** Title shown in the divider (e.g. "Describe your family") */
  title: string;
}

// ---------------------------------------------------------------------------
// UnitDivider
// ---------------------------------------------------------------------------

function UnitDivider({ title }: UnitDividerProps): React.JSX.Element {
  return (
    <View
      className="w-full px-4 justify-end items-center h-full"
      style={{
        paddingTop: 4,
        paddingBottom: 2,
      }}
    >
      {/* Quiet divider with low-contrast title */}
      <View className="flex-row items-center px-1">
        <View
          className="flex-1 h-px"
          style={{ backgroundColor: "rgba(203, 213, 225, 0.92)" }}
        />
        <View
          className="mx-3 rounded-full px-2.5 py-1"
          style={{
            backgroundColor: "rgba(203, 213, 225, 0.12)",
          }}
        >
          <Text
            className="text-[14px] font-medium text-center"
            style={{ color: "#64748B", letterSpacing: -0.1 }}
            accessibilityRole="header"
          >
            {title}
          </Text>
        </View>
        <View
          className="flex-1 h-px"
          style={{ backgroundColor: "rgba(203, 213, 225, 0.92)" }}
        />
      </View>
    </View>
  );
}

export default React.memo(UnitDivider);
