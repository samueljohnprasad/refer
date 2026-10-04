import React from "react";
import { View, Text, TextInput } from "react-native";
import { JournalContentProps } from "../types";
import { useTranslation } from "react-i18next";

/**
 * Presentational component for journal content
 * Displays editable text area or read-only text as paragraph
 * Enhanced with pastel card design matching reference UI
 */
export const JournalContent = React.memo<JournalContentProps>(
  ({ isEditing, journalText, onTextChange }: JournalContentProps) => {
    const { t } = useTranslation("journal");

    return (
      <View className="bg-violet-50 rounded-3xl p-6 mb-4 border border-violet-100">
        {isEditing ? (
          <>
            <Text className="text-base font-semibold text-gray-700 mb-3">
              {t("entryDetail.content")}
            </Text>
            <TextInput
              className="text-base leading-6 text-gray-900 border border-violet-200 rounded-xl p-4 min-h-[120px] bg-white"
              multiline
              value={journalText || ""}
              onChangeText={onTextChange}
              placeholder={t("entryDetail.writePlaceholder")}
              placeholderTextColor="#9ca3af"
            />
          </>
        ) : (
          /* Display mode: Content as paragraph */
          journalText ? (
            <Text className="text-base text-gray-900 leading-6">
              {journalText}
            </Text>
          ) : (
            <Text className="text-base text-gray-500">
              {t("entryDetail.noContent")}
            </Text>
          )
        )}
      </View>
    );
  }
);

JournalContent.displayName = "JournalContent";
