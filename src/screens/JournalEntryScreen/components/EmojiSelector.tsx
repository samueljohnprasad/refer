import React from "react";
import { TouchableOpacity } from "react-native";
import { EmojiSelectorProps } from "../types";
import { EMOTIONS_CONFIG } from "../constants";
import { MoodIcon, type MoodKey } from "@/src/components/MoodIcon";

/**
 * Presentational component for emotion image selection
 * Displays 5 mood emotion images for selection
 * Uses vector MoodIcon
 */
export const EmojiSelector = React.memo<EmojiSelectorProps>(
  ({ selectedEmoji, onSelectEmoji }: EmojiSelectorProps) => {
    return (
      <>
        {EMOTIONS_CONFIG.map((emotion) => {
          const isSelected: boolean = selectedEmoji === emotion.key;
          return (
            // ponytail: vector MoodIcon selection
            <TouchableOpacity
              key={emotion.key}
              onPress={(): void => onSelectEmoji(emotion.key)}
              className={`p-1 rounded-full ${
                isSelected ? "bg-white/30" : "active:bg-gray-100/20"
              }`}
              accessibilityLabel={`Select ${emotion.label} mood`}
              accessibilityRole="button"
            >
              <MoodIcon
                mood={emotion.key as MoodKey}
                size={isSelected ? 44 : 38}
              />
            </TouchableOpacity>
          );
        })}
      </>
    );
  }
);

EmojiSelector.displayName = "EmojiSelector";
