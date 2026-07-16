import React from "react";
import { View, Text } from "react-native";
import { useUserLevel } from "@/hooks/data/useUserLevel";
import { LevelBadge } from "./LevelBadge";
import { Card } from "@/src/components/ui/Card";
import StageProgressBar from "@/src/components/ui/StageProgressBar";

interface LevelProgressBarProps {
  showBadge?: boolean;
  compact?: boolean;
  flat?: boolean;
}

/**
 * Visual progress bar showing XP toward next level
 * Displays current level, XP progress, and next level info
 */
export const LevelProgressBar: React.FC<LevelProgressBarProps> = ({
  showBadge = true,
  compact = false,
  flat = false,
}) => {
  const {
    currentLevel,
    nextLevel,
    progress,
    currentXP,
    requiredXP,
    isMaxLevel,
    totalXP,
  } = useUserLevel();

  if (compact) {
    return (
      <View className="flex-row items-center gap-2">
        {showBadge && <LevelBadge level={currentLevel} size="sm" />}
        <StageProgressBar
          progress={progress}
          height={8}
          className="flex-1"
        />
        <Text className="happy-font-body-medium text-xs text-gray-800">
          {isMaxLevel ? "MAX" : `${progress}%`}
        </Text>
      </View>
    );
  }

  const content = (
    <>
      <View className="flex-row items-center justify-between mb-4">
        {showBadge && <LevelBadge level={currentLevel} size="md" />}
        <View className="flex-row items-baseline gap-1.5">
          <Text className="happy-font-body-bold text-3xl text-ink">
            {totalXP}
          </Text>
          <Text className="happy-font-body-medium text-sm text-ink-muted">
            Insights total
          </Text>
        </View>
      </View>

      {/* Progress Bar */}
      <StageProgressBar
        progress={progress}
        height={12}
        className="mb-2"
      />

      {/* Progress Text */}
      <View className="flex-row justify-between">
        <Text className="happy-font-body-medium text-xs text-gray-800">
          {isMaxLevel
            ? "Max level reached!"
            : `${currentXP} / ${requiredXP} Insights`}
        </Text>
        {nextLevel && (
          <Text className="happy-font-body-medium text-xs text-gray-800">
            Next: {nextLevel.name}
          </Text>
        )}
      </View>
    </>
  );

  if (flat) {
    return <View className="py-2">{content}</View>;
  }

  return (
    <Card
      variant="tile"
      radius="lg"
      showDepth={false}
      contentClassName="p-4"
    >
      {content}
    </Card>
  );
};
