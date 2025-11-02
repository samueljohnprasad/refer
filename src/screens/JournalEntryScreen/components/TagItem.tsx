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
        className="flex-row items-center py-2 px-3 rounded-full mr-2 mb-2 border border-outline-100 dark:border-outline-800 bg-background-100 dark:bg-background-800"
        entering={FadeIn.springify().damping(16)}
        exiting={FadeOut.duration(140)}
        layout={Layout.springify().stiffness(180)}
      >
        <Text className="text-[15px] text-typography-900 dark:text-typography-50">
          {tag.emoji} {tag.name}
        </Text>
        {isEditing && (
          <TouchableOpacity onPress={handleRemove}>
            <Feather
              name="x-circle"
              size={16}
              color={
                colorScheme === "dark" ? Colors.dark.icon : Colors.light.icon
              }
            />
          </TouchableOpacity>
        )}
      </Animated.View>
    );
  }
);

TagItem.displayName = "TagItem";
