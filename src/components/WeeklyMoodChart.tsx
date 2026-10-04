import React, { useMemo, useState } from "react";
import { View, LayoutChangeEvent } from "react-native";
import { Text } from "@/src/components/ui/Text";
import { addDays, differenceInCalendarDays } from "date-fns";
import { clampToMoodScore } from "@/constants/moodColors";
import useFetchMoods, { MoodsMap } from "@/hooks/data/useFetchMoods";
import { useFetchDailyMoods } from "@/hooks/data/useFetchDailyMoods";
import dayjs from "dayjs";
import { ISO_DATE_FORMAT } from "../utils/date";
import { Skeleton } from "@/src/components/ui/Skeleton";
import { useTranslation } from "react-i18next";
import {
  buildChartData,
  buildDailyChartData,
  moodLevelForScore,
  type ChartPoint,
  type DailyChartPoint,
  type MoodLevel,
  type NumericPoint,
} from "@/src/components/charts/weeklyMood/weeklyMoodChartData";
import TabSelector, { type TabType } from "@/src/components/charts/weeklyMood/MoodChartTabSelector";
import MoodChartPager from "@/src/components/charts/weeklyMood/MoodChartPager";
import { MoodChartSummary } from "@/src/components/charts/weeklyMood/MoodChartSummary";

export interface WeeklyMoodChartProps {
  startDate: Date; // inclusive
  endDate: Date; // inclusive
  title?: string;
}


export const WeeklyMoodChart: React.FC<WeeklyMoodChartProps> = ({
  startDate,
  endDate,
}) => {
  // Tab state
  const [activeTab, setActiveTab] = useState<TabType>("week");
  const { t, i18n } = useTranslation("insights");
  const locale = i18n.resolvedLanguage ?? i18n.language;

  // Pager state for sliding weeks
  const [weekIndex, setWeekIndex] = useState<number>(0);
  const spanDays: number = differenceInCalendarDays(endDate, startDate) + 1;

  const effectiveStartDate: Date = useMemo(
    () => addDays(startDate, weekIndex * spanDays),
    [startDate, weekIndex, spanDays],
  );
  const effectiveEndDate: Date = useMemo(
    () => addDays(endDate, weekIndex * spanDays),
    [endDate, weekIndex, spanDays],
  );

  // Pager state for sliding days
  const [dayIndex, setDayIndex] = useState<number>(0);
  const today = useMemo(() => new Date(), []);
  const effectiveDay: Date = useMemo(
    () => addDays(today, dayIndex),
    [today, dayIndex],
  );
  const effectiveDayStr = useMemo(
    () => dayjs(effectiveDay).format(ISO_DATE_FORMAT),
    [effectiveDay],
  );

  // Fetch daily data for the current day (for Day tab average)
  const { groupedMoods: dailyData } = useFetchDailyMoods({
    targetDate: effectiveDayStr,
  });

  // Fetch weekly data
  const {
    data: weeklyData,
    isLoading: isWeeklyLoading,
    isError: isWeeklyError,
  } = useFetchMoods({
    visibleStartDate: dayjs(startDate).startOf("month").format(ISO_DATE_FORMAT),
    visibleEndDate: dayjs(startDate).endOf("month").format(ISO_DATE_FORMAT),
  });

  // For day view, loading/error is handled per-page
  const isLoading = activeTab === "week" ? isWeeklyLoading : false;
  const isError = activeTab === "week" ? isWeeklyError : false;

  // Calculate average for weekly view
  const weeklyPoints: ChartPoint[] = useMemo(
    () =>
      buildChartData(
        effectiveStartDate,
        effectiveEndDate,
        (weeklyData as MoodsMap) ?? new Map<string, number>(),
        locale,
      ),
    [effectiveStartDate, effectiveEndDate, weeklyData, locale],
  );

  const weeklyNumericPoints: NumericPoint[] = weeklyPoints
    .map((p, idx) => (p.y !== null ? { x: idx + 1, y: p.y, label: p.x } : null))
    .filter((p) => p !== null);

  const weeklyAvg: number =
    weeklyNumericPoints.length > 0
      ? weeklyNumericPoints.reduce((s, p) => s + p.y, 0) /
      weeklyNumericPoints.length
      : 0;
  const weeklyAvgRounded = clampToMoodScore(weeklyAvg);
  const weeklyAvgLabel: MoodLevel = moodLevelForScore(weeklyAvgRounded);

  // Calculate average for daily view
  const dailyPoints: DailyChartPoint[] = useMemo(
    () => buildDailyChartData(dailyData ?? new Map(), locale),
    [dailyData, locale],
  );

  const dailyNumericPoints: NumericPoint[] = dailyPoints
    .map((p, idx) => (p.y !== null ? { x: idx + 1, y: p.y, label: p.x } : null))
    .filter((p): p is NumericPoint => p !== null);

  const dailyAvg: number =
    dailyNumericPoints.length > 0
      ? dailyNumericPoints.reduce((s, p) => s + p.y, 0) /
      dailyNumericPoints.length
      : 0;
  const dailyAvgRounded = clampToMoodScore(dailyAvg);
  const dailyAvgLabel: MoodLevel = moodLevelForScore(dailyAvgRounded);

  // Use daily average for day view, weekly average for week view
  const avgRounded = activeTab === "day" ? dailyAvgRounded : weeklyAvgRounded;
  const avgLabel = activeTab === "day" ? dailyAvgLabel : weeklyAvgLabel;
  const avg = activeTab === "day" ? dailyAvg : weeklyAvg;

  // Determine day view title based on offset
  const getDayTitle = (): string => {
    if (dayIndex === 0) return t("chart.weeklyMood.headers.todayMood");
    if (dayIndex === -1) return t("chart.weeklyMood.headers.yesterdayMood");
    const weekday = new Intl.DateTimeFormat(locale, { weekday: "long" }).format(effectiveDay);
    return t("chart.weeklyMood.headers.weekdayMood", { weekday });
  };

  const headerTitle: string =
    activeTab === "week" ? t("chart.weeklyMood.headers.thisWeekMood") : getDayTitle();
  const formatDate = (date: Date, options: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat(locale, options).format(date);
  const headerSubtitle: string =
    activeTab === "week"
      ? `${formatDate(effectiveStartDate, { month: "long", day: "numeric" })} - ${formatDate(effectiveEndDate, { day: "numeric", year: "numeric" })}`
      : formatDate(effectiveDay, { month: "long", day: "numeric", year: "numeric" });

  const chartHeight: number = 330;
  const padding = { top: 10, bottom: 26, left: 10, right: 35 } as const;
  const [layoutWidth, setLayoutWidth] = useState<number>(0);
  const onLayout = (e: LayoutChangeEvent): void => {
    setLayoutWidth(e.nativeEvent.layout.width);
  };


  if (isLoading && layoutWidth === 0) {
    return (
      <View className="w-full gap-2">
        <View className="flex-row items-center justify-between px-1">
          <Text className="text-[11px] text-ink-muted font-bold uppercase tracking-widest">
            {headerTitle}
          </Text>
        </View>
        <View className="p-2">
          <View className="gap-3 py-4">
            <Skeleton height={12} width="40%" />
            <Skeleton height={160} radius={12} />
            <View className="flex-row justify-between">
              <Skeleton height={10} width="15%" />
              <Skeleton height={10} width="15%" />
              <Skeleton height={10} width="15%" />
              <Skeleton height={10} width="15%" />
              <Skeleton height={10} width="15%" />
            </View>
          </View>
        </View>
      </View>
    );
  }
  if (isError) {
    return (
      <View className="w-full gap-2">
        <View className="flex-row items-center justify-between px-1">
          <Text className="text-[11px] text-ink-muted font-bold uppercase tracking-widest">
            {headerTitle}
          </Text>
        </View>
        <View className="p-4 rounded-xl bg-red-50">
          <Text className="text-red-500">{t("chart.weeklyMood.error")}</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="w-full gap-2">
      <View className="flex-row items-center justify-between px-1">
        <Text className="text-[11px] text-ink-muted font-bold uppercase tracking-widest">
          {headerTitle}
        </Text>
      </View>

      <View className="py-2">
        {/* Tab Header */}
        <View className="px-4 mb-4">
          <TabSelector activeTab={activeTab} onTabChange={setActiveTab} />
        </View>

        <MoodChartSummary
          subtitle={headerSubtitle}
          average={avg}
          roundedAverage={avgRounded}
          mood={avgLabel}
        />

        <MoodChartPager
          activeTab={activeTab}
          weekIndex={weekIndex}
          setWeekIndex={setWeekIndex}
          dayIndex={dayIndex}
          setDayIndex={setDayIndex}
          startDate={startDate}
          endDate={endDate}
          spanDays={spanDays}
          today={today}
          weeklyData={weeklyData as MoodsMap | undefined}
          isWeeklyLoading={isWeeklyLoading}
          layoutWidth={layoutWidth}
          onLayout={onLayout}
          height={chartHeight}
          padding={padding}
          locale={locale}
        />
      </View>
    </View>
  );
};

export default WeeklyMoodChart;
