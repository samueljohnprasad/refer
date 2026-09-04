import React, { useState, useCallback, useMemo } from "react";
import { View, ScrollView, Pressable } from "react-native";
import { startOfWeek, endOfWeek } from "date-fns";
import WeeklyMoodChart from "@/src/components/WeeklyMoodChart";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Text } from "@/components/ui/Text";
import { SafeAreaView } from "@/src/components/tw";
import { router, Stack } from "expo-router";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  Activity01Icon,
  Brain01Icon,
  Yoga01Icon,
  WindPower01Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import {
  useInsightsOverview,
  type TimeRange,
  type CategorySummary,
} from "@/src/hooks/insights/useInsightsOverview";
import { TimeRangeSelector } from "./components/TimeRangeSelector";
import { InsightNarrativeCard } from "@/src/components/insights/InsightNarrativeCard";
import { InsightNudgeCard } from "@/src/components/insights/InsightNudgeCard";
import type { ExerciseCategory } from "@/src/types/exerciseFlow";

const CATEGORY_ICONS = {
  cbt_core: Brain01Icon,
  anxiety: Activity01Icon,
  mindfulness: Yoga01Icon,
  overthinking: WindPower01Icon,
} as const;

const CATEGORY_COLORS = {
  cbt_core: "#eef2e8",
  anxiety: "#f8fbf6",
  mindfulness: "#eef2e8",
  overthinking: "#eaf0e2",
} as const;

const CATEGORY_ROUTES: Record<ExerciseCategory, string> = {
  cbt_core: "/tabs/(tabs)/insights/cbt-deep-dive",
  anxiety: "/tabs/(tabs)/insights/anxiety-deep-dive",
  mindfulness: "/tabs/(tabs)/insights/mindfulness-deep-dive",
  overthinking: "/tabs/(tabs)/insights/overthinking-deep-dive",
};

export default function InsightsScreen() {
  const [timeRange, setTimeRange] = useState<TimeRange>("30d");
  const { data, isLoading } = useInsightsOverview(timeRange);

  const { startOfWeekDate, endOfWeekDate } = useMemo(() => {
    const today = new Date();
    return {
      startOfWeekDate: startOfWeek(today, { weekStartsOn: 0 }),
      endOfWeekDate: endOfWeek(today, { weekStartsOn: 0 }),
    };
  }, []);

  const HeaderComponent = (
    <Stack.Screen
      options={{
        title: "Your Practice",
        headerShown: true,
        headerTransparent: true,
        headerLargeTitle: true,
        // headerBlurEffect: "regular",
        headerShadowVisible: false,
        headerRight: () => (
          <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
        ),
      }}
    />
  );

  if (isLoading) {
    return (
      <>
        {HeaderComponent}
        <View className="flex-1 happy-brand-screen items-center justify-center">
          <Text className="happy-font-body-medium text-sm text-ink-muted">
            Loading insights...
          </Text>
        </View>
      </>
    );
  }

  if (!data || data.totalExercises < 3) {
    return (
      <>
        {HeaderComponent}
        <View className="flex-1 happy-brand-screen">
          <EmptyState />
        </View>
      </>
    );
  }

  return (
    <>
      {HeaderComponent}
      <ScrollView
        className="flex-1 happy-brand-screen"
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ paddingBottom: 128, paddingTop: 110 }}
      >

        <Animated.View entering={FadeInDown.duration(400).delay(200)} className="px-4 mt-5">
          <InsightNarrativeCard />
        </Animated.View>
        <Animated.View entering={FadeInDown.duration(400).delay(250)} className="px-4 mt-4">
          <InsightNudgeCard />
        </Animated.View>
        <Animated.View entering={FadeInDown.duration(400).delay(300)} className="mt-4">
          <WeeklyMoodChart
            startDate={startOfWeekDate}
            endDate={endOfWeekDate}
            title="Mood Trends"
          />
        </Animated.View>
        <Animated.View entering={FadeInDown.duration(400).delay(800)} className="px-4 mt-8">
          <Text className="text-[12px] font-bold text-sage-700 uppercase tracking-wider mb-4 ml-2">
            DEEP DIVES
          </Text>
          <View className="gap-2">
            {data.categories.map((cat) => (
              <CategoryListRow key={cat.category} summary={cat} />
            ))}
          </View>
        </Animated.View>
      </ScrollView>
    </>
  );
}



function CategoryListRow({ summary }: { summary: CategorySummary }) {
  const icon = CATEGORY_ICONS[summary.category];
  const bgColor = CATEGORY_COLORS[summary.category];

  const handlePress = useCallback(() => {
    router.push(CATEGORY_ROUTES[summary.category] as never);
  }, [summary.category]);

  return (
    <Pressable
      onPress={handlePress}
      className="flex-row items-center p-3 rounded-2xl active:bg-sage-50 transition-colors"
    >
      <View
        className="h-12 w-12 rounded-[16px] items-center justify-center mr-4"
        style={{ backgroundColor: bgColor }}
      >
        <HugeiconsIcon icon={icon} size={22} color="#2a3f2a" />
      </View>
      <View className="flex-1">
        <Text className="happy-font-heading-bold text-[17px] tracking-tight text-ink mb-0.5">
          {summary.label}
        </Text>
        <Text className="happy-font-body text-[14px] text-ink-muted">
          {summary.count > 0 ? `${summary.count} sessions` : "Not started"}
          {summary.count > 0 && summary.topStat ? ` • ${summary.topStat}` : ""}
        </Text>
      </View>
      <HugeiconsIcon icon={ArrowRight01Icon} size={20} color="#94a3b8" />
    </Pressable>
  );
}


function EmptyState() {
  const handlePress = useCallback(() => {
    router.push("/tabs/(tabs)/exercises" as never);
  }, []);

  return (
    <View className="flex-1 items-center justify-center px-8">
      <Text className="text-[48px] mb-4">🌿</Text>
      <Text className="happy-font-heading-bold text-xl text-ink text-center mb-2">
        Your patterns will appear here
      </Text>
      <Text className="happy-font-body-medium text-sm text-ink-muted text-center leading-relaxed mb-6">
        Complete a few more exercises to unlock insights about your thinking
        patterns and progress.
      </Text>
      <Pressable
        onPress={handlePress}
        className="h-12 px-6 rounded-2xl items-center justify-center happy-brand-primary-cta active:opacity-90"
      >
        <Text className="happy-font-body-bold text-sm text-white">
          Start an exercise
        </Text>
      </Pressable>
    </View>
  );
}


