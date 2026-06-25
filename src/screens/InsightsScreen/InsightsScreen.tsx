import React, { useState, useCallback } from "react";
import { View, ScrollView, Pressable, StyleSheet } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Text } from "@/components/ui/text";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, Stack } from "expo-router";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  Activity01Icon,
  Brain01Icon,
  Yoga01Icon,
  WindPower01Icon,
  ArrowLeft01Icon,
} from "@hugeicons/core-free-icons";
import {
  useInsightsOverview,
  type TimeRange,
  type CategorySummary,
} from "@/src/hooks/insights/useInsightsOverview";
import { ActivityHeatmap } from "./components/ActivityHeatmap";
import { TimeRangeSelector } from "./components/TimeRangeSelector";
import { WeeklySummaryCard } from "@/src/components/insights/WeeklySummaryCard";
import { ThoughtPatternsCard } from "@/src/components/insights/ThoughtPatternsCard";
import { PersonalEffectivenessCard } from "@/src/components/insights/PersonalEffectivenessCard";
import { SkillProgressionCard } from "@/src/components/insights/SkillProgressionCard";
import { TriggerClusterCard } from "@/src/components/insights/TriggerClusterCard";
import { BeliefDecayCard } from "@/src/components/insights/BeliefDecayCard";
import { InsightNarrativeCard } from "@/src/components/insights/InsightNarrativeCard";
import { TherapistNotebookCard } from "@/src/components/insights/TherapistNotebookCard";
import { useTemporalPatterns } from "@/src/hooks/insights/useTemporalPatterns";
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
        style={nutrieStyles.screenBg}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ paddingBottom: 128, paddingTop: 110 }}
      >
        <Animated.View entering={FadeInDown.duration(400).delay(100)}>
          <StatsRow
            total={data.totalExercises}
            avgShift={data.avgEmotionShift}
            streak={data.currentStreak}
            successRate={data.reframeSuccessRate}
          />
        </Animated.View>
        <Animated.View entering={FadeInDown.duration(400).delay(200)} className="px-4 mt-5">
          <InsightNarrativeCard />
        </Animated.View>
        <Animated.View entering={FadeInDown.duration(400).delay(300)} className="px-4 mt-4">
          <WeeklySummaryCard />
        </Animated.View>
        <Animated.View entering={FadeInDown.duration(400).delay(400)} className="px-4 mt-4">
          <SkillProgressionCard />
        </Animated.View>
        <Animated.View entering={FadeInDown.duration(400).delay(450)}>
          <TemporalPatternRow />
        </Animated.View>
        <Animated.View entering={FadeInDown.duration(400).delay(500)} className="px-4 mt-4">
          <PersonalEffectivenessCard />
        </Animated.View>
        <Animated.View entering={FadeInDown.duration(400).delay(550)} className="px-4 mt-4">
          <TriggerClusterCard />
        </Animated.View>
        <Animated.View entering={FadeInDown.duration(400).delay(600)} className="px-4 mt-4">
          <BeliefDecayCard />
        </Animated.View>
        <Animated.View entering={FadeInDown.duration(400).delay(650)} className="px-4 mt-4">
          <TherapistNotebookCard />
        </Animated.View>
        <Animated.View entering={FadeInDown.duration(400).delay(700)} className="px-4 mt-4">
          <ThoughtPatternsCard />
        </Animated.View>
        <Animated.View entering={FadeInDown.duration(400).delay(750)} className="px-4 mt-6">
          <Text style={nutrieStyles.sectionTitle}>Activity</Text>
          <ActivityHeatmap data={data.heatmap} />
        </Animated.View>
        <Animated.View entering={FadeInDown.duration(400).delay(800)} className="px-4 mt-8">
          <Text style={nutrieStyles.sectionTitle}>Categories</Text>
          <View className="flex-row flex-wrap gap-3">
            {data.categories.map((cat) => (
              <CategoryCard key={cat.category} summary={cat} />
            ))}
          </View>
        </Animated.View>
      </ScrollView>
    </>
  );
}

function StatsRow({
  total,
  avgShift,
  streak,
  successRate,
}: {
  total: number;
  avgShift: number | null;
  streak: number;
  successRate: number | null;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
      className="mt-4"
    >
      <StatCard label="Exercises" value={String(total)} />
      <StatCard
        label="Avg Shift"
        value={avgShift !== null ? `−${avgShift.toFixed(1)}` : "—"}
      />
      <StatCard label="Streak" value={streak > 0 ? `${streak}d` : "—"} />
      <StatCard
        label="Success"
        value={successRate !== null ? `${Math.round(successRate * 100)}%` : "—"}
      />
    </ScrollView>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <View style={nutrieStyles.statCard}>
      <Text style={nutrieStyles.statValue}>
        {value}
      </Text>
      <Text style={nutrieStyles.statLabel}>
        {label}
      </Text>
    </View>
  );
}

function CategoryCard({ summary }: { summary: CategorySummary }) {
  const icon = CATEGORY_ICONS[summary.category];
  const bgColor = CATEGORY_COLORS[summary.category];

  const handlePress = useCallback(() => {
    if (summary.count > 0) {
      router.push(CATEGORY_ROUTES[summary.category] as never);
    }
  }, [summary.category, summary.count]);

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        nutrieStyles.categoryCard,
        pressed && { opacity: 0.92, transform: [{ scale: 0.985 }] }
      ]}
    >
      <View
        style={[nutrieStyles.categoryIconWell, { backgroundColor: bgColor }]}
      >
        <HugeiconsIcon icon={icon} size={24} color="#2a3f2a" />
      </View>
      <Text style={nutrieStyles.categoryLabel}>
        {summary.label}
      </Text>
      <Text style={nutrieStyles.categorySessions}>
        {summary.count > 0 ? `${summary.count} sessions` : "Not started"}
      </Text>
      {summary.count > 0 && summary.topStat && (
        <Text style={nutrieStyles.categoryTopStat}>
          {summary.topStat}
        </Text>
      )}
    </Pressable>
  );
}

function TemporalPatternRow() {
  const { data } = useTemporalPatterns();
  if (!data) return null;

  return (
    <View className="px-5 mt-4">
      <View className="happy-brand-card rounded-2xl p-4 flex-row flex-wrap gap-3">
        {data.timeOfDay && (
          <View className="flex-row items-center gap-1.5">
            <Text className="text-[13px]">🕙</Text>
            <Text className="happy-font-body-medium text-[12px] text-ink-soft">
              {data.timeOfDay.label}
            </Text>
          </View>
        )}
        {data.dayOfWeek && (
          <View className="flex-row items-center gap-1.5">
            <Text className="text-[13px]">📅</Text>
            <Text className="happy-font-body-medium text-[12px] text-ink-soft">
              {data.dayOfWeek.label}
            </Text>
          </View>
        )}
      </View>
    </View>
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

// ─── Nutrie-style Stylesheet ──────────────────────────────────────────────────
export const nutrieStyles = StyleSheet.create({
  screenBg: {
    flex: 1,
    backgroundColor: "#F7F7F8",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.03)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  inlinePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: "#F4F4F5",
    borderWidth: 1,
    borderColor: "#E0E0E2",
  },
  inlinePillText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#8E8E93",
  },
  statCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.03)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
    alignItems: "center",
    minWidth: 90,
  },
  statValue: {
    fontSize: 26,
    fontWeight: "800",
    color: "#1C1C1E",
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    color: "#8E8E93",
    marginTop: 4,
  },
  categoryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 16,
    flex: 1,
    minWidth: "45%",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.03)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  categoryIconWell: {
    height: 48,
    width: 48,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  categoryLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1C1C1E",
    letterSpacing: -0.2,
  },
  categorySessions: {
    fontSize: 13,
    color: "#8E8E93",
    marginTop: 2,
  },
  categoryTopStat: {
    fontSize: 12,
    fontWeight: "600",
    color: "#22C55E",
    marginTop: 6,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1C1C1E",
    marginBottom: 12,
    letterSpacing: -0.2,
  }
});
