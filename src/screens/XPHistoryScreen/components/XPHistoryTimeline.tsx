import React, { useMemo } from "react";
import { View, Text } from "react-native";
import dayjs from "dayjs";
import { Mascot } from "@/src/components/ui/Mascot";
import { XP_ACTION_LABELS, XPActionType, XPHistoryEntry } from "@/src/types/xp";
import { Timeline } from "@/src/components/ui/Timeline";
import type { TimelineItemData, TimelineSection } from "@/src/components/ui/Timeline/types";
import { APP_FONT_FAMILIES } from "@/src/theme/typography";

interface XPHistoryTimelineProps {
  entries: XPHistoryEntry[];
  header: React.ReactElement;
  isLoadingMore: boolean;
  onEndReached: () => void;
  contentPaddingTop?: number;
}

interface XPItem extends TimelineItemData {
  category: string;
  detail?: string;
  isMultiLine: boolean;
  dailyTotal?: number;
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

// ponytail: normalize event titles to category + detail per audit #9-#13
function normalizeTimelineItem(entry: XPHistoryEntry): {
  category: string;
  detail?: string;
  status: "completed" | "challenge" | "milestone";
  isMultiLine: boolean;
} {
  const desc = entry.description || XP_ACTION_LABELS[entry.action] || "";

  // Challenge check
  if (/challenge/i.test(desc)) {
    const cleanName = desc
      .replace(/^Completed:\s*/i, "")
      .replace(/^Challenge:\s*/i, "")
      .trim();
    return {
      category: "Challenge completed",
      detail: cleanName,
      status: "challenge",
      isMultiLine: true,
    };
  }

  // Journey milestone check (e.g. "First step on your journey")
  if (/journey/i.test(desc) || /first step/i.test(desc)) {
    return {
      category: "Journey started",
      detail: "Sleep Reset",
      status: "milestone",
      isMultiLine: true,
    };
  }

  // Mood check: shorten "Mood logged: Good" -> "Mood: Good"
  if (/^Mood logged:\s*(.+)$/i.test(desc) || /^Mood:\s*(.+)$/i.test(desc)) {
    const moodName = desc.replace(/^Mood( logged)?:\s*/i, "").trim();
    return {
      category: "Mood:",
      detail: moodName,
      status: "completed",
      isMultiLine: false,
    };
  }

  // Activity milestone check
  if (/^Completed:\s*(.+)$/i.test(desc)) {
    const activityName = desc.replace(/^Completed:\s*/i, "").trim();
    return {
      category: "Activity completed",
      detail: activityName,
      status: "completed",
      isMultiLine: true,
    };
  }

  return {
    category: desc,
    status: "completed",
    isMultiLine: false,
  };
}

const transformHistoryToTimeline = (
  entries: XPHistoryEntry[],
): TimelineSection<XPItem>[] => {
  const grouped = new Map<
    number,
    { items: XPItem[]; dailyTotal: number }
  >();

  entries.forEach((entry) => {
    const dayTimestamp = dayjs(entry.timestamp).startOf("day").valueOf();
    if (!grouped.has(dayTimestamp)) {
      grouped.set(dayTimestamp, { items: [], dailyTotal: 0 });
    }

    const group = grouped.get(dayTimestamp)!;
    group.dailyTotal += entry.amount;

    const { category, detail, status, isMultiLine } = normalizeTimelineItem(entry);

    group.items.push({
      id: entry.id,
      category,
      detail,
      isMultiLine,
      date: dayjs(entry.timestamp).valueOf(),
      status,
    });
  });

  return Array.from(grouped.entries()).map(([date, group]) => {
    return {
      date,
      title: dayjs(date).format("D MMM"),
      dailyTotal: group.dailyTotal,
      data: group.items,
    };
  });
};

// ponytail: day-level reward header matching audit items 3, 4, 5
const renderSectionHeader = (section: TimelineSection<XPItem>) => {
  const isToday = dayjs(section.date).isSame(dayjs(), "day");
  const isYesterday = dayjs(section.date).isSame(dayjs().subtract(1, "day"), "day");
  const dayLabel = isToday
    ? "Today"
    : isYesterday
      ? "Yesterday"
      : dayjs(section.date).format("D MMM");

  return (
    <View className="flex-row items-baseline justify-between px-5 pt-4 pb-1.5">
      <Text
        style={{
          fontFamily: APP_FONT_FAMILIES.semiBold,
          color: "#8E8E93",
          fontSize: 11,
          letterSpacing: 0.3,
          textTransform: "uppercase",
        }}
      >
        {dayLabel}
      </Text>
      {section.dailyTotal !== undefined && section.dailyTotal > 0 && (
        <Text
          style={{
            fontFamily: APP_FONT_FAMILIES.semiBold,
            color: "#5F7F58",
            fontSize: 11,
          }}
        >
          {section.dailyTotal} Insights
        </Text>
      )}
    </View>
  );
};

// ponytail: clean 4-column timeline row with scannable title and aligned time
const renderXPItem = (item: XPItem) => {
  if (item.isMultiLine && item.detail) {
    return (
      <View className="flex-row justify-between items-start py-0.5">
        <View className="flex-1 pr-4">
          <Text
            style={{
              fontFamily: APP_FONT_FAMILIES.regular,
              color: "#636366",
              fontSize: 14,
              lineHeight: 18,
            }}
          >
            {item.category}
          </Text>
          <Text
            style={{
              fontFamily: APP_FONT_FAMILIES.semiBold,
              color: "#1C1C1E",
              fontSize: 14,
              lineHeight: 18,
              marginTop: 2,
            }}
          >
            {item.detail}
          </Text>
        </View>
        <Text
          style={{
            fontFamily: APP_FONT_FAMILIES.regular,
            color: "#8E8E93",
            fontSize: 11,
            textTransform: "uppercase",
            marginTop: 2,
          }}
        >
          {dayjs(item.date).format("h:mm a")}
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-row justify-between items-center py-0.5">
      <View className="flex-1 pr-4">
        <View className="flex-row flex-wrap items-baseline">
          <Text
            style={{
              fontFamily: APP_FONT_FAMILIES.regular,
              color: "#636366",
              fontSize: 14,
              lineHeight: 18,
            }}
          >
            {item.category}
          </Text>
          {item.detail && (
            <Text
              style={{
                fontFamily: APP_FONT_FAMILIES.semiBold,
                color: "#1C1C1E",
                fontSize: 14,
                lineHeight: 18,
                marginLeft: 4,
              }}
            >
              {item.detail}
            </Text>
          )}
        </View>
      </View>
      <Text
        style={{
          fontFamily: APP_FONT_FAMILIES.regular,
          color: "#8E8E93",
          fontSize: 11,
          textTransform: "uppercase",
        }}
      >
        {dayjs(item.date).format("h:mm a")}
      </Text>
    </View>
  );
};

export const XPHistoryTimeline: React.FC<XPHistoryTimelineProps> =
  React.memo(
    ({ entries, header, isLoadingMore, onEndReached, contentPaddingTop }) => {
      const timelineData = useMemo(
        () => transformHistoryToTimeline(entries),
        [entries],
      );

      return (
        <Timeline
          sections={timelineData}
          renderItem={renderXPItem}
          renderSectionHeader={renderSectionHeader}
          onEndReached={onEndReached}
          isLoadingMore={isLoadingMore}
          ListHeaderComponent={header}
          ListEmptyComponent={<XPHistoryTimelineEmptyState />}
          contentPaddingTop={contentPaddingTop}
        />
      );
    },
  );

XPHistoryTimeline.displayName = "XPHistoryTimeline";
