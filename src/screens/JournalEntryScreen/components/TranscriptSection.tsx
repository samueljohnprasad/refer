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
      <Text className="text-gray-400 text-xs uppercase tracking-wider mb-3">
        TRANSCRIPT ({wordCount} words)
      </Text>
      
      {isEditing ? (
        <TextInput
          value={text}
          onChangeText={onTextChange}
          multiline
          numberOfLines={6}
          placeholder="Write your thoughts..."
          placeholderTextColor="#9CA3AF"
          className="text-gray-900 text-base leading-6 bg-white rounded-lg p-4 min-h-[150]"
          textAlignVertical="top"
        />
      ) : (
        <Text className="text-gray-900 text-base leading-6">
          {text}
        </Text>
      )}
    </View>
  );
});

TranscriptSection.displayName = "TranscriptSection";
