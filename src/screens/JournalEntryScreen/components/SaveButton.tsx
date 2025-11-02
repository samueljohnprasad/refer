import React from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { SaveButtonProps } from "../types";

/**
 * Presentational component for save button
 * Sticky footer button with loading state
 */
export const SaveButton = React.memo<SaveButtonProps>(
  ({
    saving,
    keyboardHeight,
    bottomInset,
    onSave,
    onLayout,
  }: SaveButtonProps) => {
    return (
      <View
        style={[{ bottom: keyboardHeight, paddingBottom: 16 + bottomInset }]}
        className="absolute left-0 right-0 bg-background-light dark:bg-background-dark p-5 border-t border-outline-100 dark:border-outline-800 shadow-soft-2"
        onLayout={({ nativeEvent }): void =>
          onLayout(nativeEvent.layout.height)
        }
      >
        <TouchableOpacity
          style={[saving && { opacity: 0.6 }]}
          className="bg-[#FFD24A] rounded-xl p-4 items-center shadow-soft-2"
          onPress={onSave}
          disabled={saving}
          activeOpacity={0.8}
        >
          <View className="flex-row items-center justify-center">
            {saving && (
              <View className="mr-2">
                <ActivityIndicator color="#fff" size="small" />
              </View>
            )}
            <Text className="text-typography-black text-lg font-bold">
              {saving ? "Saving…" : "Continue"}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
);

SaveButton.displayName = "SaveButton";
