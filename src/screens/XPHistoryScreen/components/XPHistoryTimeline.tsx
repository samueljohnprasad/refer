import React, { useMemo } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import Timeline from "react-native-beautiful-timeline";
import dayjs from "dayjs";
import { SAGE } from "@/lib/tokens";
import { Mascot } from "@/src/components/ui/Mascot";
import { XP_ACTION_LABELS, XPHistoryEntry } from "@/src/types/xp";

interface XPHistoryTimelineProps {
  entries: XPHistoryEntry[];
  header: React.ReactElement;
  isLoadingMore: boolean;
  onEndReached: () => void;
  contentPaddingTop?: number;
}

const XPHistoryTimelineEmptyState: React.FC = React.memo(() => (
  <View className="items-center justify-center px-8 py-20">
    <View className="happy-mascot-stage h-20 w-20 items-center justify-center rounded-[28px]">
      <Mascot state="panda-notes" size={54} />
    </View>
    <Text className="happy-font-heading-bold mt-4 text-lg text-ink">
      No Insights earned yet
    </Text>
    <Text className="happy-font-body-medium mt-1 text-center text-sm leading-5 text-ink-muted">
      Complete a journal, exercise, or habit to start building momentum.
    </Text>
  </View>
));

XPHistoryTimelineEmptyState.displayName = "XPHistoryTimelineEmptyState";

const XPHistoryTimelineFooter: React.FC<{ isLoadingMore: boolean }> = ({
  isLoadingMore,
}) => {
  if (!isLoadingMore) return null;

  return (
    <View className="py-4">
      <ActivityIndicator size="small" color={SAGE[500]} />
    </View>
  );
};

const transformHistoryToTimeline = (entries: XPHistoryEntry[]) => {
  const grouped = new Map<number, any[]>();

  entries.forEach((entry) => {
    // Group by start of day timestamp (number)
    const dayTimestamp = dayjs(entry.timestamp).startOf("day").valueOf();
    if (!grouped.has(dayTimestamp)) {
      grouped.set(dayTimestamp, []);
    }
    grouped.get(dayTimestamp)!.push({
      title: entry.description || XP_ACTION_LABELS[entry.action],
      subtitle: `+${entry.amount} Insights`,
      date: dayjs(entry.timestamp).valueOf(), // pass timestamp for inner dates
    });
  });

  return Array.from(grouped.entries()).map(([date, data]) => ({
    date,
    data,
  }));
};

export const XPHistoryTimeline: React.FC<XPHistoryTimelineProps> = React.memo(
  ({ entries, header, isLoadingMore, onEndReached, contentPaddingTop }) => {
    const timelineData = useMemo(
      () => transformHistoryToTimeline(entries),
      [entries],
    );

    return (
      <View style={[styles.timeline, { paddingTop: contentPaddingTop }]}>
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
            ListEmptyComponent: <XPHistoryTimelineEmptyState />,
            ListFooterComponent: (
              <XPHistoryTimelineFooter isLoadingMore={isLoadingMore} />
            ),
            contentContainerStyle: { width: "100%", paddingBottom: 120 },
          } as any)}
        />
      </View>
    );
  },
);

XPHistoryTimeline.displayName = "XPHistoryTimeline";

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
    color: "#2C2C2E", // ink
    fontSize: 16,
  },
  monthText: {
    fontFamily: "Nunito-Bold",
    color: "#8E8E93", // ink-muted
    fontSize: 10,
  },
  pointInner: {
    backgroundColor: "#166534", // SAGE
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
    fontFamily: "Nunito-Bold",
    color: "#166534", // SAGE text color for XP
    fontSize: 12,
    marginTop: 2,
  },
  dateText: {
    fontFamily: "Nunito-SemiBold",
    color: "#8E8E93",
    fontSize: 11,
  },
});
