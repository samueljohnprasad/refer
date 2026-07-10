import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Pressable,
  StyleSheet,
} from "react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { ArrowLeft02Icon } from "@hugeicons/core-free-icons";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { useXP } from "@/src/context/XPContext";
import { router, Stack } from "expo-router";
import { SAGE } from "@/lib/tokens";
import * as Haptics from "expo-haptics";

import { XPHistorySummary } from "./components/XPHistorySummary";
import { XPHistoryTimeline } from "./components/XPHistoryTimeline";
import { XPWeeklyChart } from "./components/XPWeeklyChart";
import { generateXPChartData } from "./utils/chartUtils";

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F7F7F8",
  },
  loadingScreen: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export const XPHistoryScreen: React.FC = () => {
  const { totalXP, todayXP, getXPHistory, history, isLoading } = useXP();
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const { data: chartData, weekLabels } = useMemo(() => {
    return generateXPChartData(history, 4); // 4 weeks of history
  }, [history]);

  useEffect(() => {
    const loadInitial = async () => {
      const initialHistory = await getXPHistory(100);
      if (initialHistory.length < 100) {
        setHasMore(false);
      }
    };
    loadInitial();
  }, [getXPHistory]);

  const handleBackPress = (): void => {
    Haptics.selectionAsync();
    router.back();
  };

  const handleLoadMore = async (): Promise<void> => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    try {
      const prevLength = history.length;
      const limit = prevLength + 50;
      const newHistory = await getXPHistory(limit);

      // If we didn't get as many items as we requested, there's no more data
      if (newHistory.length < limit) {
        setHasMore(false);
      }
    } finally {
      setIsLoadingMore(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView
        style={[styles.screen, styles.loadingScreen]}
      >
        <ActivityIndicator size="large" color={SAGE[500]} />
        <Text className="happy-font-body-medium text-ink-muted mt-4">
          Loading XP...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.screen}>
      <Stack.Screen
        options={{
          title: "Insights",
          headerStyle: { backgroundColor: "#F7F7F8" },
          headerShadowVisible: false,
          headerBackTitleVisible: false,
        }}
      />
      <XPHistoryTimeline
        entries={history}
        header={
          <View>
            <XPHistorySummary totalXP={totalXP} todayXP={todayXP} />
            <XPWeeklyChart weeklyData={chartData} weekLabels={weekLabels} />
          </View>
        }
        isLoadingMore={isLoadingMore}
        onEndReached={handleLoadMore}
      />
    </View>
  );
};

export default XPHistoryScreen;
