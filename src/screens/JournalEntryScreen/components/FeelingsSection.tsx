import React, { useState } from "react";
import { View, TouchableOpacity, TextInput } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Text } from "@/src/components/ui/Text";

interface FeelingsSectionProps {
  feelings: string[];
  isEditing: boolean;
  onAddFeeling: (feeling: string) => void;
  onRemoveFeeling: (index: number) => void;
}

const FEELING_EMOJIS: { [key: string]: string } = {
  happy: "😊",
  reflective: "🤔",
  determined: "💪",
  anxious: "😰",
  excited: "🎉",
  grateful: "🙏",
  sad: "😔",
  angry: "😠",
  calm: "😌",
  energetic: "⚡",
};

/**
 * Feelings section with emoji pills
 * Clean design matching screenshot reference
 */
export const FeelingsSection = React.memo<FeelingsSectionProps>(({
  feelings,
  isEditing,
  onAddFeeling,
  onRemoveFeeling,
}: FeelingsSectionProps) => {
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [newFeeling, setNewFeeling] = useState<string>("");

  const handleAdd = (): void => {
    if (newFeeling.trim()) {
      onAddFeeling(newFeeling.trim());
      setNewFeeling("");
      setIsAdding(false);
    }
  };

  if (!isEditing && feelings.length === 0) {
    return null;
  }

  return (
    <View className="mt-2 mb-6">
      <View className="flex-row flex-wrap gap-2">

        {feelings.map((feeling, index) => (
          <View
            key={index}
            className={`flex-row items-center px-3.5 py-1.5 rounded-full border ${
              isEditing 
                ? "bg-white border-sage-100 shadow-sm" 
                : "bg-white/60 border-white/80"
            }`}
            accessibilityRole="text"
            accessibilityLabel={`Feeling: ${feeling}`}
          >
            <Text className="mr-1">{FEELING_EMOJIS[feeling.toLowerCase()] || "😊"}</Text>
            <Text variant="label-bold" className="text-ink">{feeling}</Text>
            {isEditing && (
              <TouchableOpacity
                onPress={() => onRemoveFeeling(index)}
                className="ml-2 w-5 h-5 rounded-full bg-sage-200/60 items-center justify-center"
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel={`Remove ${feeling}`}
              >
                <Feather name="x" size={11} color="#4A5568" />
              </TouchableOpacity>
            )}
          </View>
        ))}

        {isEditing && !isAdding && (
          <TouchableOpacity
            onPress={() => setIsAdding(true)}
            className="flex-row items-center px-3.5 py-1.5 rounded-full bg-white/75 border border-sage-300/60"
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Add feeling"
          >
            <Text variant="label-bold" className="text-sage-500">+ Add</Text>
          </TouchableOpacity>
        )}

        {isEditing && isAdding && (
          <View className="flex-row items-center px-3.5 py-1 rounded-full bg-white border border-sage-200 shadow-sm">
            <TextInput
              value={newFeeling}
              onChangeText={setNewFeeling}
              onSubmitEditing={handleAdd}
              onBlur={() => {
                if (!newFeeling.trim()) {
                  setIsAdding(false);
                }
              }}
              placeholder="enter feeling"
              placeholderTextColor="rgba(107, 107, 107, 0.5)"
              className="text-ink text-sm min-w-[104px]"
              autoFocus
              accessibilityLabel="Type new feeling"
            />
          </View>
        )}
      </View>
    </View>
  );
});

FeelingsSection.displayName = "FeelingsSection";
