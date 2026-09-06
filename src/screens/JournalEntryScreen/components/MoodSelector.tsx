import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Text } from "@/src/components/ui/Text";
import { Enums } from "@/database.types";
import { MoodIcon, type MoodKey } from "@/src/components/MoodIcon";

interface MoodSelectorProps {
  selectedMood: Enums<"mood">;
  onSelectMood: (mood: Enums<"mood">) => void;
  viewOnly?: boolean;
  title?: string;
}

const MOODS: { id: Enums<'mood'>; label: string }[] = [
  { id: "terrible", label: "Terrible" },
  { id: "bad", label: "Bad" },
  { id: "fine", label: "Fine" },
  { id: "good", label: "Good" },
  { id: "great", label: "Great" },
];

/**
 * Mood selector component with vector MoodIcon
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
          // ponytail: vector MoodIcon in journal view-only header
          <View 
            className="mb-6"
            accessible={true}
            accessibilityLabel={`Journal entry titled ${title || "Daily Reflections"}. Mood is ${currentMood.label}.`}
          >
            <View className="flex-row items-center gap-3.5">
              <View className="h-13 w-13 items-center justify-center rounded-[18px] bg-white border border-sage-200">
                <MoodIcon mood={currentMood.id as MoodKey} size={36} />
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
      // ponytail: vector MoodIcon selection row
      <View className="px-4 pb-4">
        <View className="flex-row justify-between">
          {MOODS.map((mood) => {
            const isSelected = selectedMood === mood.id;
            return (
              <TouchableOpacity
                key={mood.id}
                onPress={() => onSelectMood(mood.id)}
                className="items-center"
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel={mood.label}
                accessibilityState={{ selected: isSelected }}
              >
                <View style={{ opacity: isSelected ? 1 : 0.45 }}>
                  <MoodIcon
                    mood={mood.id as MoodKey}
                    size={isSelected ? 44 : 38}
                  />
                </View>
                <Text
                  variant="caption"
                  className={`mt-1.5 text-[11px] ${
                    isSelected
                      ? "font-bold text-ink"
                      : "font-medium text-ink-soft opacity-70"
                  }`}
                >
                  {mood.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  }
);

MoodSelector.displayName = "MoodSelector";
