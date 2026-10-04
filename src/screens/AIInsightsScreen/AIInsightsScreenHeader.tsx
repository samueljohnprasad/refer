import React from "react";
import { Text, View } from "react-native";
import Animated, {
  Extrapolate,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  type SharedValue,
} from "react-native-reanimated";
import { BlurView } from "expo-blur";

interface AIInsightsScreenHeaderProps {
  scrollY: SharedValue<number>;
  topInset: number;
  weekCount: number;
  totalEntryCount: number;
  formattedMood: string;
  isLoadingWeekCount: boolean;
  isLoadingStats: boolean;
  labels: { thisWeek: string; allEntries: string; overallMood: string };
}

export function AIInsightsScreenHeader({
  scrollY,
  topInset,
  weekCount,
  totalEntryCount,
  formattedMood,
  isLoadingWeekCount,
  isLoadingStats,
  labels,
}: AIInsightsScreenHeaderProps) {
  const backgroundStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      scrollY.value,
      [0, 100, 150],
      ["rgba(123, 97, 255, 0)", "rgba(123, 97, 255, 0.5)", "rgba(123, 97, 255, 1)"],
    ),
  }));
  const statsStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [40, 90, 200], [0, 0, 1], Extrapolate.CLAMP),
  }));

  return (
    <Animated.View
      style={[{ paddingTop: topInset, minHeight: topInset + 60, justifyContent: "flex-end", overflow: "hidden" }, backgroundStyle]}
    >
      <BlurView style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }} intensity={50} tint="light" />
      <View className="pb-4 pt-2">
        <Animated.View style={statsStyle} className="flex-row items-center justify-around w-full px-5 mt-2">
          <HeaderStat value={isLoadingWeekCount ? "-" : weekCount} label={labels.thisWeek} />
          <View className="w-px h-8 bg-white opacity-30" />
          <HeaderStat value={isLoadingStats ? "-" : totalEntryCount} label={labels.allEntries} />
          <View className="w-px h-8 bg-white opacity-30" />
          <HeaderStat value={isLoadingStats ? "-" : formattedMood} label={labels.overallMood} />
        </Animated.View>
      </View>
    </Animated.View>
  );
}

function HeaderStat({ value, label }: { value: string | number; label: string }) {
  return (
    <View className="items-center">
      <Text className="text-xl font-bold text-white">{value}</Text>
      <Text className="text-[11px] text-white opacity-90">{label}</Text>
    </View>
  );
}
