import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { EmojiSelectorProps } from "../types";
import { MAIN_EMOTIONS } from "../constants";

/**
 * Presentational component for emoji selection
 * Displays 5 mood emojis for selection
 */
export const EmojiSelector = React.memo<EmojiSelectorProps>(
  ({ selectedEmoji, onSelectEmoji }: EmojiSelectorProps) => {
    return (
      <>
        {MAIN_EMOTIONS.map((emo: string, idx: number) => (
          <TouchableOpacity key={idx} onPress={(): void => onSelectEmoji(emo)}>
            <Text
              style={[
                styles.moodEmoji,
                selectedEmoji === emo && { fontSize: 40 },
              ]}
            >
              {emo}
            </Text>
          </TouchableOpacity>
        ))}
      </>
    );
  }
);

EmojiSelector.displayName = "EmojiSelector";

const styles = StyleSheet.create({
  moodEmoji: { fontSize: 34 },
});
