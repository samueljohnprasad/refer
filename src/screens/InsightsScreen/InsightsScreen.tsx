import React, { useState, useCallback, useMemo } from "react";
import { View, ScrollView, Pressable } from "react-native";
import { useTranslation } from "react-i18next";
import { startOfWeek, endOfWeek } from "date-fns";
import { Text } from "@/components/ui/Text";
import { router, Stack } from "expo-router";
import { Feather } from "@expo/vector-icons";
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
import { HelpRowWithSheet } from "@/src/domains/home/ui/containers/HelpRowWithSheet";
import { PracticeMoodChart } from "./components/PracticeMoodChart";
import { PracticeNextCard } from "./components/PracticeNextCard";
import { useMoodWeek } from "@/src/hooks/insights/useMoodWeek";
import { useUntriedExercise } from "@/src/hooks/insights/useUntriedExercise";
import { PracticeWinCard } from "./components/PracticeWinCard";
import { PracticeStatsPair } from "./components/PracticeStatsPair";
import type { ExerciseCategory } from "@/src/types/exerciseFlow";
import { PracticeEmptyState } from "./components/PracticeEmptyState";
import { usePracticeCounts } from "@/src/domains/exercises/ui/containers/usePracticeCounts";
import { useGardenSeen } from "@/src/domains/exercises/ui/containers/useGardenSeen";
import { GrowLeaf } from "./components/GrowLeaf";
import { getCategoryBadgeTheme } from "@/src/screens/ExercisesScreen/exerciseScreenUtils";

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
  const { data, isLoading, isError } = useInsightsOverview(timeRange);
  const { data: counts, isFetching: countsFetching } = usePracticeCounts();
  // record what was shown only from fresh counts, so a stale cache can't lower the seen number
  const { ready: gardenReady, prev: gardenPrev } = useGardenSeen(countsFetching ? undefined : counts);
  const untried = useUntriedExercise();
  const handleStartExercise = useCallback(() => {
    router.push("/tabs/(tabs)/exercises" as never);
  }, []);

  const { startOfWeekDate, endOfWeekDate } = useMemo(() => {
    const today = new Date();
    return {
      startOfWeekDate: startOfWeek(today, { weekStartsOn: 1 }),
      endOfWeekDate: endOfWeek(today, { weekStartsOn: 1 }),
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

  if (isLoading || !gardenReady) {
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

  if (isError && !data) {
    return (
      <>
        {HeaderComponent}
        <View className="flex-1 happy-brand-screen items-center justify-center px-8">
          <Text className="happy-font-body-medium text-sm text-ink-muted text-center">
            {t("timelineAnalytics.error", { defaultValue: "Couldn't load your practice. Check your connection and try again." })}
          </Text>
        </View>
      </>
    );
  }

  if (!data || data.lifetimeExercises < 3) {
    return (
      <>
        {HeaderComponent}
        <View className="flex-1 happy-brand-screen">
          <PracticeEmptyState completedCount={data?.lifetimeExercises ?? 0} seenCount={gardenPrev?.lifetime} onChooseExercise={handleStartExercise} />
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
        {data.reframeWin && (
          <View className="px-4 mt-5">
            <PracticeWinCard win={data.reframeWin} />
          </View>
        )}
        <View className="px-4 mt-2">
          <PracticeStatsPair
            stats={[
              { icon: "feather", value: String(data.totalExercises), label: t("timelineAnalytics.exercisesDone", { defaultValue: "exercises done" }) },
              { icon: "sun", value: `${data.doneBeforeNoon} of ${data.totalExercises}`, label: t("timelineAnalytics.beforeNoon", { defaultValue: "done before noon" }) },
            ]}
          />
        </View>
        <View className="px-4 mt-5">
          <InsightNarrativeCard />
        </View>
        <View className="px-4 mt-4">
          <InsightNudgeCard />
        </View>
        {untried && (
          <View className="px-4 mt-5">
            <PracticeNextCard exercise={untried} />
          </View>
        )}
        <View className="px-4 mt-8">
          <MoodWeekSection start={startOfWeekDate} end={endOfWeekDate} />
        </View>
        <View className="px-4 mt-8">
          <Text className="text-t-lead font-bold tracking-tight text-happy-label mb-3">
            {t("timelineAnalytics.deepDives")}
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {data.categories.map((cat) => (
              <CategoryGridTile key={cat.category} summary={cat} seenCount={gardenPrev?.topics[cat.category]} />
            ))}
          </View>
        </View>
        <View className="px-4">
          <HelpRowWithSheet />
        </View>
      </ScrollView>
    </>
  );
}



function MoodWeekSection({ start, end }: { start: Date; end: Date }) {
  const { t, i18n } = useTranslation("common");
  const { week } = useMoodWeek(start, end, i18n.resolvedLanguage ?? i18n.language);
  return (
    <PracticeMoodChart
      week={week}
      title={t("timelineAnalytics.moodTrends", { defaultValue: "Mood this week" })}
      caption={t("timelineAnalytics.moodCaption", { defaultValue: "Mood you logged each day, out of 5. A leaf marks a day you practised." })}
    />
  );
}

// ponytail: 2-col .garden grid matching .agents/exercises.html's Practice tab — one plot per
// category, colored by its hue, sessions-or-"not tried yet" as the small print.
function CategoryGridTile({ summary, seenCount }: { summary: CategorySummary; seenCount?: number }) {
  const { t } = useTranslation("common");
  const icon = CATEGORY_ICONS[summary.category];
  const theme = getCategoryBadgeTheme(summary.category);

  const handlePress = useCallback(() => {
    router.push(CATEGORY_ROUTES[summary.category] as never);
  }, [summary.category]);

  return (
    <Pressable
      onPress={handlePress}
      className="basis-[48%] grow min-h-[136px] pt-3 pr-3 pb-4 pl-4 rounded-[20px] active:opacity-80"
      style={{ backgroundColor: theme.bg }}
    >
      <View className="flex-row items-start justify-between">
        <View className="w-10 h-10 rounded-xl items-center justify-center bg-white">
          <HugeiconsIcon icon={icon} size={20} color={theme.iconColor} />
        </View>
        <HugeiconsIcon icon={ArrowRight01Icon} size={18} color={theme.text} />
      </View>
      <Text className="font-bold leading-tight mt-auto" style={{ color: theme.text }}>
        {summary.label}
      </Text>
      <View className="flex-row items-center gap-0.5 mt-2 min-h-4">
        {summary.count + summary.inProgress > 0 ? (
          <>
            {Array.from({ length: Math.min(summary.count, 6) }, (_, i) => <GrowLeaf key={i} order={seenCount === undefined || i < seenCount ? null : i - seenCount} />)}
            {summary.inProgress > 0 && <Feather name="feather" size={14} color="#44633f" style={{ opacity: 0.4 }} />}
          </>
        ) : (
          <View className="w-3 h-3 rounded-full border-[1.5px] border-dashed" style={{ borderColor: theme.text }} />
        )}
      </View>
      <Text className="text-[13px] font-semibold mt-1" style={{ color: theme.text }}>
        {[
          summary.count > 0 ? t("timelineAnalytics.sessions", { count: summary.count }) : null,
          summary.inProgress > 0 ? t("timelineAnalytics.inProgress", { count: summary.inProgress, defaultValue: "{{count}} in progress" }) : null,
        ].filter(Boolean).join(" · ") || t("timelineAnalytics.notStarted")}
      </Text>
    </Pressable>
  );
}
