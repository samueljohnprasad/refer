import React from "react";
import { View, Pressable } from "react-native";
import { Text } from "@/src/components/ui/Text";
import { Skeleton } from "@/src/components/ui/Skeleton";

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
      <View className="rounded-2xl bg-brand-surface px-6 py-5 items-center shadow-lg gap-3">
        <Skeleton width={120} height={16} radius={8} />
        <Skeleton width={80} height={12} radius={6} />
        <Text variant="caption-muted" className="mt-1">Tap to cancel</Text>
      </View>
    </Pressable>
  );
}
