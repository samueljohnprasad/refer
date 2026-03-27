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
      <Text className="text-theme-text-secondary font-semibold text-xs uppercase tracking-wider mb-2">FEELINGS</Text>
      
      <View className="flex-row flex-wrap gap-2">
        {feelings.map((feeling, index) => (
          <View
            key={index}
            className={`flex-row items-center px-4 py-2 rounded-full ${isEditing ? "bg-white" : "bg-white/50"}`}
            accessibilityRole="text"
            accessibilityLabel={`Feeling: ${feeling}`}
          >
            <Text className="mr-1">{FEELING_EMOJIS[feeling.toLowerCase()] || "😊"}</Text>
            <Text className="text-theme-text-primary text-sm font-medium">{feeling}</Text>
            {isEditing && (
              <TouchableOpacity
                onPress={() => onRemoveFeeling(index)}
                className="ml-2 w-5 h-5 rounded-full bg-red-400 items-center justify-center"
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel={`Remove ${feeling}`}
              >
                <Text className="text-white text-xs font-bold">−</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}

        {isEditing && !isAdding && (
          <TouchableOpacity
            onPress={() => setIsAdding(true)}
            className="flex-row items-center px-4 py-2 rounded-full bg-white/80"
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Add feeling"
          >
            <Text className="text-theme-text-secondary text-sm font-medium">+ add</Text>
          </TouchableOpacity>
        )}

        {isEditing && isAdding && (
          <View className="flex-row items-center px-4 py-1.5 rounded-full bg-white border border-theme-border">
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
              className="text-theme-text-primary text-sm min-w-[104px]"
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
