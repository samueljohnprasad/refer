import React, { useState, useCallback, useMemo } from "react";
import { View, ScrollView, Pressable } from "react-native";
import { useTranslation } from "react-i18next";
import { startOfWeek, endOfWeek } from "date-fns";
import WeeklyMoodChart from "@/src/components/WeeklyMoodChart";
import { Text } from "@/components/ui/Text";
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
import { DeterministicInsightCard } from "@/src/components/insights/DeterministicInsightCard";
import type { ExerciseCategory } from "@/src/types/exerciseFlow";
import { PracticeEmptyState } from "./components/PracticeEmptyState";

const CATEGORY_ICONS = {
  cbt_core: Brain01Icon,
  anxiety: Activity01Icon,
  mindfulness: Yoga01Icon,
  overthinking: WindPower01Icon,
} as const;

const CATEGORY_ROUTES: Record<ExerciseCategory, string> = {
  cbt_core: "/tabs/(tabs)/insights/cbt-deep-dive",
  anxiety: "/tabs/(tabs)/insights/anxiety-deep-dive",
  mindfulness: "/tabs/(tabs)/insights/mindfulness-deep-dive",
  overthinking: "/tabs/(tabs)/insights/overthinking-deep-dive",
};

export default function InsightsScreen() {
  const { t } = useTranslation("common");
  const [timeRange, setTimeRange] = useState<TimeRange>("30d");
  const { data, isLoading } = useInsightsOverview(timeRange);
  const handleStartExercise = useCallback(() => {
    router.push("/tabs/(tabs)/exercises" as never);
  }, []);

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
        title: t("timelineAnalytics.title"),
        headerShown: true,
        headerTransparent: false,
        headerLargeTitle: false,
        headerShadowVisible: false,
        headerBackButtonDisplayMode: "minimal",
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
            {t("timelineAnalytics.loading")}
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
          <PracticeEmptyState onChooseExercise={handleStartExercise} />
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
        <View className="px-4 mt-5">
          <DeterministicInsightCard />
        </View>
        <View className="px-4 mt-5">
          <InsightNarrativeCard />
        </View>
        <View className="px-4 mt-4">
          <InsightNudgeCard />
        </View>
        <View className="mt-4">
          <WeeklyMoodChart
            startDate={startOfWeekDate}
            endDate={endOfWeekDate}
            title={t("timelineAnalytics.moodTrends")}
          />
        </View>
        <View className="px-4 mt-8">
          <Text className="text-[12px] font-bold text-sage-700 uppercase tracking-wider mb-4 ml-2">
            {t("timelineAnalytics.deepDives")}
          </Text>
          <View className="gap-2">
            {data.categories.map((cat) => (
              <CategoryListRow key={cat.category} summary={cat} />
            ))}
          </View>
        </View>
      </ScrollView>
    </>
  );
}



function CategoryListRow({ summary }: { summary: CategorySummary }) {
  const { t } = useTranslation("common");
  const icon = CATEGORY_ICONS[summary.category];

  const handlePress = useCallback(() => {
    router.push(CATEGORY_ROUTES[summary.category] as never);
  }, [summary.category]);

  return (
    <Pressable
      onPress={handlePress}
      className="flex-row items-center p-3 rounded-2xl active:bg-sage-50 transition-colors"
    >
      <View className="mr-4 h-10 w-10 items-center justify-center">
        <HugeiconsIcon icon={icon} size={22} color="#2a3f2a" />
      </View>
      <View className="flex-1">
        <Text className="happy-font-heading-bold text-[17px] tracking-tight text-ink mb-0.5">
          {summary.label}
        </Text>
        <Text className="happy-font-body text-[14px] text-ink-muted">
          {summary.count > 0 ? t("timelineAnalytics.sessions", { count: summary.count }) : t("timelineAnalytics.notStarted")}
          {summary.count > 0 && summary.topStat ? ` • ${summary.topStat}` : ""}
        </Text>
      </View>
      <HugeiconsIcon icon={ArrowRight01Icon} size={20} color="#94a3b8" />
    </Pressable>
  );
}
