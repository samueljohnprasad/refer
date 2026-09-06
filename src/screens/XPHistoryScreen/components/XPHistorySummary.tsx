import React from "react";
import { Text, View } from "react-native";
import { useUserLevel } from "@/hooks/data/useUserLevel";
import { LevelBadge } from "@/src/components/Level/LevelBadge";
import StageProgressBar from "@/src/components/ui/StageProgressBar";
import { APP_FONT_FAMILIES } from "@/src/theme/typography";

interface XPHistorySummaryProps {
  totalXP: number;
  todayXP: number;
}

// ponytail: progression hero per audit items 1-14: clear level progress + lifetime subtitle
export const XPHistorySummary: React.FC<XPHistorySummaryProps> = React.memo(
  ({ totalXP }) => {
    const {
      currentLevel,
      nextLevel,
      progress,
      currentXP,
      requiredXP,
      isMaxLevel,
    } = useUserLevel();

    return (
      <View className="px-5 pt-1 pb-3">
        {/* 1. Section Header */}
        <Text
          style={{
            fontFamily: APP_FONT_FAMILIES.semiBold,
            color: "#8E8E93",
            fontSize: 11,
            letterSpacing: 0.5,
            textTransform: "uppercase",
            marginBottom: 8,
          }}
        >
          Current Level
        </Text>

        {/* 2. Brand-colored Level Badge Pill */}
        <View className="mb-3 self-start">
          <LevelBadge level={currentLevel} size="md" />
        </View>

        {/* 3. Progress Sentence: single clear sentence */}
        <Text
          style={{
            fontFamily: APP_FONT_FAMILIES.semiBold,
            color: "#1C1C1E",
            fontSize: 14,
            marginBottom: 8,
          }}
        >
          {isMaxLevel
            ? "Max level reached"
            : `${currentXP} / ${requiredXP} Insights to ${nextLevel?.name || "Next Level"}`}
        </Text>

        {/* 4. Deliberate Level Progress Track */}
        <StageProgressBar
          progress={progress}
          height={10}
          fillColor="#5F7F58"
          trackColor="rgba(95, 127, 88, 0.15)"
          showGlow={false}
          className="mb-2"
        />

        {/* 5. Lifetime Insights: secondary supporting metadata */}
        <Text
          style={{
            fontFamily: APP_FONT_FAMILIES.regular,
            color: "#8E8E93",
            fontSize: 12,
          }}
        >
          {totalXP} lifetime Insights
        </Text>
      </View>
    );
  }
);

XPHistorySummary.displayName = "XPHistorySummary";

