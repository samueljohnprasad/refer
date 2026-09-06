import React, { useMemo } from "react";
import { View, Text } from "react-native";
import dayjs from "dayjs";
import { Mascot } from "@/src/components/ui/Mascot";
import { XP_ACTION_LABELS, XPHistoryEntry } from "@/src/types/xp";
import { Timeline } from "@/src/components/ui/Timeline";
import type { TimelineItemData, TimelineSection } from "@/src/components/ui/Timeline/types";

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
  const match = title.match(/^(.+):\s*(.+)$/);
  if (match) {
    return { prefix: match[1] + ":", value: match[2] };
  }
  return { prefix: title };
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

    let title = XP_ACTION_LABELS[entry.action];
    if (entry.description) {
      title =
        entry.description.includes("Completed:") ||
        entry.description.includes("logged:")
          ? entry.description
          : `Completed: ${entry.description}`;
    }

    group.items.push({
      id: entry.id,
      title,
      subtitle: `+${entry.amount} Insights`,
      date: dayjs(entry.timestamp).valueOf(),
      status: "completed",
    });
  });

  return Array.from(grouped.entries()).map(([date, group]) => {
    // Carry dailyTotal on every item so the first-rendered item can show it
    const items = group.items.map((item) => ({
      ...item,
      dailyTotal: group.dailyTotal,
    }));
    return {
      date,
      title: dayjs(date).format("D MMM"),
      data: items,
    };
  });
};

// ponytail: clean 4-column timeline row with scannable title and aligned time
const renderXPItem = (item: XPItem) => {
  const { prefix, value } = parseTitle(item.title);

  return (
    <View className="flex-row justify-between items-center py-0.5">
      <View className="flex-1 pr-4">
        <View className="flex-row flex-wrap items-baseline">
          <Text className="happy-font-body-regular text-[#2C2C2E] text-[15px] leading-5">
            {prefix}
          </Text>
          {value && (
            <Text className="happy-font-body-bold text-[#2C2C2E] text-[15px] leading-5 ml-1">
              {value}
            </Text>
          )}
        </View>
      </View>
      <Text className="happy-font-body-medium text-gray-500 text-[11px] uppercase">
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
