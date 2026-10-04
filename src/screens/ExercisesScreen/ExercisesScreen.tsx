import { useTranslation } from "react-i18next";
import { useCallback, useEffect, useMemo, useState, Suspense, type ReactElement } from "react";
import { ScrollView, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useHeaderHeight } from "expo-router/react-navigation";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getExerciseConfig, getExercisesGrouped } from "@/src/data/exerciseRegistry";
import type { ExerciseConfig } from "@/src/types/exerciseFlow";
import { useRecentExercises, trackRecentExercise } from "@/src/hooks/useRecentExercises";
import { useExerciseRecommendation } from "@/src/hooks/insights/useExerciseRecommendation";
import { useCompletedExercisesCount, type HistoryLogItem } from "./hooks/useCBTHistory";
import { useCircularRevealNavigate } from "@/src/hooks/useCircularRevealNavigate";
import { useFreemiumGate } from "@/src/hooks/useFreemiumGate";
import { ExercisesTabHeader } from "./components/ExercisesTabHeader";
import { EmptyDiscoverState } from "./components/ExercisesTabEmptyStates";
import { ExerciseTimeline } from "./components/ExerciseTimeline";
import { JumpBackInShelf, DiscoverSection } from "./components/ExerciseDiscoverySection";
import { TimelineSkeleton } from "@/src/components/ui/Timeline/TimelineSkeleton";
import { getCategoryBadgeTheme, buildExerciseRoute } from "./exerciseScreenUtils";

type TabKey = "discover" | "log";
const TAB_KEYS = ["discover", "log"] as const;

function isTabKey(value: unknown): value is TabKey {
  return typeof value === "string" && TAB_KEYS.includes(value as TabKey);
}

export default function ExercisesScreen(): ReactElement {
  const { t } = useTranslation("exercises");
  const [activeTab, setActiveTab] = useState<TabKey>("discover");
  const params = useLocalSearchParams<{ tab?: string }>();
  const recommendation = useExerciseRecommendation();
  const exerciseGroups = useMemo(() => getExercisesGrouped(), []);
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  const { data: completedCount = 0 } = useCompletedExercisesCount();
  const { hasPro, requirePro } = useFreemiumGate();
  const { recentIds } = useRecentExercises();
  const tabPillStyle = useMemo(() => ({ transform: [{ scale: 1 }] }), []);

  useEffect(() => {
    if (isTabKey(params.tab)) setActiveTab(params.tab);
  }, [params.tab]);

  const allExercises = useMemo(() => exerciseGroups.flatMap((group) => group.exercises), [exerciseGroups]);
  const defaultJumpBackInIds = useMemo(() => ["mindful_breathing_1min", "thought_reframing"], []);
  const jumpBackInItems = useMemo(() => {
    const ids = Array.from(new Set([...recentIds, ...defaultJumpBackInIds])).slice(0, 2);
    return ids.map((id) => allExercises.find((exercise) => exercise.type === id)).filter(Boolean) as ExerciseConfig<any>[];
  }, [allExercises, defaultJumpBackInIds, recentIds]);
  const jumpBackInTypes = useMemo(() => new Set(jumpBackInItems.map((item) => item.type)), [jumpBackInItems]);

  const handleExercisePress = useCallback(async (exercise: ExerciseConfig<any>) => {
    if (exercise.isProOnly && !hasPro) {
      await requirePro("exercise");
      return;
    }
    trackRecentExercise(exercise.type);
  }, [hasPro, requirePro]);

  const handleTabPress = useCallback((tab: TabKey) => {
    setActiveTab(tab);
    router.setParams({ tab });
  }, []);

  const navigateWithReveal = useCircularRevealNavigate();
  const handleLogPress = useCallback((item: HistoryLogItem, event?: any) => {
    const color = item.exerciseType
      ? getCategoryBadgeTheme(getExerciseConfig(item.exerciseType)?.category ?? "").bg
      : "#E8FBF0";
    let route: string | null = null;

    if (item.type === "unified" && item.exerciseType) {
      route = buildExerciseRoute(item.exerciseType, { entryId: item.id, readOnly: item.status === "completed" });
    } else if (item.type === "catcher") {
      route = `/tabs/screens/thought-checker?id=${item.id}`;
    } else if (item.type === "reframing") {
      route = buildExerciseRoute("thought_reframing", { entryId: item.id, readOnly: item.status === "completed" });
    } else if (item.type === "gratitude") {
      route = `/tabs/screens/gratitude-reframe?id=${item.id}`;
    }

    if (!route) return;
    if (event) navigateWithReveal(event, route as any, color);
    else router.push(route as never);
  }, [navigateWithReveal]);

  return (
    <>
      <Stack.Screen
        options={{
          headerTransparent: true,
          headerShown: true,
          headerShadowVisible: false,
          header: () => <ExercisesTabHeader activeTab={activeTab} completedCount={completedCount} tabPillStyle={tabPillStyle} onTabChange={handleTabPress} />,
        }}
      />
      {activeTab === "discover" ? (
        <ScrollView
          style={{ flex: 1, backgroundColor: "#FFFFFF" }}
          contentInsetAdjustmentBehavior="automatic"
          scrollEventThrottle={16}
          contentContainerStyle={{ paddingTop: headerHeight - insets.top + 16, paddingBottom: 220, paddingHorizontal: 20 }}
          showsVerticalScrollIndicator={false}
        >
          {recommendation && getExerciseConfig(recommendation.exerciseType) ? null : null}
          {exerciseGroups.length === 0 ? <EmptyDiscoverState /> : (
            <>
              <Animated.View entering={FadeInDown.duration(400).delay(100)}>
                <JumpBackInShelf items={jumpBackInItems} onPress={handleExercisePress} />
              </Animated.View>
              {exerciseGroups.map((group, index) => (
                <Animated.View key={group.category} entering={FadeInDown.duration(400).delay(200 + index * 100)}>
                  <DiscoverSection label={t(`categories.${group.category}`)} category={group.category} exercises={group.exercises} excludedExerciseTypes={jumpBackInTypes} onPress={handleExercisePress} isFirst={index === 0} />
                </Animated.View>
              ))}
            </>
          )}
        </ScrollView>
      ) : (
        <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
          <Suspense fallback={<TimelineSkeleton />}>
            <ExerciseTimeline onPressItem={handleLogPress} />
          </Suspense>
        </View>
      )}
    </>
  );
}
