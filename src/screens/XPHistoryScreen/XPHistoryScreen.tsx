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
import { SEMANTIC_COLORS } from "@/src/theme/colors";
import { RADIUS } from "@/src/theme/radius";
import * as Haptics from "expo-haptics";

import { XPHistorySummary } from "./components/XPHistorySummary";
import { XPHistoryTimeline } from "./components/XPHistoryTimeline";
import { XPWeeklyChart } from "./components/XPWeeklyChart";
import { generateXPChartData } from "./utils/chartUtils";
import { SplitView } from "@/src/components/split-view";

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
        <ActivityIndicator size="large" color={SEMANTIC_COLORS.brand.primary} />
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
          title: "Progression",
          headerStyle: { backgroundColor: "transparent" },
          headerTransparent: true,
          headerShadowVisible: false,
          headerBackVisible: false,
        }}
      />
      <Stack.Toolbar placement="left">
        <Stack.Toolbar.Button
          icon="chevron.backward"
          onPress={handleBackPress}
          separateBackground
        />
      </Stack.Toolbar>
      <SplitView
        topContent={
          <View style={{ paddingTop: 60, paddingHorizontal: 16 }}>
            <XPHistorySummary totalXP={totalXP} todayXP={todayXP} />
            <XPWeeklyChart weeklyData={chartData} weekLabels={weekLabels} />
          </View>
        }
        bottomContent={
          <XPHistoryTimeline
            entries={history}
            header={<View />}
            isLoadingMore={isLoadingMore}
            onEndReached={handleLoadMore}
            contentPaddingTop={16}
          />
        }
        initialTopSectionHeight={500}
        minSectionHeight={100}
        maxTopSectionHeight={700}
        velocityThreshold={500}
        springConfig={{ damping: 20, stiffness: 200, mass: 1 }}
        containerBackgroundColor="#FFFFFF"
        sectionBackgroundColor="#FFFFFF"
        dividerBackgroundColor="#F7F7F8"
        dragHandleColor="#D1D1D6"
      />
    </View>
  );
};

export default XPHistoryScreen;
