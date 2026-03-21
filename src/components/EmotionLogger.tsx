import React, { useEffect, useCallback } from "react";
import { View, Pressable, Text } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  interpolate,
} from "react-native-reanimated";
import { Image } from "@/components/ui/image";
import { terrible, bad, fine, good, great } from "@/assets/emojis";
import { useEmotionLogger } from "@/hooks/data/useEmotionLogger";
import { useDailyStreak } from "@/hooks/data/useDailyStreak";
import { useRevenueCat } from "../context/RevenueCatProvider";
import { useXPOptional } from "../context/XPContext";
import { XPActionType, XP_REWARDS } from "../types/xp";
import { XPBadge } from "./XP";
import { useRewardsContext } from "../context/RewardsContext";
import { useChallengesOptional } from "../context/ChallengesContext";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { SmileIcon } from "@hugeicons/core-free-icons";

// Subtle shadow constant matching other cards
const LOG_SHADOW = {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.05,
  shadowRadius: 10,
  elevation: 2,
};

// Emotion configuration
const EMOTIONS = [
  {
    id: 1,
    name: "Terrible",
    emoji: terrible,
    color: "#FF6B6B",
    bgColor: "#FFE5E5",
  },
  { id: 2, name: "Bad", emoji: bad, color: "#FFA94D", bgColor: "#FFF3E5" },
  { id: 3, name: "Okay", emoji: fine, color: "#FFD43B", bgColor: "#FFF9E5" },
  { id: 4, name: "Good", emoji: good, color: "#69DB7C", bgColor: "#E5F9E5" },
  { id: 5, name: "Great", emoji: great, color: "#74C0FC", bgColor: "#E5F3FF" },
] as const;

interface EmotionLoggerProps {
  selectedDate?: Date;
  onEmotionLogged?: (emotionScore: number, updated: boolean) => void;
}

const EmotionItem: React.FC<{
  emotion: (typeof EMOTIONS)[number];
  count: number;
  onPress: () => void;
  isLoading: boolean;
}> = ({ emotion, count, onPress, isLoading }) => {
  const scale = useSharedValue(1);
  const countScale = useSharedValue(1);

  // Animate count changes
  useEffect(() => {
    if (count > 0) {
      countScale.value = withSequence(
        withSpring(1.2, { damping: 8, stiffness: 200 }),
        withSpring(1, { damping: 10, stiffness: 150 }),
      );
    }
  }, [count]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const animatedCountStyle = useAnimatedStyle(() => ({
    transform: [{ scale: countScale.value }],
    opacity: interpolate(countScale.value, [1, 1.2], [0.9, 1]),
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 10, stiffness: 200 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 10, stiffness: 200 });
  };

  const handlePress = () => {
    if (!isLoading) {
      // Trigger animation
      scale.value = withSequence(
        withSpring(1.15, { damping: 8, stiffness: 180 }),
        withSpring(1, { damping: 10, stiffness: 150 }),
      );
      onPress();
    }
  };

  return (
    <View className="flex-1 items-center">
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={isLoading}
        className="items-center"
        accessibilityRole="button"
        accessibilityLabel={`Log ${emotion.name} mood`}
        accessibilityHint="Records this mood for your daily tracking"
      >
        <Animated.View style={animatedStyle}>
          <View
            className="items-center justify-center rounded-2xl p-2 bg-gray-50/50"
          >
            <Image
              source={emotion.emoji}
              alt={emotion.name}
              className="w-11 h-11"
              width={44}
              height={44}
            />
            {count > 0 && (
              <Animated.View
                className="absolute -top-1 -right-1 bg-gray-800 rounded-full min-w-[18px] h-[18px] items-center justify-center px-1 border-2 border-white"
                style={animatedCountStyle}
              >
                <Text className="text-white text-[9px] font-bold">
                  {count > 99 ? "99+" : count}
                </Text>
              </Animated.View>
            )}
          </View>
        </Animated.View>
      </Pressable>
      <Text className="text-xs font-medium text-gray-700 mt-1.5">
        {emotion.name}
      </Text>
    </View>
  );
};

// Memoize EmotionItem to prevent unnecessary re-renders
const MemoizedEmotionItem = React.memo(EmotionItem);

export const EmotionLogger: React.FC<EmotionLoggerProps> = React.memo(
  ({ selectedDate = new Date(), onEmotionLogged }) => {
    const {
      emotionCounts,
      isLoading,
      logEmotion: logEmotionToSupabase,
      isLoggingEmotion,
    } = useEmotionLogger(selectedDate);
    const { presentPaywall, hasPro } = useRevenueCat();
    const xp = useXPOptional();
    const { earnCoinsForAction } = useRewardsContext();
    const challenges = useChallengesOptional();

    const totalEmotions = Array.from(emotionCounts.values()).reduce(
      (acc, count) => acc + count,
      0,
    );

    // Calculate average mood (weighted by emotion scores: 1-5)
    const averageMood = React.useMemo(() => {
      if (totalEmotions === 0) return null;

      let weightedSum = 0;
      emotionCounts.forEach((count, emotionId) => {
        weightedSum += emotionId * count;
      });

      return (weightedSum / totalEmotions).toFixed(1);
    }, [emotionCounts, totalEmotions]);

    // Get mood label based on average
    const getMoodLabel = (avg: string | null) => {
      if (!avg) return null;
      const avgNum = parseFloat(avg);
      if (avgNum <= 1.5) return { text: "Terrible", color: "#FF6B6B" };
      if (avgNum <= 2.5) return { text: "Bad", color: "#FFA94D" };
      if (avgNum <= 3.5) return { text: "Okay", color: "#FFD43B" };
      if (avgNum <= 4.5) return { text: "Good", color: "#69DB7C" };
      return { text: "Great", color: "#74C0FC" };
    };

    const moodLabel = getMoodLabel(averageMood);

    // Memoize the callback to prevent recreation on every render
    const handleLogEmotion = useCallback(
      async (emotionScore: number): Promise<void> => {
        if (isLoggingEmotion) return;

        try {
          await logEmotionToSupabase(emotionScore, (updated) => {
            // Find emotion name
            const emotion = EMOTIONS.find((e) => e.id === emotionScore);
            const emotionName = emotion ? emotion.name : "Mood";

            // Award XP for mood logging
            xp?.awardXP(XPActionType.MOOD_LOG, {
              customDescription: `Mood logged: ${emotionName}`,
            });
            // Earn coins for mood log
            earnCoinsForAction("MOOD_LOG");
            // Update mood challenge
            challenges?.updateProgress("mood_count");
            onEmotionLogged?.(emotionScore, updated);
          });
        } catch (error) {}
      },
      [isLoggingEmotion, logEmotionToSupabase, onEmotionLogged],
    );
    return (
      <View className="gap-2">
        <View className="flex-row items-center justify-between px-1">
          <Text className="text-xs text-gray-400 font-semibold uppercase tracking-widest">
            Daily Mood Log
          </Text>
          <XPBadge amount={XP_REWARDS[XPActionType.MOOD_LOG]} />
        </View>

        <View className="bg-white rounded-2xl p-4 border border-gray-100">
          {averageMood && moodLabel && (
            <View className="flex-row justify-end mb-3">
              <View className="flex-row items-center gap-1">
                <Text
                  className="text-xs font-semibold"
                  style={{ color: moodLabel.color }}
                >
                  {moodLabel.text}
                </Text>
                <Text className="text-xs text-gray-400">•</Text>
                <Text
                  className="text-xs font-bold"
                  style={{ color: moodLabel.color }}
                >
                  {averageMood}
                </Text>
              </View>
            </View>
          )}

          <View className="flex-row justify-between">
          {EMOTIONS.map((emotion) => (
            <MemoizedEmotionItem
              key={emotion.id}
              emotion={emotion}
              count={emotionCounts.get(emotion.id) || 0}
              onPress={() => {
                // if (totalEmotions >= 5 && !hasPro) {
                //   presentPaywall();
                //   return;
                // }
                handleLogEmotion(emotion.id);
              }}
              isLoading={isLoggingEmotion}
            />
          ))}
          </View>
        </View>
      </View>
    );
  },
);

export default EmotionLogger;
