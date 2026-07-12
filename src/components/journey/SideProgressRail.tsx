/**
 * SideProgressRail (Task 10)
 * Floating side panel showing persistent progress icons.
 *
 * Matches Duolingo reference (Images 1, 3, 4):
 * - Left side of screen, floating over scroll content
 * - XP counter (dumbbell icon + "0/30" style)
 * - Hearts icon + count
 * - Streak/hourglass icon
 *
 * Values driven by JourneyStats. Tapping opens relevant detail.
 */

import React, { useEffect } from "react";
import { View, Pressable } from "react-native";
import { Text } from "@/src/components/ui/Text";
import type { JourneyStats } from "@/src/types/journey/state";
import { triggerIfEnabledSync } from "@/lib/haptics/hapticUtils";
import { HAPTIC_INTENSITIES } from "@/lib/haptics/hapticConfig";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SideProgressRailProps {
  stats: JourneyStats;
  onXPPress?: () => void;
  onHeartsPress?: () => void;
  onStreakPress?: () => void;
}

// ---------------------------------------------------------------------------
// RailIcon sub-component
// ---------------------------------------------------------------------------

interface RailIconProps {
  icon: string;
  value: string;
  backgroundColor: string;
  borderColor: string;
  onPress?: () => void;
  accessibilityLabel: string;
}

function RailIcon({
  icon,
  value,
  backgroundColor,
  borderColor,
  onPress,
  accessibilityLabel,
}: RailIconProps): React.JSX.Element {
  const handlePress = () => {
    void triggerIfEnabledSync("pulse", HAPTIC_INTENSITIES.PULSE_LIGHT);
    onPress?.();
  };

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      className="items-center mb-3"
    >
      <View
        className="w-14 h-14 rounded-2xl items-center justify-center"
        style={{
          backgroundColor,
          borderWidth: 2,
          borderColor,
          borderBottomWidth: 4,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}
      >
        <Text className="text-lg">{icon}</Text>
      </View>
      <Text className="text-xs font-bold mt-1" style={{ color: "#4A5568" }}>
        {value}
      </Text>
    </Pressable>
  );
}

// ---------------------------------------------------------------------------
// SideProgressRail
// ---------------------------------------------------------------------------

function SideProgressRail({
  stats,
  onXPPress,
  onHeartsPress,
  onStreakPress,
}: SideProgressRailProps): React.JSX.Element {
  return (
    <View
      className="absolute left-2 z-20 items-center"
      style={{ top: 120 }}
      pointerEvents="box-none"
      accessibilityRole="summary"
      accessibilityLabel="Progress stats"
    >
      <RailIcon
        icon="🏋️"
        value={`${stats.totalXP}`}
        backgroundColor="#E0F2FE"
        borderColor="#7DD3FC"
        onPress={onXPPress}
        accessibilityLabel={`Total XP: ${stats.totalXP}`}
      />

      <RailIcon
        icon="❤️"
        value={`${stats.hearts}`}
        backgroundColor="#FEE2E2"
        borderColor="#FCA5A5"
        onPress={onHeartsPress}
        accessibilityLabel={`Hearts: ${stats.hearts}`}
      />

      <RailIcon
        icon="⏳"
        value={`${stats.streakDays}`}
        backgroundColor="#E0E7FF"
        borderColor="#A5B4FC"
        onPress={onStreakPress}
        accessibilityLabel={`Streak: ${stats.streakDays} days`}
      />
    </View>
  );
}

export default React.memo(SideProgressRail);
