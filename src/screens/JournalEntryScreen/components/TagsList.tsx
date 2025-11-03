import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { TagsListProps } from "../types";
import { TagItem } from "./TagItem";

/**
 * Presentational component for tags list
 * Displays tags with add button in edit mode
 * Enhanced with modern styling
 */
export const TagsList = React.memo<TagsListProps>(
  ({ tags, isEditing, colorScheme, onRemove, onAdd }: TagsListProps) => {
    if (tags.length === 0 && !isEditing) {
      return null;
    }

    return (
      <View className="flex-row flex-wrap mb-4 gap-2">
        {tags.map((tag, index) => (
          <TagItem
            key={index}
            tag={tag}
            index={index}
            isEditing={isEditing}
            colorScheme={colorScheme}
            onRemove={onRemove}
          />
        ))}
        {isEditing && (
          <TouchableOpacity
            onPress={onAdd}
            className="flex-row items-center py-2 px-4 rounded-full border-2 border-dashed border-gray-300 bg-white active:bg-gray-50"
            accessibilityLabel="Add new tag"
            accessibilityRole="button"
          >
            <Text className="text-sm font-medium text-gray-600">
              ＋ Add Tag
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }
);

TagsList.displayName = "TagsList";
