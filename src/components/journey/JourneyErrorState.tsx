/**
 * JourneyErrorState
 * Error screen shown when journey data fails to load.
 * Provides a retry button for the user.
 */

import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";
import { PressableScale } from "@/src/components/ui/PressableScale";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface JourneyErrorStateProps {
  message?: string;
  onRetry: () => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function JourneyErrorState({
  message = "Something went wrong loading your journey.",
  onRetry,
}: JourneyErrorStateProps): React.JSX.Element {
  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      <View className="flex-1 items-center justify-center px-8">
        <View className="h-24 w-24 rounded-3xl bg-red-50 items-center justify-center mb-6">
          <Text className="text-5xl">😕</Text>
        </View>

        <Text className="text-xl font-extrabold text-slate-800 mb-2 text-center">
          Oops!
        </Text>
        <Text className="text-base text-slate-500 text-center mb-8 leading-relaxed">
          {message}
        </Text>

        <PressableScale
          onPress={onRetry}
          scale={0.95}
          hapticStyle="medium"
          style={{
            backgroundColor: "#58CC02",
            paddingHorizontal: 32,
            paddingVertical: 14,
            borderRadius: 16,
            borderBottomWidth: 4,
            borderBottomColor: "#45A802",
          }}
        >
          <Text className="text-lg font-extrabold text-white">TRY AGAIN</Text>
        </PressableScale>
      </View>
    </SafeAreaView>
  );
}
