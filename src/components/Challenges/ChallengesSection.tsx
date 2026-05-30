import React, { useState } from "react";
import {
  View,
  Text,
  LayoutAnimation,
  UIManager,
  Platform,
} from "react-native";
import { SkeletonCard } from "@/src/components/ui/Skeleton";
import { PressableScale } from "@/src/components/ui/PressableScale";
import { Card } from "@/src/components/ui/Card";

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}
import { router } from "expo-router";
import { useChallenges } from "@/hooks/data/useChallenges";
import { ChallengeCard } from "./ChallengeCard";
import { SAGE } from "@/lib/tokens";

interface ChallengesSectionProps {
  maxItems?: number;
  showDepth?: boolean;
}

/**
 * Minimalist challenges section for home screen
 */
export const ChallengesSection: React.FC<ChallengesSectionProps> = ({
  maxItems = 3,
  showDepth = true,
}) => {
  const { dailyChallenges, weeklyChallenges, isLoading } = useChallenges();
  const [expanded, setExpanded] = useState<boolean>(true);

  const handleViewAll = (): void => {
    router.push("/tabs/screens/challenges");
  };

  const handleToggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  const displayChallenges = [...dailyChallenges, ...weeklyChallenges].slice(
    0,
    maxItems,
  );

  const completedCount = displayChallenges.filter((c) => c.completed).length;
  const totalCount = displayChallenges.length;

  if (isLoading) {
    return <SkeletonCard lines={3} className="min-h-[132px]" />;
  }

  if (displayChallenges.length === 0) {
    return null;
  }

  return (
    <View className="mb-2">
      {/* Header */}
      <View className="mb-3 min-h-[44px] flex-row items-center justify-between px-1">
        <PressableScale
          onPress={handleToggleExpand}
          className="min-h-[44px] flex-1 flex-row items-center"
          scale={0.97}
          hapticStyle="light"
          accessibilityRole="button"
          accessibilityState={{ expanded }}
          accessibilityLabel="Toggle challenges list"
        >
          <View className="flex-row items-center gap-2">
            <Text className="happy-brand-eyebrow text-[11px]">
              Daily Challenges
            </Text>
            <Text className="happy-font-body-bold text-[11px] uppercase tracking-wider text-ink-muted">
              {completedCount} OF {totalCount}
            </Text>
          </View>
        </PressableScale>

        <PressableScale
          onPress={handleViewAll}
          scale={0.94}
          hapticStyle="light"
          className="min-h-[44px] items-center justify-center px-2"
          accessibilityRole="button"
          accessibilityHint="Opens the full challenges screen"
        >
          <Text className="happy-font-body-bold text-[13px] text-ink-muted">
            See all
          </Text>
        </PressableScale>
      </View>

      {expanded && (
        <Card
          variant="tile"
          radius="xl"
          haptic="none"
          showDepth={showDepth}
          contentClassName="px-4 py-3"
        >
          {displayChallenges.map((challenge, i) => (
            <View
              key={challenge.id}
              className={
                i < displayChallenges.length - 1
                  ? "border-b border-sage-100 py-3"
                  : "py-3"
              }
            >
              <ChallengeCard challenge={challenge} compact />
            </View>
          ))}
        </Card>
      )}
    </View>
  );
};
