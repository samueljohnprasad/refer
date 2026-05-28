import React, { useState } from "react";
import { View, TouchableOpacity, TextInput } from "react-native";
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

  return (
    <View className="mb-6">
      <Text variant="eyebrow" className="mb-2">FEELINGS</Text>
      
      <View className="flex-row flex-wrap gap-2">
        {feelings.length === 0 && !isEditing && (
          <View className="flex-1 rounded-[20px] border-2 border-dashed border-sage-200 bg-white/20 px-4 py-3.5 items-center justify-center">
            <Text variant="body" color="muted" className="italic text-[14px]">
              No feelings logged yet
            </Text>
          </View>
        )}

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
                className="ml-2 w-4.5 h-4.5 rounded-full bg-cardinal-red/10 items-center justify-center"
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel={`Remove ${feeling}`}
              >
                <Text variant="caption" className="text-cardinal-red font-bold text-[10px] leading-[10px] -mt-0.5">−</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}

        {isEditing && !isAdding && (
          <TouchableOpacity
            onPress={() => setIsAdding(true)}
            className="flex-row items-center px-3.5 py-1.5 rounded-full bg-white/80 border border-sage-100/60 shadow-sm"
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
