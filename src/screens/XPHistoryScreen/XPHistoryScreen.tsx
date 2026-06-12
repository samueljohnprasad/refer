import React, { useEffect, useState } from "react";
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
import { router } from "expo-router";
import { SAGE } from "@/lib/tokens";
import * as Haptics from "expo-haptics";

import { XPHistorySummary } from "./components/XPHistorySummary";
import { XPHistoryTimeline } from "./components/XPHistoryTimeline";

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
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
        className="happy-brand-screen flex-1 items-center justify-center"
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
    <SafeAreaView className="happy-brand-screen flex-1" style={styles.screen}>
      <View className="flex-row items-center px-4 pt-2 pb-4">
        <Pressable
          onPress={handleBackPress}
          className="happy-brand-soft-chip mr-3 h-11 w-11 items-center justify-center active:opacity-80"
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <HugeiconsIcon
            icon={ArrowLeft02Icon}
            size={20}
            color={SAGE[600]}
            strokeWidth={2}
          />
        </Pressable>
        <View className="flex-1 min-w-0">
          <Text
            className="happy-font-heading-bold text-[24px] leading-tight text-ink"
            numberOfLines={1}
          >
            XP History
          </Text>
          <Text
            className="happy-font-body-medium text-[13px] text-ink-muted"
            numberOfLines={1}
          >
            Track the effort you are building
          </Text>
        </View>
      </View>

      <XPHistoryTimeline
        entries={history}
        header={<XPHistorySummary totalXP={totalXP} todayXP={todayXP} />}
        isLoadingMore={isLoadingMore}
        onEndReached={handleLoadMore}
      />
    </SafeAreaView>
  );
};

export default XPHistoryScreen;
