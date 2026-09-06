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
  title: string;
  subtitle: string;
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

function parseTitle(title: string): { prefix: string; value?: string } {
  // Check for dot separator (e.g. "Challenge completed · Evening Check-in")
  const dotMatch = title.match(/^(.+?)\s*·\s*(.+)$/);
  if (dotMatch) {
    return { prefix: `${dotMatch[1]} ·`, value: dotMatch[2] };
  }

  // Check for colon separator (e.g. "Mood: Good")
  const colonMatch = title.match(/^(.+?:)\s*(.+)$/);
  if (colonMatch) {
    return { prefix: colonMatch[1], value: colonMatch[2] };
  }

  return { prefix: title };
}

// ponytail: normalize event titles to TYPE · OBJECT grammar per audit #9-#13
function normalizeTimelineItem(entry: XPHistoryEntry): {
  title: string;
  status: "completed" | "challenge" | "milestone";
} {
  const desc = entry.description || XP_ACTION_LABELS[entry.action] || "";

  // Challenge check
  if (/challenge/i.test(desc)) {
    const cleanName = desc
      .replace(/^Completed:\s*/i, "")
      .replace(/^Challenge:\s*/i, "")
      .trim();
    return {
      title: `Challenge completed · ${cleanName}`,
      status: "challenge",
    };
  }

  // Mood check: shorten "Mood logged: Good" -> "Mood: Good"
  if (/^Mood logged:\s*(.+)$/i.test(desc)) {
    const moodName = desc.match(/^Mood logged:\s*(.+)$/i)?.[1]?.trim() || "";
    return {
      title: `Mood: ${moodName}`,
      status: "completed",
    };
  }

  // Milestone check
  if (/^Completed:\s*(.+)$/i.test(desc)) {
    return {
      title: desc,
      status: "milestone",
    };
  }

  return {
    title: desc,
    status: "completed",
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

    const { title, status } = normalizeTimelineItem(entry);

    group.items.push({
      id: entry.id,
      title,
      subtitle: `${entry.amount} Insights`,
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
          letterSpacing: 0.5,
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
  const { prefix, value } = parseTitle(item.title);

  return (
    <View className="flex-row justify-between items-center py-0.5">
      <View className="flex-1 pr-4">
        <View className="flex-row flex-wrap items-baseline">
          <Text
            style={{
              fontFamily: APP_FONT_FAMILIES.regular,
              color: "#8E8E93",
              fontSize: 14,
              lineHeight: 18,
            }}
          >
            {prefix}
          </Text>
          {value && (
            <Text
              style={{
                fontFamily: APP_FONT_FAMILIES.semiBold,
                color: "#2C2C2E",
                fontSize: 14,
                lineHeight: 18,
                marginLeft: 4,
              }}
            >
              {value}
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
