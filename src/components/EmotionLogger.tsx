import React, { useEffect, useCallback, useState } from "react";
import { View } from "react-native";
import { Text } from "@/src/components/ui/Text";
import { MoodIcon, type MoodKey } from "@/src/components/MoodIcon";
import { useEmotionLogger } from "@/hooks/data/useEmotionLogger";
import { useXPOptional } from "../context/XPContext";
import { XPActionType } from "../types/xp";
import { useRewardsContext } from "../context/RewardsContext";
import { useChallengesOptional } from "../context/ChallengesContext";
import { PressableScale } from "@/src/components/ui/PressableScale";
import { SEMANTIC_COLORS } from "@/src/theme/colors";
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
  isSelected: boolean;
  onPress: () => void;
  isLoading: boolean;
}> = ({ emotion, isSelected, onPress, isLoading }) => {
  const handlePress = () => {
    if (!isLoading) {
      onPress();
    }
  };

  return (
    // ponytail: whole mood column tappable with restrained selection ring
    <PressableScale
      onPress={handlePress}
      disabled={isLoading}
      scale={0.93}
      hapticStyle="light"
      accessibilityRole="button"
      accessibilityLabel={`Log ${emotion.name} mood`}
      accessibilityState={{ selected: isSelected }}
      className="flex-1 items-center justify-center min-h-[56px] py-1"
    >
      <View
        className={`w-[46px] h-[46px] rounded-full items-center justify-center ${
          isSelected
            ? "border-2 border-brand-primary bg-brand-surface"
            : "border-2 border-transparent"
        }`}
      >
        <MoodIcon mood={emotion.moodKey} size={36} />
      </View>
      <Text
        variant="chip"
        className={`mt-1.5 text-[12px] ${
          isSelected ? "font-bold text-brand-primary" : "font-semibold text-ink-soft"
        }`}
        style={isSelected ? { color: SEMANTIC_COLORS.brand.primary as string } : undefined}
      >
        {emotion.name}
      </Text>
    </PressableScale>
  );
};

// Memoize EmotionItem to prevent unnecessary re-renders
const MemoizedEmotionItem = React.memo(EmotionItem);

export const EmotionLogger: React.FC<EmotionLoggerProps> = React.memo(
  ({ selectedDate = new Date(), onEmotionLogged, showDepth = true }) => {
    const {
      logEmotion: logEmotionToSupabase,
      isLoggingEmotion,
    } = useEmotionLogger(selectedDate);
    const xp = useXPOptional();
    const { earnCoinsForAction } = useRewardsContext();
    const challenges = useChallengesOptional();
    const [selectedMoodId, setSelectedMoodId] = useState<number | null>(null);

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
