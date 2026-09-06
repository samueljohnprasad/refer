import React, { useEffect, useCallback } from "react";
import { View } from "react-native";
import { Text } from "@/src/components/ui/Text";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  interpolate,
} from "react-native-reanimated";
import { MoodIcon, type MoodKey } from "@/src/components/MoodIcon";
import { useEmotionLogger } from "@/hooks/data/useEmotionLogger";
import { useXPOptional } from "../context/XPContext";
import { XPActionType } from "../types/xp";
import { useRewardsContext } from "../context/RewardsContext";
import { useChallengesOptional } from "../context/ChallengesContext";
import { PressableScale } from "@/src/components/ui/PressableScale";
import { createLogger } from "@/src/lib/logger";

const logger = createLogger("emotion-logger");

const EMOTIONS = [
  { id: 1, name: "Terrible", moodKey: "terrible" as MoodKey },
  { id: 2, name: "Bad", moodKey: "bad" as MoodKey },
  { id: 3, name: "Okay", moodKey: "okay" as MoodKey },
  { id: 4, name: "Good", moodKey: "good" as MoodKey },
  { id: 5, name: "Great", moodKey: "great" as MoodKey },
] as const;

interface EmotionLoggerProps {
  selectedDate?: Date;
  onEmotionLogged?: (emotionScore: number, updated: boolean) => void;
  showDepth?: boolean;
}

const EmotionItem: React.FC<{
  emotion: (typeof EMOTIONS)[number];
  count: number;
  onPress: () => void;
  isLoading: boolean;
}> = ({ emotion, count, onPress, isLoading }) => {
  const countScale = useSharedValue(1);

  // Animate count changes
  useEffect(() => {
    if (count > 0) {
      countScale.value = withSequence(
        withSpring(1.2, { damping: 20, stiffness: 100, overshootClamping: true }),
        withSpring(1, { damping: 20, stiffness: 100, overshootClamping: true }),
      );
    }
  }, [count, countScale]);

  const animatedCountStyle = useAnimatedStyle(() => ({
    transform: [{ scale: countScale.value }],
    opacity: interpolate(countScale.value, [1, 1.2], [0.95, 1]),
  }));

  const handlePress = () => {
    if (!isLoading) {
      onPress();
    }
  };

  return (
    // ponytail: clean emoji without circle border and showing count badge like previous
    <PressableScale
      onPress={handlePress}
      disabled={isLoading}
      scale={0.93}
      hapticStyle="light"
      accessibilityRole="button"
      accessibilityLabel={`Log ${emotion.name} mood${count > 0 ? `, logged ${count} times` : ""}`}
      className="flex-1 items-center justify-center min-h-[56px] py-1"
    >
      <View className="relative items-center justify-center">
        <MoodIcon mood={emotion.moodKey} size={38} />
        {count > 0 && (
          <Animated.View
            className="absolute -right-[4px] -top-[4px] h-[18px] min-w-[18px] items-center justify-center rounded-full border-[1.5px] border-brand-surface bg-sage-pill px-1"
            style={animatedCountStyle}
          >
            <Text variant="chip" color="sage" className="z-10 text-[10px]">
              {count > 99 ? "99+" : count}
            </Text>
          </Animated.View>
        )}
      </View>
      <Text
        variant="chip"
        className="mt-1.5 text-[12px] font-semibold text-ink-soft"
      >
        {emotion.name}
      </Text>
    </PressableScale>
  );
};

// Memoize EmotionItem to prevent unnecessary re-renders
const MemoizedEmotionItem = React.memo(EmotionItem);

export const EmotionLogger: React.FC<EmotionLoggerProps> = React.memo(
  ({ selectedDate = new Date(), onEmotionLogged }) => {
    const {
      emotionCounts,
      logEmotion: logEmotionToSupabase,
      isLoggingEmotion,
    } = useEmotionLogger(selectedDate);
    const xp = useXPOptional();
    const { earnCoinsForAction } = useRewardsContext();
    const challenges = useChallengesOptional();

    // Memoize the callback to prevent recreation on every render
    const handleLogEmotion = useCallback(
      async (emotionScore: number): Promise<void> => {
        if (isLoggingEmotion) return;

        try {
          await logEmotionToSupabase(emotionScore, (updated) => {
            // Find emotion name
            const emotion = EMOTIONS.find((e) => e.id === emotionScore);
            const emotionName = emotion ? emotion.name : "Mood";

            // ponytail: award XP & coins only on first mood check of the day to prevent farming
            const totalLoggedToday = Array.from(emotionCounts.values()).reduce(
              (sum, c) => sum + c,
              0,
            );
            if (totalLoggedToday === 0) {
              xp?.awardXP(XPActionType.MOOD_LOG, {
                customDescription: `Mood logged: ${emotionName}`,
              });
              earnCoinsForAction("MOOD_LOG");
            }
            // Update mood challenge
            challenges?.updateProgress("mood_count");
            onEmotionLogged?.(emotionScore, updated);
          });
        } catch (error) {
          logger.error("Failed to log mood", error);
        }
      },
      [
        challenges,
        earnCoinsForAction,
        emotionCounts,
        isLoggingEmotion,
        logEmotionToSupabase,
        onEmotionLogged,
        xp,
      ],
    );
    return (
      <View className="gap-2">
        <View className="flex-row items-center justify-between px-1 mb-1">
          <Text className="happy-font-body-bold text-[15px] text-ink-soft">How are you feeling?</Text>
        </View>

        {/* ponytail: remove outer card and use whitespace grouping for mood */}
        <View className="flex-row justify-between px-1 py-1">
          {EMOTIONS.map((emotion) => (
            <MemoizedEmotionItem
              key={emotion.id}
              emotion={emotion}
              count={emotionCounts.get(emotion.id) || 0}
              onPress={() => {
                handleLogEmotion(emotion.id);
              }}
              isLoading={isLoggingEmotion}
            />
          ))}
        </View>
      </View>
    );
  },
);

export default EmotionLogger;
