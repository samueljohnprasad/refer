import React, { useCallback } from "react";
import { Text, TouchableOpacity } from "react-native";
import Animated, { FadeIn, FadeOut, Layout } from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { TagItemProps } from "../types";

/**
 * Presentational component for displaying a single tag
 * Handles display and removal with animations
 */
export const TagItem = React.memo<TagItemProps>(
  ({ tag, index, isEditing, colorScheme, onRemove }: TagItemProps) => {
    const handleRemove = useCallback((): void => {
      onRemove(index);
    }, [index, onRemove]);

    return (
      <Animated.View
        style={[
          tag.colorsGradient?.[0]
            ? { backgroundColor: tag.colorsGradient[0] }
            : undefined,
        ]}
        className="flex-row items-center py-2 px-4 rounded-full mr-2 mb-2 border border-theme-border/50 bg-theme-background-secondary"
        entering={FadeIn.springify().damping(16)}
        exiting={FadeOut.duration(140)}
        layout={Layout.springify().stiffness(180)}
      >
        <Text className="text-base font-medium text-theme-text-primary">
          {tag.emoji} {tag.name}
        </Text>
        {isEditing && (
          <TouchableOpacity onPress={handleRemove} className="ml-2" accessibilityRole="button" accessibilityLabel={`Remove ${tag.name}`}>
            <Feather
              name="x-circle"
              size={16}
              className="text-theme-text-secondary"
            />
          </TouchableOpacity>
        )}
      </Animated.View>
    );
  }
);

TagItem.displayName = "TagItem";
