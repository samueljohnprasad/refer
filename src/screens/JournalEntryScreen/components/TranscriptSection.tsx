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
      {isEditing ? (
        <View>
          <TextInput
            value={text}
            onChangeText={onTextChange}
            multiline
            numberOfLines={6}
            placeholder="Write your thoughts..."
            placeholderTextColor="rgba(107, 107, 107, 0.5)"
            className="text-ink text-base leading-6 bg-white/95 border border-sage-200/70 rounded-2xl p-4 min-h-[160px]"
            textAlignVertical="top"
            accessibilityLabel="Journal transcript editor"
          />
          <View className="flex-row justify-end mt-1.5 px-1">
            <Text variant="caption" className="text-ink-muted">
              {wordCount} {wordCount === 1 ? "word" : "words"}
            </Text>
          </View>
        </View>
      ) : (
        <View className="py-2">
          <Text
            variant="body"
            className="text-ink text-[17px] leading-[28px]"
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
