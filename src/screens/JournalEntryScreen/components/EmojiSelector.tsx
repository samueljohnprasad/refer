import React from "react";
import { Image, TouchableOpacity } from "react-native";
import { EmojiSelectorProps } from "../types";
import { EMOTION_IMAGES, EMOTIONS_CONFIG, EmotionType } from "../constants";

/**
 * Presentational component for emotion image selection
 * Displays 5 mood emotion images for selection
 * Uses emotion images from assets instead of emojis
 */
export const EmojiSelector = React.memo<EmojiSelectorProps>(
  ({ selectedEmoji, onSelectEmoji }: EmojiSelectorProps) => {
    return (
      <>
        {EMOTIONS_CONFIG.map((emotion) => {
          const isSelected: boolean = selectedEmoji === emotion.key;
          return (
            <TouchableOpacity
              key={emotion.key}
              onPress={(): void => onSelectEmoji(emotion.key)}
              className={`p-1 rounded-full ${
                isSelected ? "bg-white/30" : "active:bg-gray-100/20"
              }`}
              accessibilityLabel={`Select ${emotion.label} mood`}
              accessibilityRole="button"
            >
              <Image
                source={EMOTION_IMAGES[emotion.key as EmotionType]}
                className={isSelected ? "w-12 h-12" : "w-10 h-10"}
                resizeMode="contain"
              />
            </TouchableOpacity>
          );
        })}
      </>
    );
  }
);

EmojiSelector.displayName = "EmojiSelector";
