import React, { useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import {
  usePreviousWeekSummary,
  useGenerateWeeklySummary,
} from "@/hooks/data/useWeeklyAISummaries";
import { subWeeks, startOfWeek, endOfWeek } from "date-fns";
import { AIInsightsContent } from "@/src/components/ai/AIInsightsContent";
import { WeeklySummaryCard } from "@/src/components/ai/WeeklySummaryCard";
import { AdvancedAnalyticsCharts } from "@/src/components/ai/AdvancedAnalyticsCharts";
import { useWeeklyInsightsLimit } from "@/hooks/useWeeklyInsightsLimit";
import { useRevenueCat } from "@/src/context/RevenueCatProvider";
import { useTotalJournalCount } from "@/hooks/data/useTotalJournalCount";
import { useCurrentWeekJournalCount } from "@/hooks/data/useCurrentWeekJournalCount";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Target03Icon } from "@hugeicons/core-free-icons";
import { useTranslation } from "react-i18next";
import { AIInsightsScreenHeader } from "./AIInsightsScreenHeader";
import { WeeklySummaryEmptyState } from "./WeeklySummaryEmptyState";

export default function AIInsightsScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const scrollY = useSharedValue(0);
  const insets = useSafeAreaInsets();
  const { t, i18n } = useTranslation("insights");
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  // Animated stats in card - fade out as it goes under header
  const cardStatsStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [40, 80, 100],
      [1, 0.5, 0],
      Extrapolate.CLAMP
    );

    return {
      opacity,
    };
  });

  // Get cached summary for previous week
  const {
    data: cachedSummary,
    isLoading: loadingCached,
    refetch,
  } = usePreviousWeekSummary();
  const generateSummary = useGenerateWeeklySummary();
  const previousWeek = subWeeks(new Date(), 1);
  const prevWeekStart = startOfWeek(previousWeek);
  const prevWeekEnd = endOfWeek(previousWeek);
  const dateOptions: Intl.DateTimeFormatOptions = { month: "short", day: "2-digit" };
  const prevWeekRangeLabel = `${new Intl.DateTimeFormat(i18n.language, dateOptions).format(prevWeekStart)}, ${new Intl.DateTimeFormat(i18n.language, { ...dateOptions, year: "numeric" }).format(prevWeekEnd)}`;

  const weeklySummary = cachedSummary?.weekly_summary;
  const recommendations = cachedSummary?.recommendations;
  const growthInsights = cachedSummary?.growth_insights;
  const { shouldShowPaywall } = useWeeklyInsightsLimit();
  const { presentPaywall } = useRevenueCat();
  const { data: journalStats, isLoading: isLoadingStats } =
    useTotalJournalCount();
  const { data: currentWeekCount, isLoading: isLoadingWeekCount } =
    useCurrentWeekJournalCount();

  const totalJournalCount = journalStats?.totalCount ?? 0;
  const overallAverageMood = journalStats?.averageMood ?? null;
  const formattedMood = overallAverageMood
    ? `${overallAverageMood.toFixed(1)} / 5`
    : t("screen.notAvailable");

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleGenerateSummary = async () => {
    if (totalJournalCount === 0) {
      alert(t("screen.needJournalEntry"));
      return;
    }

    if (shouldShowPaywall) {
      await presentPaywall();
      return;
    }

    try {
      await generateSummary.mutateAsync(previousWeek);
    } catch (error: any) {
      alert(error.message || t("screen.generationFailed"));
    }
  };

  const isGenerating = generateSummary.isPending;

  return (
    <SafeAreaView className="flex-1 bg-[#F8F8FF]" edges={["bottom"]}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTransparent: true,
          headerTitle: t("screen.title"),
          headerBlurEffect: "light", // <--- this enables native blur
          headerTintColor: "#000",
          headerTitleStyle: { fontWeight: "600" },
          header: () => <AIInsightsScreenHeader
            scrollY={scrollY}
            topInset={insets.top}
            weekCount={currentWeekCount || 0}
            totalEntryCount={totalJournalCount}
            formattedMood={formattedMood}
            isLoadingWeekCount={isLoadingWeekCount}
            isLoadingStats={isLoadingStats}
            labels={{ thisWeek: t("screen.thisWeek"), allEntries: t("screen.allEntries"), overallMood: t("screen.overallMood") }}
          />,
        }}
      />

      <Animated.ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingTop: 120,
          paddingHorizontal: 16,
          paddingBottom: 24,
        }}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={scrollHandler}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Header Stats */}
        <View className="mb-6 rounded-3xl overflow-hidden shadow-lg">
          <LinearGradient
            colors={["#7B61FF", "#9C7CFF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              paddingHorizontal: 24,
              paddingVertical: 20,
            }}
          >
            <Text className="text-[28px] font-cormorantSemiBold text-white mb-6">
              {t("screen.yourJourney")}
            </Text>
            <Animated.View
              style={[cardStatsStyle]}
              className="flex-row items-center justify-around"
            >
              <View className="items-center">
                <Text className="text-[40px] font-extrabold text-white leading-tight">
                  {isLoadingWeekCount ? "-" : currentWeekCount || 0}
                </Text>
                <Text className="text-sm text-white/90 mt-2 font-medium">
                  {t("screen.thisWeek")}
                </Text>
              </View>
              <View className="w-px h-14 bg-white/20" />
              <View className="items-center">
                <Text className="text-[40px] font-extrabold text-white leading-tight">
                  {isLoadingStats ? "-" : totalJournalCount}
                </Text>
                <Text className="text-sm text-white/90 mt-2 font-medium">
                  {t("screen.allEntries")}
                </Text>
              </View>
              <View className="w-px h-14 bg-white/20" />
              <View className="items-center">
                <Text className="text-[34px] font-extrabold text-white leading-tight">
                  {isLoadingStats ? "-" : formattedMood}
                </Text>
                <Text className="text-sm text-white/90 mt-2 font-medium">
                  {t("screen.overallMood")}
                </Text>
              </View>
            </Animated.View>
          </LinearGradient>
        </View>

        {/* AI Recommendations */}
        <View className="mb-10">
          <View className="flex-row justify-between items-center mb-5">
            <View className="flex-row items-center gap-2">
              <HugeiconsIcon icon={Target03Icon} size={24} color="#7B61FF" />
              <Text className="text-[22px] font-extrabold text-[#0F172A] tracking-normal font-cormorantBold">
                {t("screen.previousWeekTitle")}
              </Text>
            </View>
          </View>

          {!loadingCached && !cachedSummary && (
            <WeeklySummaryEmptyState
              dateRange={prevWeekRangeLabel}
              isGenerating={isGenerating}
              shouldShowPaywall={shouldShowPaywall}
              onGenerate={handleGenerateSummary}
              labels={{
                title: t("screen.noSummary"),
                description: t("screen.generateDescription"),
                generate: t("screen.generate"),
                unlock: t("screen.unlock"),
                generating: t("screen.generating"),
                analyzing: t("screen.analyzing"),
              }}
            />
          )}
          {loadingCached && (
            <View className="p-10 items-center">
              <ActivityIndicator size="large" color="#7B61FF" />
            </View>
          )}
        </View>

        {/* Weekly Summary - Moved above charts */}
        {cachedSummary && (
          <WeeklySummaryCard weeklySummary={weeklySummary || null} />
        )}

        {/* Premium Chart Visualizations - Using Reusable Component */}
        {cachedSummary && (
          <AdvancedAnalyticsCharts
            weeklySummary={weeklySummary || null}
            loading={isGenerating}
            showPremiumBadge={true}
            showTitle={true}
          />
        )}

        {/* Recommendations and Growth Insights (Weekly Summary moved above) */}
        <View className="mb-10">
          {cachedSummary && (
            <AIInsightsContent
              loading={isGenerating || loadingCached}
              recommendations={recommendations || []}
              growthInsights={growthInsights || []}
            />
          )}
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
}
