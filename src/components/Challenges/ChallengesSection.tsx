import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  LayoutAnimation,
  UIManager,
  Platform,
} from "react-native";
import { PressableScale } from "@/src/components/ui/PressableScale";

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}
import { router } from "expo-router";
import { useChallenges } from "@/hooks/data/useChallenges";
import { ChallengeCard } from "./ChallengeCard";
import { SAGE } from "@/lib/tokens";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

interface ChallengesSectionProps {
  maxItems?: number;
}

/** Shimmer skeleton matching the challenges card shape */
const ChallengesShimmer: React.FC = () => {
  const shimmer = useSharedValue(0.4);
  useEffect(() => {
    shimmer.value = withRepeat(
      withSequence(
        withTiming(0.6, { duration: 800 }),
        withTiming(0.4, { duration: 800 }),
      ),
      -1,
      true,
    );
  }, [shimmer]);
  const style = useAnimatedStyle(() => ({ opacity: shimmer.value }));
  return (
    <Animated.View
      className="happy-brand-preview-tile rounded-[30px]"
      style={[style, { height: 132 }]}
    />
  );
};

/**
 * Minimalist challenges section for home screen
 */
export const ChallengesSection: React.FC<ChallengesSectionProps> = ({
  maxItems = 3,
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
    return (
      <View className="happy-brand-preview-tile min-h-[132px] items-center justify-center rounded-[30px] p-6">
        <ActivityIndicator size="small" color={SAGE[600]} />
      </View>
    );
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
        <View className="happy-brand-preview-tile rounded-[30px] px-4 py-3">
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
        </View>
      )}
    </View>
  );
};
