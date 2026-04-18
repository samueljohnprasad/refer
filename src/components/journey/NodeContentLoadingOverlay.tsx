import React from "react";
import { View, Text as RNText, ActivityIndicator, Pressable } from "react-native";

interface NodeContentLoadingOverlayProps {
  isVisible: boolean;
  onCancel: () => void;
}

export default function NodeContentLoadingOverlay({
  isVisible,
  onCancel,
}: NodeContentLoadingOverlayProps) {
  if (!isVisible) return null;

  return (
    <Pressable
      className="absolute inset-0 items-center justify-center bg-black/20 z-50"
      onPress={onCancel}
    >
      <View className="rounded-2xl bg-white px-6 py-4 items-center shadow-lg">
        <ActivityIndicator size="large" color="#58CC02" />
        <RNText className="mt-2 text-sm font-medium text-gray-600">
          Loading content…
        </RNText>
        <RNText className="mt-1 text-xs text-gray-400">Tap to cancel</RNText>
      </View>
    </Pressable>
  );
}
