import React from "react";
import { Text } from "react-native";
import Animated from "react-native-reanimated";
import { MoodCardProps } from "../types";
import { EmojiSelector } from "./EmojiSelector";

/**
 * Presentational component for mood card
 * Displays selected emoji, title, and emoji selector in edit mode
 */
export const MoodCard = React.memo<MoodCardProps>(
  ({
    selectedEmoji,
    title,
    isEditing,
    onSelectEmoji,
    moodCardStyle,
    singleEmojiStyle,
    summaryStyle,
    emojiRowStyle,
  }: MoodCardProps) => {
    return (
      <Animated.View
        style={[moodCardStyle]}
        className="flex-row items-center p-5 rounded-2xl mb-6 shadow-soft-1"
      >
        {/* Single emoji (fades/scales out) */}
        <Animated.Text className="mr-4 text-[34px]" style={[singleEmojiStyle]}>
          {selectedEmoji}
        </Animated.Text>

        {/* Summary (fades out) */}
        <Animated.View style={[{ flex: 1 }, summaryStyle]}>
          <Text className="text-lg font-bold text-typography-900 dark:text-typography-50">
            {title}
          </Text>
        </Animated.View>

        {/* 5-emoji selector overlay (fades/scales in) */}
        <Animated.View
          pointerEvents={isEditing ? "auto" : "none"}
          style={[emojiRowStyle]}
          className="absolute left-[18px] right-[18px] top-[18px] flex-row justify-between items-center"
        >
          <EmojiSelector
            selectedEmoji={selectedEmoji}
            onSelectEmoji={onSelectEmoji}
          />
        </Animated.View>
      </Animated.View>
    );
  }
);

MoodCard.displayName = "MoodCard";
