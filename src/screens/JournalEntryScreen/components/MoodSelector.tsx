import React from "react";
import { View, TouchableOpacity, Image } from "react-native";
import { Text } from "@/src/components/ui/Text";
import { Enums } from "@/database.types";

interface MoodSelectorProps {
  selectedMood: Enums<"mood">;
  onSelectMood: (mood: Enums<"mood">) => void;
  viewOnly?: boolean;
  title?: string;
}

// Emotion images configuration
const EMOTION_IMAGES = {
  terrible: require("@/assets/emojis/terrible.png"),
  bad: require("@/assets/emojis/bad.png"),
  fine: require("@/assets/emojis/fine.png"),
  good: require("@/assets/emojis/good.png"),
  great: require("@/assets/emojis/great.png"),
} as const;

type EmotionType = keyof typeof EMOTION_IMAGES;

const MOODS: { id: Enums<'mood'>; label: string }[] = [
  { id: "terrible", label: "Terrible" },
  { id: "bad", label: "Bad" },
  { id: "fine", label: "Fine" },
  { id: "good", label: "Good" },
  { id: "great", label: "Great" },
];

/**
 * Mood selector component with emotion images
 * Ultra-clean design with minimal styling
 */
export const MoodSelector = React.memo<MoodSelectorProps>(
  ({
    selectedMood,
    onSelectMood,
    viewOnly = false,
    title,
  }: MoodSelectorProps) => {
      if (viewOnly) {
        const currentMood = MOODS.find((m) => m.id === selectedMood) || MOODS[4];
        return (
          <View 
            className="mb-6"
            accessible={true}
            accessibilityLabel={`Journal entry titled ${title || "Daily Reflections"}. Mood is ${currentMood.label}.`}
          >
            <View className="flex-row items-center gap-3.5">
              <View className="h-13 w-13 items-center justify-center rounded-[18px] bg-white/60 border border-white/80 shadow-sm">
                <Image
                  source={EMOTION_IMAGES[currentMood.id as EmotionType]}
                  className="w-9 h-9"
                  resizeMode="contain"
                />
              </View>
              <View className="flex-1">
                <Text variant="h1" className="text-[26px] leading-[30px]">
                  {title || "Daily Reflections"}
                </Text>
              </View>
            </View>
          </View>
        );
      }

    return (
      <View className="px-4 pb-4">
        <View className="flex-row justify-between">
          {MOODS.map((mood) => (
            <TouchableOpacity
              key={mood.id}
              onPress={() => onSelectMood(mood.id)}
              className="items-center"
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={mood.label}
              accessibilityState={{ selected: selectedMood === mood.id }}
            >
              <Image
                source={EMOTION_IMAGES[mood.id as EmotionType]}
                className={selectedMood === mood.id ? "w-14 h-14" : "w-12 h-12 opacity-50"}
                resizeMode="contain"
              />
              <Text
                variant="caption"
                className={`mt-1 font-semibold ${
                  selectedMood === mood.id ? "text-ink" : "text-ink-muted"
                }`}
              >
                {mood.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  }
);

MoodSelector.displayName = "MoodSelector";
