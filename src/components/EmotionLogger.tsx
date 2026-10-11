import React, { useEffect, useCallback } from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
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
  { id: 1, name: "Terrible", moodKey: "terrible" as MoodKey, i18nKey: "moods.terrible" as const },
  { id: 2, name: "Bad", moodKey: "bad" as MoodKey, i18nKey: "moods.bad" as const },
  { id: 3, name: "Okay", moodKey: "okay" as MoodKey, i18nKey: "moods.okay" as const },
  { id: 4, name: "Good", moodKey: "good" as MoodKey, i18nKey: "moods.good" as const },
  { id: 5, name: "Great", moodKey: "great" as MoodKey, i18nKey: "moods.great" as const },
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
  const { t } = useTranslation("home");
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

  const moodName: string = t(emotion.i18nKey);

  return (
    // ponytail: keep the mood family visible without turning it into a card
    <PressableScale
      onPress={handlePress}
      disabled={isLoading}
      scale={0.93}
      hapticStyle="light"
      accessibilityRole="button"
      accessibilityLabel={t("moods.accessibilityLog", {
        mood: moodName,
        loggedCount:
          count > 0 ? `, ${t("moods.accessibilityCount", { count })}` : "",
      })}
      className="min-h-[66px] w-[54px] flex-none items-center justify-center py-1"
    >
      <View className="relative items-center justify-center">
        <MoodIcon mood={emotion.moodKey} size={40} />
        {count > 0 && (
          <Animated.View
            className="absolute -right-[4px] -top-[4px] h-[18px] min-w-[18px] items-center justify-center rounded-full border-[1.5px] border-brand-surface bg-sage-100 px-1"
            style={animatedCountStyle}
          >
            <Text className="happy-font-body-bold z-10 text-[10px] font-bold text-sage-700">
              {count > 99 ? "99+" : count}
            </Text>
          </Animated.View>
        )}
      </View>
      <Text
        className="happy-font-body-bold mt-1.5 text-[13px] font-bold text-sage-600"
      >
        {moodName}
      </Text>
    </PressableScale>
  );
};

// Memoize EmotionItem to prevent unnecessary re-renders
const MemoizedEmotionItem = React.memo(EmotionItem);

export const EmotionLogger: React.FC<EmotionLoggerProps> = React.memo(
  ({ selectedDate = new Date(), onEmotionLogged }) => {
    const { t } = useTranslation("home");
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
        <View className="flex-row items-center justify-between px-1 mb-0.5">
          <Text className="happy-font-body-bold text-[12px] font-bold tracking-[1px] text-sage-700 uppercase">
            {t("sections.howAreYouFeeling")}
          </Text>
        </View>

        {/* ponytail: mood choices sit directly on the canvas, like the exploration layout */}
        <View className="flex-row justify-between px-0 pt-3">
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
