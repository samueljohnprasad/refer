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
  if (isEditing) return null;

  return (
    <View className="absolute bottom-0 left-0 right-0 bg-transparent px-5 pb-8">
      <TouchableOpacity
        onPress={onPress}
        disabled={loading}
        className="bg-black rounded-full py-4 items-center justify-center"
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator color="white" size="small" />
        ) : (
          <Text className="text-white text-base font-semibold">Continue</Text>
        )}
      </TouchableOpacity>
    </View>
  );
});

ContinueButton.displayName = "ContinueButton";
