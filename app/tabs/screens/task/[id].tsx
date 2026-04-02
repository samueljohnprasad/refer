/**
 * Task Screen — placeholder for lesson/task content.
 * Receives taskId via route params from the journey map.
 * Will be replaced with actual task content in a future phase.
 */

import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";
import { useLocalSearchParams, router } from "expo-router";
import { PressableScale } from "@/src/components/ui/PressableScale";

export default function TaskScreen(): React.JSX.Element {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <View className="flex-1 items-center justify-center px-6">
        {/* Task icon */}
        <View className="h-24 w-24 rounded-3xl bg-green-50 items-center justify-center mb-6">
          <Text className="text-5xl">📝</Text>
        </View>

        <Text className="text-2xl font-extrabold text-slate-900 mb-2 text-center">
          Task: {id}
        </Text>
        <Text className="text-base text-slate-500 text-center mb-8">
          This is where the lesson content will appear. Complete the task to
          earn rewards and unlock the next lesson.
        </Text>

        {/* Complete button */}
        <PressableScale
          onPress={() => router.back()}
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
          <Text className="text-lg font-extrabold text-white">CONTINUE</Text>
        </PressableScale>
      </View>
    </SafeAreaView>
  );
}
