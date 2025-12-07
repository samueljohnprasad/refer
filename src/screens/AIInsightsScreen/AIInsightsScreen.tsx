import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  useWindowDimensions,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolateColor,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useUserProfile } from "@/hooks/data/useUserProfile";
import {
  usePreviousWeekSummary,
  useGenerateWeeklySummary,
} from "@/hooks/data/useWeeklyAISummaries";
import { subWeeks, format, startOfWeek, endOfWeek } from "date-fns";
import { AIInsightsContent } from "@/src/components/ai/AIInsightsContent";
import { WeeklySummaryCard } from "@/src/components/ai/WeeklySummaryCard";
import { AdvancedAnalyticsCharts } from "@/src/components/ai/AdvancedAnalyticsCharts";
import { BlurView } from "expo-blur";
import { useWeeklyInsightsLimit } from "@/hooks/useWeeklyInsightsLimit";
import { useRevenueCat } from "@/src/context/RevenueCatProvider";
import { useTotalJournalCount } from "@/hooks/data/useTotalJournalCount";
import { useCurrentWeekJournalCount } from "@/hooks/data/useCurrentWeekJournalCount";

export default function AIInsightsScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  // Animated header background color
  const headerAnimatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      scrollY.value,
      [0, 100, 150],
      [
        "rgba(123, 97, 255, 0)",
        "rgba(123, 97, 255, 0.5)",
        "rgba(123, 97, 255, 1)",
      ]
    );

    return {
      backgroundColor,
    };
  });

  // Animated stats in header - fade in as card passes under
  const headerStatsStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [40, 90, 200],
      [0, 0, 1],
      Extrapolate.CLAMP
    );

    return {
      opacity,
    };
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

  const { data: profile } = useUserProfile();

  // Get cached summary for previous week
  const {
    data: cachedSummary,
    isLoading: loadingCached,
    refetch,
  } = usePreviousWeekSummary();
  const generateSummary = useGenerateWeeklySummary();
  const { height } = useWindowDimensions();
  const previousWeek = subWeeks(new Date(), 1);
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

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleGenerateSummary = async () => {
    if (shouldShowPaywall) {
      await presentPaywall();
      return;
    }

    try {
      await generateSummary.mutateAsync(previousWeek);
    } catch (error: any) {
      alert(error.message || "Failed to generate AI summary");
    }
  };

  const isGenerating = generateSummary.isPending;

  return (
    <SafeAreaView className="flex-1 bg-[#F8F8FF]" edges={["bottom"]}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTransparent: true,
          headerTitle: "AI Insights",
          headerBlurEffect: "light", // <--- this enables native blur
          headerTintColor: "#000",
          headerTitleStyle: { fontWeight: "600" },
          header: () => {
            return (
              <Animated.View
                style={[
                  {
                    height: height * 0.14,
                    justifyContent: "center",
                    alignItems: "center",
                  },
                  headerAnimatedStyle,
                ]}
              >
                <BlurView
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                  }}
                  intensity={50}
                  tint="light"
                />

                {/* Animated Stats in Header */}
                <Animated.View
                  style={[headerStatsStyle]}
                  className="flex-row items-center justify-around w-full px-5 mt-8"
                >
                  <View className="items-center">
                    <Text className="text-xl font-bold text-white">
                      {isLoadingWeekCount ? "-" : currentWeekCount || 0}
                    </Text>
                    <Text className="text-[11px] text-white opacity-90">
                      This Week
                    </Text>
                  </View>

                  <View className="w-px h-8 bg-white opacity-30" />

                  <View className="items-center">
                    <Text className="text-xl font-bold text-white">
                      {isLoadingStats ? "-" : totalJournalCount}
                    </Text>
                    <Text className="text-[11px] text-white opacity-90">
                      All Entries
                    </Text>
                  </View>

                  <View className="w-px h-8 bg-white opacity-30" />

                  <View className="items-center">
                    <Text className="text-xl font-bold text-white">
                      {isLoadingStats
                        ? "-"
                        : overallAverageMood?.toFixed(1) || "N/A"}
                    </Text>
                    <Text className="text-[11px] text-white opacity-90">
                      Overall Mood
                    </Text>
                  </View>
                </Animated.View>
              </Animated.View>
            );
          },
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
              Your Journey
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
                  This Week
                </Text>
              </View>
              <View className="w-px h-14 bg-white/20" />
              <View className="items-center">
                <Text className="text-[40px] font-extrabold text-white leading-tight">
                  {isLoadingStats ? "-" : totalJournalCount}
                </Text>
                <Text className="text-sm text-white/90 mt-2 font-medium">
                  All Entries
                </Text>
              </View>
              <View className="w-px h-14 bg-white/20" />
              <View className="items-center">
                <Text className="text-[40px] font-extrabold text-white leading-tight">
                  {isLoadingStats
                    ? "-"
                    : overallAverageMood?.toFixed(1) || "N/A"}
                </Text>
                <Text className="text-sm text-white/90 mt-2 font-medium">
                  Overall Mood
                </Text>
              </View>
            </Animated.View>
          </LinearGradient>
        </View>

        {/* AI Recommendations */}
        <View className="mb-10">
          <View className="flex-row justify-between items-center mb-5">
            <Text className="text-[22px] font-extrabold text-[#0F172A] tracking-wide font-cormorantBold">
              🎯 AI Insights for Previous Week
            </Text>
          </View>

          {!loadingCached && !cachedSummary && (
            <View className="bg-white rounded-2xl p-10 items-center">
              <Text className="text-[64px] mb-4">🤖</Text>
              <Text className="text-[22px] font-bold text-[#0F172A] mb-2">
                No AI Summary Yet
              </Text>
              <Text className="text-[15px] text-[#6B7280] text-center mb-6 leading-6">
                Generate personalized AI insights for the week of{"\n"}
                {format(previousWeek, "MMM dd, yyyy")}
              </Text>

              <TouchableOpacity
                className="rounded-2xl overflow-hidden w-full"
                onPress={handleGenerateSummary}
                disabled={isGenerating}
              >
                <LinearGradient
                  colors={
                    isGenerating ? ["#999", "#777"] : ["#7B61FF", "#9C7CFF"]
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  className="flex-row items-center justify-center py-4 gap-2"
                  style={{
                    paddingVertical: 16,
                    gap: 8,
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {isGenerating && (
                    <ActivityIndicator size="small" color="#FFF" />
                  )}
                  {!isGenerating && (
                    <Feather name="zap" size={20} color="#FFF" />
                  )}
                  <Text className="text-base font-bold text-white font-jakarta">
                    {isGenerating
                      ? "Generating..."
                      : "Get AI Insights for Past Week"}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              {isGenerating && (
                <Text className="text-[13px] text-[#6B7280] mt-4 text-center italic">
                  Analyzing your journals with AI... This may take a minute.
                </Text>
              )}
            </View>
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
              weeklySummary={null}
              recommendations={recommendations || []}
              growthInsights={growthInsights || []}
            />
          )}
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
}
