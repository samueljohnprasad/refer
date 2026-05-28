import React from "react";
import { View, TextInput } from "react-native";
import { Text } from "@/src/components/ui/Text";

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
      <Text variant="eyebrow" className="mb-2">
        TRANSCRIPT ({wordCount} {wordCount === 1 ? "word" : "words"})
      </Text>
      
      {isEditing ? (
        <TextInput
          value={text}
          onChangeText={onTextChange}
          multiline
          numberOfLines={6}
          placeholder="Write your thoughts..."
          placeholderTextColor="rgba(107, 107, 107, 0.5)"
          className="text-ink text-base leading-6 bg-white border border-sage-100 rounded-xl p-4 min-h-[152px] shadow-sm"
          textAlignVertical="top"
          accessibilityLabel="Journal transcript editor"
        />
      ) : (
        <View className="bg-white/60 border border-white/85 rounded-2xl p-5 shadow-sm">
          <Text 
            variant="body"
            className="text-ink text-[17px] leading-[26px]"
            accessibilityRole="text"
            accessibilityLabel={`Transcript: ${text}`}
          >
            {text}
          </Text>
        </View>
      )}
    </View>
  );
});

TranscriptSection.displayName = "TranscriptSection";
