import React from "react";
import { View, Text, TextInput } from "react-native";
import { JournalContentProps } from "../types";

/**
 * Presentational component for journal content
 * Displays editable text area or read-only text
 */
export const JournalContent = React.memo<JournalContentProps>(
  ({ isEditing, journalText, onTextChange }: JournalContentProps) => {
    return (
      <View className="bg-background-50 dark:bg-background-900 rounded-2xl p-5 mb-6 shadow-soft-1">
        <Text className="text-lg font-semibold text-typography-900 dark:text-typography-50 mb-3 ml-2">
          Journal Content
        </Text>
        {isEditing ? (
          <TextInput
            className="text-base leading-6 text-typography-600 dark:text-typography-300 tracking-[0.2px] border border-outline-200 dark:border-outline-700 rounded-lg p-2"
            multiline
            value={journalText || ""}
            onChangeText={onTextChange}
          />
        ) : (
          <Text className="text-base leading-6 text-typography-600 dark:text-typography-300 tracking-[0.2px]">
            {journalText || ""}
          </Text>
        )}
      </View>
    );
  }
);

JournalContent.displayName = "JournalContent";
