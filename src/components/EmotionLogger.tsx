import React, { useEffect, useCallback } from "react";
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
import { Image } from "@/components/ui/image";
import { terrible, bad, fine, good, great } from "@/assets/emojis";
import { useEmotionLogger } from "@/hooks/data/useEmotionLogger";
import { useXPOptional } from "../context/XPContext";
import { XPActionType } from "../types/xp";
import { useRewardsContext } from "../context/RewardsContext";
import { useChallengesOptional } from "../context/ChallengesContext";
import { Card } from "@/src/components/ui/Card";
import { PressableScale } from "@/src/components/ui/PressableScale";
import { SAGE } from "@/lib/tokens";
import { createLogger } from "@/src/lib/logger";

const logger = createLogger("emotion-logger");

const EMOTIONS = [
  { id: 1, name: "Terrible", emoji: terrible },
  { id: 2, name: "Bad", emoji: bad },
  { id: 3, name: "Okay", emoji: fine },
  { id: 4, name: "Good", emoji: good },
  { id: 5, name: "Great", emoji: great },
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
              ["transparent", SAGE.selected],
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
      <Text variant="chip" color="soft" className="mt-1 text-[12px]">
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
        <View className="flex-row items-center justify-between px-1 mb-2">
          <Text className="happy-font-body-bold text-[15px] text-ink-soft">Daily mood log</Text>
        </View>

        <Card
          variant="tile"
          radius="lg"
          haptic="none"
          showDepth={showDepth}
          contentClassName="p-4"
        >
          <View className="flex-row justify-between px-2 pt-1 pb-1">
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
        </Card>
      </View>
    );
  },
);

export default EmotionLogger;
