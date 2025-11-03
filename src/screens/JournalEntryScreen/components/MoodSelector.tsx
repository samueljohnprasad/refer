import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";

interface MoodSelectorProps {
  selectedMood: string;
  onSelectMood: (mood: string) => void;
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

const MOODS = [
  { id: "terrible" as const, label: "Terrible" },
  { id: "bad" as const, label: "Bad" },
  { id: "fine" as const, label: "Fine" },
  { id: "good" as const, label: "Good" },
  { id: "great" as const, label: "Great" },
];

/**
 * Mood selector component with emotion images
 * Ultra-clean design with minimal styling
 */
export const MoodSelector = React.memo<MoodSelectorProps>(({
  selectedMood,
  onSelectMood,
  viewOnly = false,
  title,
}: MoodSelectorProps) => {
  if (viewOnly) {
    const currentMood = MOODS.find(m => m.id === selectedMood) || MOODS[4];
    return (
      <View className="mb-6">
        <View className="flex-row items-center gap-3">
          <Image
            source={EMOTION_IMAGES[currentMood.id as EmotionType]}
            className="w-16 h-16"
            resizeMode="contain"
          />
          <View className="flex-1">
            <Text className="text-2xl font-bold text-gray-900">{title || "Daily Reflections"}</Text>
            <Text className="text-gray-400 text-sm mt-1">📓 ☀️</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View className="px-5 pb-4">
      <View className="flex-row justify-between">
        {MOODS.map(mood => (
          <TouchableOpacity
            key={mood.id}
            onPress={() => onSelectMood(mood.id)}
            className="items-center"
            activeOpacity={0.7}
          >
            <Image
              source={EMOTION_IMAGES[mood.id as EmotionType]}
              className={selectedMood === mood.id ? "w-14 h-14" : "w-12 h-12"}
              resizeMode="contain"
            />
            <Text className={`text-xs mt-1 ${
              selectedMood === mood.id ? "text-gray-900 font-semibold" : "text-gray-400"
            }`}>
              {mood.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
});

MoodSelector.displayName = "MoodSelector";
