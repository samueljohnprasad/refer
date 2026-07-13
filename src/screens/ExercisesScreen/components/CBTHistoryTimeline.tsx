import React, { useMemo } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import Timeline from "react-native-beautiful-timeline";
import dayjs from "dayjs";
import { SAGE, GOLD, INK_MUTED } from "@/lib/tokens";
import { Mascot } from "@/src/components/ui/Mascot";
import type { HistoryLogItem } from "../hooks/useCBTHistory";
import {
  getExerciseConfig,
  getCategoryMeta,
} from "@/src/data/exerciseRegistry";
import { Brain01Icon } from "@hugeicons/core-free-icons";
import { useHeaderHeight } from "expo-router/react-navigation";
import { background } from "@expo/ui/swift-ui/modifiers";
import { Button } from "@/src/components/ui/Button";
import { useRouter } from "expo-router";

// We replicate the formatting from ExercisesScreen
const LEGACY_LOG_META = {
  catcher: { label: "Thought Catcher" },
  reframing: { label: "Thought Reframing" },
  gratitude: { label: "Gratitude Reframe" },
};

function getHistoryXp(item: HistoryLogItem): number {
  if (item.type === "unified" && item.exerciseType) {
    return getExerciseConfig(item.exerciseType)?.xp ?? 0;
  }
  if (item.type === "catcher") return 10;
  if (item.type === "reframing") return 15;
  if (item.type === "gratitude") return 10;
  return 0;
}

function formatStatus(item: HistoryLogItem) {
  if (
    item.status === "checker_completed" ||
    item.status === "completed" ||
    item.status === "summary"
  ) {
    return { label: "Completed", xpEarned: getHistoryXp(item) };
  }
  if (item.status === "catcher_completed") {
    return { label: "Ready to Reframe", xpEarned: 0 };
  }
  return { label: "Resume", xpEarned: 0 };
}

function getLogPresentation(item: HistoryLogItem) {
  if (item.type === "unified" && item.exerciseType) {
    const config = getExerciseConfig(item.exerciseType);
    const categoryMeta = config ? getCategoryMeta(config.category) : null;
    return {
      heading: categoryMeta?.label ?? "Exercise",
      title: config?.title ?? item.title ?? "Exercise",
    };
  }
  if (item.type === "catcher") {
    return {
      heading: LEGACY_LOG_META.catcher.label,
      title: item.title?.trim() || "Untitled Session",
    };
  }
  if (item.type === "reframing") {
    return {
      heading: LEGACY_LOG_META.reframing.label,
      title: item.title?.trim() || "Untitled Session",
    };
  }
  return {
    heading: LEGACY_LOG_META.gratitude.label,
    title: item.title?.trim() || "Untitled Session",
  };
}

interface CBTHistoryTimelineProps {
  entries: HistoryLogItem[];
  header?: React.ReactElement;
  isLoadingMore: boolean;
  onEndReached: () => void;
  contentPaddingTop?: number;
  onPressItem: (item: HistoryLogItem) => void;
}

const EmptyState: React.FC = React.memo(() => {
  const router = useRouter();
  return (
    <View className="items-center justify-center px-8 py-24">
      <Text className="happy-font-heading-bold text-2xl text-ink">
        A space for your thoughts
      </Text>
      <Text className="happy-font-body-medium mt-3 mb-8 text-center text-base leading-relaxed text-ink-muted">
        Your completed reflections and exercises will live here.
      </Text>
      <Button
        label="Explore Exercises"
        onPress={() => router.push("/")}
      />
    </View>
  );
});
EmptyState.displayName = "EmptyState";

const Footer: React.FC<{ isLoadingMore: boolean }> = ({ isLoadingMore }) => {
  if (!isLoadingMore) return null;
  return (
    <View className="py-4">
      <ActivityIndicator size="small" color={SAGE[500]} />
    </View>
  );
};

export const CBTHistoryTimeline: React.FC<CBTHistoryTimelineProps> = React.memo(
  ({
    entries,
    header,
    isLoadingMore,
    onEndReached,
    contentPaddingTop,
    onPressItem,
  }) => {
    const headerHeight = useHeaderHeight();
    const timelineData = useMemo(() => {
      const grouped = new Map<number, any[]>();
      entries.forEach((entry) => {
        const dayTimestamp = dayjs(entry.date).startOf("day").valueOf();
        if (!grouped.has(dayTimestamp)) {
          grouped.set(dayTimestamp, []);
        }

        const statusInfo = formatStatus(entry);
        const presentation = getLogPresentation(entry);

        const xpText =
          statusInfo.xpEarned > 0 ? ` • +${statusInfo.xpEarned} XP` : "";
        const subtitle = `${presentation.heading} • ${statusInfo.label}${xpText}`;

        grouped.get(dayTimestamp)!.push({
          title: presentation.title,
          subtitle,
          date: dayjs(entry.date).valueOf(),
          onPress: () => onPressItem(entry),
        });
      });

      return Array.from(grouped.entries()).map(([date, data]) => ({
        date,
        data,
      }));
    }, [entries, onPressItem]);

    return (
      <View style={[styles.timeline, {}]}>
        <Timeline
          data={timelineData}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.5}
          timelineStyle={styles.timelineStyleOverride}
          dashColor="rgba(0, 0, 0, 0.15)"
          dashThickness={2}
          dashGap={4}
          dashLength={4}
          dayTextStyle={styles.dayText}
          monthTextStyle={styles.monthText}
          innerContainer={styles.pointInner}
          outerContainer={styles.pointOuter}
          titleTextStyle={styles.titleText}
          subtitleTextStyle={styles.subtitleText}
          dateTextStyle={styles.dateText}
          {...({
            ListHeaderComponent: header,
            ListEmptyComponent: <EmptyState />,
            ListFooterComponent: <Footer isLoadingMore={isLoadingMore} />,
            contentContainerStyle: {
              width: "100%",
              paddingTop: headerHeight + 24,
              paddingBottom: 120,
              // backgroundColor: "red",
            },
          } as any)}
        />
      </View>
    );
  },
);
CBTHistoryTimeline.displayName = "CBTHistoryTimeline";

const styles = StyleSheet.create({
  timeline: {
    flex: 1,
  },
  timelineStyleOverride: {
    backgroundColor: "transparent",
    marginHorizontal: 0,
  },
  dayText: {
    fontFamily: "Nunito-Bold",
    color: "#2C2C2E",
    fontSize: 16,
  },
  monthText: {
    fontFamily: "Nunito-Bold",
    color: "#8E8E93",
    fontSize: 10,
  },
  pointInner: {
    backgroundColor: "#166534",
    shadowColor: "#166534",
  },
  pointOuter: {
    borderColor: "rgba(22, 101, 52, 0.1)",
    backgroundColor: "rgba(22, 101, 52, 0.05)",
  },
  titleText: {
    fontFamily: "Nunito-Bold",
    color: "#2C2C2E",
    fontSize: 14,
  },
  subtitleText: {
    fontFamily: "Nunito-SemiBold",
    color: "#166534",
    fontSize: 12,
    marginTop: 2,
  },
  dateText: {
    fontFamily: "Nunito-SemiBold",
    color: "#8E8E93",
    fontSize: 11,
  },
});
