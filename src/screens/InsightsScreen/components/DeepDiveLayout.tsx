import React from "react";
import { View, Pressable } from "react-native";
import { Text } from "@/components/ui/text";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { TimeRangeSelector } from "./TimeRangeSelector";
import type { TimeRange } from "@/src/constants/insights";

interface DeepDiveLayoutProps {
  title: string;
  timeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
  isLoading: boolean;
  children: React.ReactNode;
}

export function DeepDiveLayout({
  title,
  timeRange,
  onTimeRangeChange,
  isLoading,
  children,
}: DeepDiveLayoutProps) {
  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-warm-white" edges={["top"]}>
        <View className="flex-1 items-center justify-center">
          <Text className="happy-font-body-medium text-sm text-ink-muted">
            Loading...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-warm-white" edges={["top"]}>
      <View className="px-5 pt-4 pb-2 flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Text className="text-lg text-ink-muted">←</Text>
          </Pressable>
          <Text className="happy-font-heading-bold text-[22px] text-ink">
            {title}
          </Text>
        </View>
        <TimeRangeSelector value={timeRange} onChange={onTimeRangeChange} />
      </View>
      {children}
    </SafeAreaView>
  );
}
