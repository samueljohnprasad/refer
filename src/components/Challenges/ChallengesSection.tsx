import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, LayoutAnimation, UIManager, Platform } from "react-native";
import { PressableScale } from "@/src/components/ui/PressableScale";

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}
import { router } from "expo-router";
import { useChallenges } from "@/hooks/data/useChallenges";
import { ChallengeCard } from "./ChallengeCard";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Target02Icon } from "@hugeicons/core-free-icons";
import { CARD_SHADOW } from "@/constants/shadows";
import { SEMANTIC } from "@/constants/palette";
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
      withSequence(withTiming(0.6, { duration: 800 }), withTiming(0.4, { duration: 800 })),
      -1,
      true,
    );
  }, []);
  const style = useAnimatedStyle(() => ({ opacity: shimmer.value }));
  return (
    <Animated.View
      className="bg-white rounded-2xl"
      style={[style, { height: 120 }, CARD_SHADOW]}
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
      <View className="bg-white rounded-2xl p-6 items-center border border-gray-100 min-h-[120px] justify-center">
        <ActivityIndicator size="small" color="#6B7280" />
      </View>
    );
  }

  if (displayChallenges.length === 0) {
    return null;
  }

  return (
    <View className="mb-2">
      {/* Header */}
      <View className="flex-row items-center justify-between px-1 mb-3 min-h-[44px]">
        <PressableScale
          onPress={handleToggleExpand}
          className="flex-row items-center flex-1"
          scale={0.97}
          hapticStyle="light"
          accessibilityRole="button"
          accessibilityState={{ expanded }}
          accessibilityLabel="Toggle challenges list"
        >
          <View className="flex-row items-center gap-2">
            <Text className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
              Daily Challenges
            </Text>
            <Text className="text-gray-400 text-[10px] font-medium tracking-wide">
              {completedCount} OF {totalCount}
            </Text>
          </View>
        </PressableScale>

        <PressableScale
          onPress={handleViewAll}
          scale={0.94}
          hapticStyle="light"
          className="px-2 min-h-[44px] justify-center items-center"
          accessibilityRole="button"
          accessibilityHint="Opens the full challenges screen"
        >
          <Text className="text-gray-500 font-medium text-[13px]">
            See all
          </Text>
        </PressableScale>
      </View>

      {expanded && (
        <View className="bg-white rounded-3xl p-4" style={CARD_SHADOW}>
          {displayChallenges.map((challenge, i) => (
            <View 
              key={challenge.id} 
              className={i < displayChallenges.length - 1 ? "mb-3 border-b border-gray-50 pb-3" : ""}
            >
              <ChallengeCard challenge={challenge} compact />
            </View>
          ))}
        </View>
      )}
    </View>
  );
};
