/**
 * JourneyHeader
 * Top header bar for the journey map screen.
 * Shows unit info with a gradient background and user stats (streak, gems, hearts).
 *
 * Uses expo-linear-gradient for the color gradient (already installed).
 */

import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/src/components/ui/Text";
import { LinearGradient } from "expo-linear-gradient";
import { UnitData } from "@/src/types/journey/unit";
import { JourneyStats } from "@/src/types/journey/state";
import { DEFAULT_JOURNEY_CONFIG } from "@/src/data/journey";


// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface JourneyHeaderProps {
  unit: UnitData;
  stats: JourneyStats;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface StatBadgeProps {
  icon: string;
  value: number;
  label: string;
}

function StatBadge({ icon, value, label }: StatBadgeProps): React.JSX.Element {
  return (
    <View
      className="flex-row items-center gap-1"
      accessibilityRole="text"
      accessibilityLabel={`${label}: ${value}`}
    >
      <Text className="text-base" importantForAccessibility="no">
        {icon}
      </Text>
      <Text className="text-sm font-extrabold text-white">{value}</Text>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

function JourneyHeader({ unit, stats }: JourneyHeaderProps): React.JSX.Element {
  const theme = DEFAULT_JOURNEY_CONFIG.colorThemes[unit.colorScheme] ?? DEFAULT_JOURNEY_CONFIG.colorThemes.green;
  const gradientColors = theme.headerGradient;

  return (
    <LinearGradient
      colors={[...gradientColors]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="w-full px-5 pt-2 pb-5"
    >
      <SafeAreaView edges={["top"]}>
        {/* Stats row */}
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-lg">🇫🇷</Text>
          <View
            className="flex-row items-center gap-4"
            accessibilityRole="summary"
            accessibilityLabel={`Stats: ${stats.streakDays} day streak, ${stats.wallet.gems} gems, ${stats.hearts} hearts`}
          >
            <StatBadge icon="🔥" value={stats.streakDays} label="Day streak" />
            <StatBadge icon="💎" value={stats.wallet.gems} label="Gems" />
            <StatBadge icon="❤️" value={stats.hearts} label="Hearts" />
          </View>
        </View>

        {/* Unit info */}
        <View
          className="flex-row items-center justify-between"
          accessibilityRole="header"
          accessibilityLabel={`${unit.title}: ${unit.description}`}
        >
          <View className="flex-1">
            <Text className="text-2xl font-extrabold text-white">
              {unit.title}
            </Text>
            <Text className="text-base text-white/80 mt-1">
              {unit.description}
            </Text>
          </View>
          <View
            className="h-10 w-10 rounded-lg items-center justify-center ml-3"
            style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
            accessibilityRole="button"
            accessibilityLabel="Unit guidebook"
          >
            <Text className="text-lg" importantForAccessibility="no">
              📋
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

export default React.memo(JourneyHeader);
