import React from "react";
import { Text, View, Image } from "react-native";
import Animated from "react-native-reanimated";
import { MoodCardProps } from "../types";
import { EmojiSelector } from "./EmojiSelector";
import { EMOTION_IMAGES, EmotionType } from "../constants";

/**
 * Presentational component for mood card
 * Displays selected emotion image, title, and emotion selector in edit mode
 * Enhanced with pastel card design matching reference UI
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
    const emotionImage = EMOTION_IMAGES[selectedEmoji as EmotionType];

    return (
      <Animated.View
        style={[moodCardStyle]}
        className="bg-amber-50 rounded-3xl p-6 mb-4"
      >
        {!isEditing ? (
          /* Display mode: Emotion Image + Title */
          <View className="flex-row items-center gap-4 justify-start">
            <Animated.View style={[singleEmojiStyle]}>
              <Image
                source={emotionImage}
                className="w-10 h-10"
                resizeMode="contain"
              />
            </Animated.View>
            <Animated.View style={[{ flex: 1 }, summaryStyle]}>
              <Text className="text-xl font-bold text-gray-900 leading-7">
                {title}
              </Text>
            </Animated.View>
          </View>
        ) : (
          /* Edit mode: Emotion selector */
          <Animated.View
            pointerEvents="auto"
            style={[emojiRowStyle]}
            className="flex-row justify-between items-center"
          >
            <EmojiSelector
              selectedEmoji={selectedEmoji}
              onSelectEmoji={onSelectEmoji}
            />
          </Animated.View>
        )}
      </Animated.View>
    );
  }
);

MoodCard.displayName = "MoodCard";
