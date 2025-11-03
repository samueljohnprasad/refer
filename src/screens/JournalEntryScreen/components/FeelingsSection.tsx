import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";

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

  return (
    <View className="mb-6">
      <Text className="text-gray-400 text-xs uppercase tracking-wider mb-3">FEELINGS</Text>
      
      <View className="flex-row flex-wrap gap-2">
        {feelings.map((feeling, index) => (
          <View
            key={index}
            className="flex-row items-center px-3 py-2 rounded-full bg-white"
          >
            <Text className="mr-1">{FEELING_EMOJIS[feeling.toLowerCase()] || "😊"}</Text>
            <Text className="text-gray-900 text-sm">{feeling}</Text>
            {isEditing && (
              <TouchableOpacity
                onPress={() => onRemoveFeeling(index)}
                className="ml-2 w-5 h-5 rounded-full bg-red-400 items-center justify-center"
                activeOpacity={0.7}
              >
                <Text className="text-white text-xs font-bold">−</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}

        {isEditing && !isAdding && (
          <TouchableOpacity
            onPress={() => setIsAdding(true)}
            className="flex-row items-center px-3 py-2 rounded-full bg-white"
            activeOpacity={0.7}
          >
            <Text className="text-gray-400 text-sm">+ add</Text>
          </TouchableOpacity>
        )}

        {isEditing && isAdding && (
          <View className="flex-row items-center px-3 py-1 rounded-full bg-white border border-gray-300">
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
              placeholderTextColor="#9CA3AF"
              className="text-gray-900 text-sm min-w-[100]"
              autoFocus
            />
          </View>
        )}
      </View>
    </View>
  );
});

FeelingsSection.displayName = "FeelingsSection";
