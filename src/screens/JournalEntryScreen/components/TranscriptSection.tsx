import React from "react";
import { View, Text, TextInput } from "react-native";

interface TranscriptSectionProps {
  text: string;
  isEditing: boolean;
  onTextChange: (text: string) => void;
}

/**
 * Transcript section with word count
 * Clean typography matching screenshot
 */
export const TranscriptSection = React.memo<TranscriptSectionProps>(({
  text,
  isEditing,
  onTextChange,
}: TranscriptSectionProps) => {
  const wordCount = text.trim().split(/\s+/).filter(word => word.length > 0).length;

  return (
    <View className="mb-6">
      <Text className="text-theme-text-secondary font-semibold text-xs uppercase tracking-wider mb-2">
        TRANSCRIPT ({wordCount} words)
      </Text>
      
      {isEditing ? (
        <TextInput
          value={text}
          onChangeText={onTextChange}
          multiline
          numberOfLines={6}
          placeholder="Write your thoughts..."
          placeholderTextColor="rgba(107, 107, 107, 0.5)"
          className="text-theme-text-primary text-base leading-6 bg-white rounded-xl p-4 min-h-[152px]"
          textAlignVertical="top"
          accessibilityLabel="Journal transcript editor"
        />
      ) : (
        <Text 
          className="text-theme-text-primary text-lg leading-relaxed"
          accessibilityRole="text"
          accessibilityLabel={`Transcript: ${text}`}
        >
          {text}
        </Text>
      )}
    </View>
  );
});

TranscriptSection.displayName = "TranscriptSection";
