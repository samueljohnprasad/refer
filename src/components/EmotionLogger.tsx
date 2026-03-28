import React, { useEffect, useCallback } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  interpolate,
  interpolateColor,
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
import { MOOD } from "@/constants/palette";
import { CARD_SHADOW } from "@/constants/shadows";
import { PressableScale } from "@/src/components/ui/PressableScale";

// Emotion configuration — uses shared MOOD palette
const EMOTIONS = [
  {
    id: 1,
    name: "Terrible",
    emoji: terrible,
    color: MOOD.terrible.color,
    bgColor: MOOD.terrible.bg,
  },
  { id: 2, name: "Bad", emoji: bad, color: MOOD.bad.color, bgColor: MOOD.bad.bg },
  { id: 3, name: "Okay", emoji: fine, color: MOOD.okay.color, bgColor: MOOD.okay.bg },
  { id: 4, name: "Good", emoji: good, color: MOOD.good.color, bgColor: MOOD.good.bg },
  { id: 5, name: "Great", emoji: great, color: MOOD.great.color, bgColor: MOOD.great.bg },
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
  const countScale = useSharedValue(1);
  const highlightProgress = useSharedValue(0);

  // Animate count changes
  useEffect(() => {
    if (count > 0) {
      countScale.value = withSequence(
        withSpring(1.2, { damping: 12, stiffness: 200 }),
        withSpring(1, { damping: 14, stiffness: 150 }),
      );
    }
  }, [count]);

  const animatedCountStyle = useAnimatedStyle(() => ({
    transform: [{ scale: countScale.value }],
    opacity: interpolate(countScale.value, [1, 1.2], [0.95, 1]),
  }));

  const handlePress = () => {
    if (!isLoading) {
      // Brief color highlight
      highlightProgress.value = withSequence(
        withTiming(1, { duration: 150 }),
        withTiming(0, { duration: 600 }),
      );
      onPress();
    }
  };

  return (
    <View className="flex-1 items-center">
      <PressableScale
        onPress={handlePress}
        disabled={isLoading}
        scale={0.9}
        hapticStyle="light"
        accessibilityRole="button"
        accessibilityLabel={`Log ${emotion.name} mood`}
        accessibilityHint="Records this mood for today"
        className="items-center min-w-[48px] min-h-[48px] justify-center"
      >
        <Animated.View
          className="items-center justify-center rounded-2xl p-2.5"
          style={useAnimatedStyle(() => ({
            backgroundColor: interpolateColor(
              highlightProgress.value,
              [0, 1],
              ['transparent', emotion.bgColor],
            ),
          }))}
        >
          <Image
            source={emotion.emoji}
            alt={emotion.name}
            className="w-10 h-10"
            resizeMode="contain"
          />
          {count > 0 && (
            <Animated.View
              className="absolute -top-[2px] -right-[2px] bg-gray-100 rounded-full min-w-[18px] h-[18px] items-center justify-center px-1 border-[1.5px] border-white shadow-sm"
              style={animatedCountStyle}
            >
              <Text className="text-gray-500 text-[10px] font-black z-10">
                {count > 99 ? "99+" : count}
              </Text>
            </Animated.View>
          )}
        </Animated.View>
      </PressableScale>
      <Text className="text-[11px] font-semibold text-gray-500 mt-1">
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
      for (const [emotionId, count] of emotionCounts.entries()) {
        weightedSum += emotionId * count;
      }
      return (weightedSum / totalEmotions).toFixed(1);
    }, [emotionCounts, totalEmotions]);

    // Get mood label based on average
    const getMoodLabel = (avg: string | null) => {
      if (!avg) return null;
      const avgNum = parseFloat(avg);
      if (avgNum <= 1.5) return { text: "Terrible", color: MOOD.terrible.color };
      if (avgNum <= 2.5) return { text: "Bad", color: MOOD.bad.color };
      if (avgNum <= 3.5) return { text: "Okay", color: MOOD.okay.color };
      if (avgNum <= 4.5) return { text: "Good", color: MOOD.good.color };
      return { text: "Great", color: MOOD.great.color };
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
        } catch (error) { }
      },
      [isLoggingEmotion, logEmotionToSupabase, onEmotionLogged],
    );
    return (
      <View className="gap-2">
        <View className="flex-row items-center justify-between px-1 mb-2">
          <Text className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
            Daily Mood Log
          </Text>
        </View>

        <View className="bg-white rounded-2xl p-4" style={CARD_SHADOW}>
          <View className="flex-row justify-between px-2 pt-1 pb-1">
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
