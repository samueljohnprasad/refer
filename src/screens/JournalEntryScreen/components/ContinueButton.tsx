import React from "react";
import { TouchableOpacity, Text, ActivityIndicator, View } from "react-native";

interface ContinueButtonProps {
  onPress: () => void;
  loading?: boolean;
  isEditing?: boolean;
}

/**
 * Continue/Save button at bottom of screen
 * Minimal design with professional styling
 */
export const ContinueButton = React.memo<ContinueButtonProps>(({
  onPress,
  loading = false,
  isEditing = false,
}: ContinueButtonProps) => {
  // HIDDEN completely when not editing so it doesn't pollute view mode hierarchy
  if (!isEditing) return null;

  return (
    <View className="absolute bottom-0 left-0 right-0 bg-transparent px-4 pb-8 pt-2">
      <TouchableOpacity
        onPress={onPress}
        disabled={loading}
        className="bg-theme-purple-deep rounded-full py-4 items-center justify-center opacity-95"
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel="Save journal"
        accessibilityState={{ busy: loading }}
      >
        {loading ? (
          <ActivityIndicator color="white" size="small" />
        ) : (
          <Text className="text-white text-base font-semibold">Save</Text>
        )}
      </TouchableOpacity>
    </View>
  );
});

ContinueButton.displayName = "ContinueButton";
