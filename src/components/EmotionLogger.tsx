import React, { useEffect, useCallback, useState } from "react";
import { View } from "react-native";
import { Text } from "@/src/components/ui/Text";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  interpolate,
  interpolateColor,
} from "react-native-reanimated";
import { MoodIcon, type MoodKey } from "@/src/components/MoodIcon";
import { useEmotionLogger } from "@/hooks/data/useEmotionLogger";
import { useXPOptional } from "../context/XPContext";
import { XPActionType } from "../types/xp";
import { useRewardsContext } from "../context/RewardsContext";
import { useChallengesOptional } from "../context/ChallengesContext";
import { PressableScale } from "@/src/components/ui/PressableScale";
import { SEMANTIC_COLORS } from "@/src/theme/colors";
import { RADIUS } from "@/src/theme/radius";
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
  isSelected: boolean;
  onPress: () => void;
  isLoading: boolean;
}> = ({ emotion, count, isSelected, onPress, isLoading }) => {
  const countScale = useSharedValue(1);
  const highlightProgress = useSharedValue(0);

  // Animate count changes
  useEffect(() => {
    if (count > 0) {
      countScale.value = withSequence(
        withSpring(1.2, { damping: 20, stiffness: 100, overshootClamping: true }),
        withSpring(1, { damping: 20, stiffness: 100, overshootClamping: true }),
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
              ["transparent", SEMANTIC_COLORS.selection.surface],
            ),
          }))}
        >
          <MoodIcon mood={emotion.moodKey} isSelected={isSelected} size={38} />
          {count > 0 && (
            <Animated.View
              className="absolute -right-[2px] -top-[2px] h-[18px] min-w-[18px] items-center justify-center rounded-full border-[1.5px] border-brand-surface bg-sage-pill px-1"
              style={animatedCountStyle}
            >
              <Text variant="chip" color="sage" className="z-10 text-[10px]">
                {count > 99 ? "99+" : count}
              </Text>
            </Animated.View>
          )}
        </Animated.View>
      </PressableScale>
      <Text
        variant="chip"
        className={`mt-1.5 text-[12px] font-semibold ${
          isSelected ? "text-brand-primary" : "text-ink-soft"
        }`}
        style={{
          color: isSelected
            ? SEMANTIC_COLORS.brand.primary
            : SEMANTIC_COLORS.text.tertiary,
        }}
      >
        {emotion.name}
      </Text>
    </View>
  );
};

// Memoize EmotionItem to prevent unnecessary re-renders
const MemoizedEmotionItem = React.memo(EmotionItem);

export const EmotionLogger: React.FC<EmotionLoggerProps> = React.memo(
  ({ selectedDate = new Date(), onEmotionLogged, showDepth = true }) => {
    const {
      emotionCounts,
      logEmotion: logEmotionToSupabase,
      isLoggingEmotion,
    } = useEmotionLogger(selectedDate);
    const xp = useXPOptional();
    const { earnCoinsForAction } = useRewardsContext();
    const challenges = useChallengesOptional();

    // ponytail: vector mood icon with active selection feedback
    const [selectedMoodId, setSelectedMoodId] = useState<number | null>(null);

    // Initial check: if emotionCounts has any entry > 0, set selectedMoodId to that emotion id if selectedMoodId === null
    useEffect(() => {
      if (selectedMoodId === null && emotionCounts.size > 0) {
        for (const [id, count] of emotionCounts.entries()) {
          if (count > 0) {
            setSelectedMoodId(id);
            break;
          }
        }
      }
    }, [emotionCounts, selectedMoodId]);

    // Memoize the callback to prevent recreation on every render
    const handleLogEmotion = useCallback(
      async (emotionScore: number): Promise<void> => {
        if (isLoggingEmotion) return;
        setSelectedMoodId(emotionScore);

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
        } catch (error) {
          logger.error("Failed to log mood", error);
        }
      },
      [
        challenges,
        earnCoinsForAction,
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
              isSelected={selectedMoodId === emotion.id}
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
