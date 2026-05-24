import React, { useMemo } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import Timeline, { Data as TimelineData } from "react-native-timeline-flatlist";
import { Image } from "expo-image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { SAGE } from "@/lib/tokens";
import { Mascot } from "@/src/components/ui/Mascot";
import { emotions, Emotion } from "@/assets/emojis";
import {
  XP_ACTION_LABELS,
  XPActionType,
  XPHistoryEntry,
} from "@/src/types/xp";

dayjs.extend(relativeTime);

interface XPHistoryTimelineProps {
  entries: XPHistoryEntry[];
  header: React.ReactElement;
  isLoadingMore: boolean;
  onEndReached: () => void;
}

interface XPHistoryTimelineRow extends TimelineData {
  action: XPActionType;
  amount: number;
  id: string;
  mood: Emotion | null;
  time: string;
  timestampLabel: string;
  title: string;
}

const ACTION_EMOJI: Partial<Record<XPActionType, string>> = {
  [XPActionType.JOURNAL_ENTRY]: "📝",
  [XPActionType.VOICE_JOURNAL]: "🎤",
  [XPActionType.IMAGE_JOURNAL]: "📸",
  [XPActionType.WELLNESS_PROMPT]: "💭",
  [XPActionType.WEEKLY_REFLECTION]: "📊",
  [XPActionType.HABIT_COMPLETION]: "✅",
  [XPActionType.CALORIE_LOG]: "🍽️",
  [XPActionType.EXERCISE_COMPLETE]: "🧠",
};

const MOOD_BY_LABEL: Record<string, Emotion> = {
  terrible: Emotion.Terrible,
  bad: Emotion.Bad,
  okay: Emotion.Fine,
  good: Emotion.Good,
  great: Emotion.Great,
};

const getMoodFromDescription = (description?: string): Emotion | null => {
  const moodLabel = description?.match(/Mood logged:\s*([a-z]+)/i)?.[1];
  if (!moodLabel) return null;

  return MOOD_BY_LABEL[moodLabel.toLowerCase()] ?? Emotion.Good;
};

const getActionEmoji = (action: XPActionType): string =>
  ACTION_EMOJI[action] ?? "⭐";

const getTimelineTimeLabel = (timestamp: string): string => {
  const happenedAt = dayjs(timestamp);
  const minutesAgo = Math.max(0, dayjs().diff(happenedAt, "minute"));

  if (minutesAgo < 1) return "Now";
  if (minutesAgo < 60) return `${minutesAgo}m`;

  const hoursAgo = Math.floor(minutesAgo / 60);
  if (hoursAgo < 24) return `${hoursAgo}h`;

  const daysAgo = Math.floor(hoursAgo / 24);
  if (daysAgo < 7) return `${daysAgo}d`;

  return happenedAt.format("MMM D");
};

const TimelineActivityIcon: React.FC<{ row: XPHistoryTimelineRow }> =
  React.memo(({ row }) => (
    <View className="h-11 w-11 items-center justify-center">
      {row.mood ? (
        <Image
          source={emotions[row.mood]}
          style={styles.moodIcon}
          contentFit="contain"
        />
      ) : (
        <Text className="text-lg">{getActionEmoji(row.action)}</Text>
      )}
    </View>
  ));

TimelineActivityIcon.displayName = "TimelineActivityIcon";

const XPHistoryTimelineTime: React.FC<{ row: XPHistoryTimelineRow }> =
  React.memo(({ row }) => (
    <View style={styles.timeColumn}>
      <View className="happy-brand-status-chip min-w-[48px] items-center rounded-full px-2.5 py-1">
        <Text className="happy-font-body-bold text-[11px] text-sage-600">
          {row.time}
        </Text>
      </View>
    </View>
  ));

XPHistoryTimelineTime.displayName = "XPHistoryTimelineTime";

const createTimelineRow = (entry: XPHistoryEntry): XPHistoryTimelineRow => {
  const row = {
    action: entry.action,
    amount: entry.amount,
    id: entry.id,
    mood:
      entry.action === XPActionType.MOOD_LOG
        ? getMoodFromDescription(entry.description)
        : null,
    time: getTimelineTimeLabel(entry.timestamp),
    timestampLabel: dayjs(entry.timestamp).fromNow(),
    title: entry.description || XP_ACTION_LABELS[entry.action],
  };

  return {
    ...row,
    icon: <TimelineActivityIcon row={row} />,
  };
};

const XPHistoryTimelineDetail: React.FC<{ row: XPHistoryTimelineRow }> =
  React.memo(({ row }) => (
    <View className="happy-brand-card mb-3 mr-4 rounded-[24px] px-4 py-3">
      <View className="flex-row items-center justify-between gap-3">
        <View className="min-w-0 flex-1">
          <Text
            className="happy-font-body-bold text-ink"
            numberOfLines={1}
          >
            {row.title}
          </Text>
          <Text className="happy-font-body-medium mt-0.5 text-xs text-ink-muted">
            {row.timestampLabel}
          </Text>
        </View>
        <View className="happy-brand-status-chip rounded-full px-3 py-1">
          <Text className="happy-font-body-bold text-sm text-ink">
            +{row.amount}
          </Text>
        </View>
      </View>
    </View>
  ));

XPHistoryTimelineDetail.displayName = "XPHistoryTimelineDetail";

const XPHistoryTimelineEmptyState: React.FC = React.memo(() => (
  <View className="items-center justify-center px-8 py-20">
    <View className="happy-mascot-stage h-20 w-20 items-center justify-center rounded-[28px]">
      <Mascot state="panda-notes" size={54} />
    </View>
    <Text className="happy-font-heading-bold mt-4 text-lg text-ink">
      No XP earned yet
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

export const XPHistoryTimeline: React.FC<XPHistoryTimelineProps> = React.memo(
  ({ entries, header, isLoadingMore, onEndReached }) => {
    const timelineRows = useMemo(
      () => entries.map(createTimelineRow),
      [entries]
    );

    return (
      <Timeline
        data={timelineRows}
        circleColor="transparent"
        circleSize={52}
        columnSideMargin={28}
        columnSidePadding={18}
        eventDetailStyle={styles.eventDetail}
        innerCircle="element"
        lineColor={SAGE[100]}
        lineWidth={3}
        renderDetail={(rowData) => (
          <XPHistoryTimelineDetail row={rowData as XPHistoryTimelineRow} />
        )}
        renderTime={(rowData) => (
          <XPHistoryTimelineTime row={rowData as XPHistoryTimelineRow} />
        )}
        rowContainerStyle={styles.rowContainer}
        showTime={true}
        style={styles.timeline}
        timeContainerStyle={styles.timeContainer}
        options={{
          ListEmptyComponent: <XPHistoryTimelineEmptyState />,
          ListFooterComponent: (
            <XPHistoryTimelineFooter isLoadingMore={isLoadingMore} />
          ),
          ListHeaderComponent: header,
          contentContainerStyle: styles.listContent,
          keyExtractor: (item) => (item as XPHistoryTimelineRow).id,
          onEndReached,
          onEndReachedThreshold: 0.5,
          removeClippedSubviews: false,
          showsVerticalScrollIndicator: false,
        }}
      />
    );
  }
);

XPHistoryTimeline.displayName = "XPHistoryTimeline";

const styles = StyleSheet.create({
  eventDetail: {
    paddingBottom: 0,
    paddingTop: 0,
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 48,
  },
  moodIcon: {
    height: 24,
    width: 24,
  },
  rowContainer: {
    paddingLeft: 16,
  },
  timeColumn: {
    alignItems: "flex-end",
    paddingRight: 6,
    paddingTop: 1,
  },
  timeContainer: {
    minWidth: 58,
  },
  timeline: {
    flex: 1,
  },
});
