import React, { useMemo } from "react";
import { ActivityIndicator, StyleSheet, Text, View, FlatList, Pressable } from "react-native";
import dayjs from "dayjs";
import { SAGE, GOLD, INK_MUTED } from "@/lib/tokens";
import type { HistoryLogItem } from "../hooks/useCBTHistory";
import {
  getExerciseConfig,
  getCategoryMeta,
} from "@/src/data/exerciseRegistry";
import { useHeaderHeight } from "expo-router/react-navigation";
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
    return { label: "Completed", isComplete: true, xpEarned: getHistoryXp(item) };
  }
  if (item.status === "catcher_completed") {
    return { label: "Ready to Reframe", isComplete: false, xpEarned: 0 };
  }
  return { label: "Resume", isComplete: false, xpEarned: 0 };
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

const TimelineItem = React.memo(({ 
  entry, 
  isFirstOfDay, 
  isLast, 
  dayObj, 
  onPressItem 
}: { 
  entry: HistoryLogItem, 
  isFirstOfDay: boolean, 
  isLast: boolean, 
  dayObj: dayjs.Dayjs, 
  onPressItem: (item: HistoryLogItem) => void 
}) => {
  const statusInfo = formatStatus(entry);
  const presentation = getLogPresentation(entry);
  const xpText = statusInfo.xpEarned > 0 ? ` • +${statusInfo.xpEarned} XP` : "";
  const subtitle = `${presentation.heading} • ${statusInfo.label}${xpText}`;
  
  return (
    <View style={styles.timelineRow}>
      {/* Left Column: Date */}
      <View style={styles.dateColumn}>
        {isFirstOfDay ? (
          <>
            <Text style={styles.dayText}>{dayObj.format("D")}</Text>
            <Text style={styles.monthText}>{dayObj.format("MMM").toUpperCase()}</Text>
          </>
        ) : null}
      </View>
      
      {/* Middle Column: Line and Dot */}
      <View style={styles.lineColumn}>
        {!isLast && (
          <View style={styles.lineContainer}>
            <View style={styles.dashedLine} />
          </View>
        )}
        <View style={[styles.dotOuter, statusInfo.isComplete && styles.dotOuterComplete]}>
          <View style={[styles.dotInner, statusInfo.isComplete && styles.dotInnerComplete]} />
        </View>
      </View>
      
      {/* Right Column: Card */}
      <View style={styles.cardColumn}>
        <Pressable 
          style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
          onPress={() => onPressItem(entry)}
        >
          <Text style={styles.cardTitle}>{presentation.title}</Text>
          <Text style={styles.cardSubtitle}>{subtitle}</Text>
        </Pressable>
      </View>
    </View>
  );
});
TimelineItem.displayName = "TimelineItem";

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
    
    const flattenedData = useMemo(() => {
      const result: Array<{
        entry: HistoryLogItem;
        isFirstOfDay: boolean;
        isLast: boolean;
        dayObj: dayjs.Dayjs;
      }> = [];
      
      let currentDayStr = "";
      
      entries.forEach((entry, index) => {
        const dayObj = dayjs(entry.date);
        const dayStr = dayObj.format("YYYY-MM-DD");
        const isFirstOfDay = dayStr !== currentDayStr;
        if (isFirstOfDay) {
          currentDayStr = dayStr;
        }
        
        const isLast = index === entries.length - 1;
    
        result.push({
          entry,
          isFirstOfDay,
          isLast,
          dayObj,
        });
      });
      return result;
    }, [entries]);

    return (
      <View style={styles.timeline}>
        <FlatList
          data={flattenedData}
          keyExtractor={(item) => item.entry.id}
          renderItem={({ item }) => (
            <TimelineItem 
              entry={item.entry}
              isFirstOfDay={item.isFirstOfDay}
              isLast={item.isLast}
              dayObj={item.dayObj}
              onPressItem={onPressItem}
            />
          )}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.5}
          ListHeaderComponent={header}
          ListEmptyComponent={<EmptyState />}
          ListFooterComponent={<Footer isLoadingMore={isLoadingMore} />}
          contentContainerStyle={{
            paddingTop: headerHeight + 24,
            paddingBottom: 120,
          }}
          showsVerticalScrollIndicator={false}
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
  timelineRow: {
    flexDirection: 'row',
  },
  dateColumn: {
    width: 60,
    alignItems: 'center',
    paddingTop: 16,
  },
  dayText: {
    fontFamily: "Nunito-Bold",
    fontSize: 18,
    color: "#2C2C2E",
    lineHeight: 22,
  },
  monthText: {
    fontFamily: "Nunito-Bold",
    fontSize: 11,
    color: "#8E8E93",
    lineHeight: 14,
    marginTop: 2,
    letterSpacing: 0.5,
  },
  lineColumn: {
    width: 32,
    alignItems: 'center',
  },
  lineContainer: {
    position: 'absolute',
    top: 24, 
    bottom: -24, 
    width: 2,
    overflow: 'hidden',
    zIndex: 0,
  },
  dashedLine: {
    height: '100%',
    width: 2,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    borderStyle: 'dashed',
    borderRadius: 1,
  },
  dotOuter: {
    marginTop: 20, 
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  dotInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#C7C7CC', 
  },
  dotOuterComplete: {
    backgroundColor: 'rgba(22, 101, 52, 0.1)', 
  },
  dotInnerComplete: {
    backgroundColor: '#166534', 
  },
  cardColumn: {
    flex: 1,
    paddingTop: 8,
    paddingBottom: 16,
    paddingRight: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  cardPressed: {
    backgroundColor: '#F9F9F9',
    opacity: 0.9,
  },
  cardTitle: {
    fontFamily: "Nunito-Bold",
    fontSize: 16,
    color: "#2C2C2E",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontFamily: "Nunito-SemiBold",
    fontSize: 13,
    color: "#166534",
  },
});

