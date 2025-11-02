import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { TagsListProps } from "../types";
import { TagItem } from "./TagItem";

/**
 * Presentational component for tags list
 * Displays tags with add button in edit mode
 */
export const TagsList = React.memo<TagsListProps>(
  ({ tags, isEditing, colorScheme, onRemove, onAdd }: TagsListProps) => {
    return (
      <View className="flex-row flex-wrap mb-6 gap-2">
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
            className="flex-row items-center py-2 px-3 rounded-full mr-2 mb-2 border border-outline-100 dark:border-outline-800 bg-background-100 dark:bg-background-800"
          >
            <Text className="text-[15px] text-typography-900 dark:text-typography-50">
              ＋ Add Tag
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }
);

TagsList.displayName = "TagsList";
