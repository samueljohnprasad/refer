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

const transformHistoryToTimeline = (entries: XPHistoryEntry[]): TimelineSection<XPItem>[] => {
  const grouped = new Map<number, XPItem[]>();

  entries.forEach((entry) => {
    // Group by start of day timestamp (number)
    const dayTimestamp = dayjs(entry.timestamp).startOf("day").valueOf();
    if (!grouped.has(dayTimestamp)) {
      grouped.set(dayTimestamp, []);
    }
    
    let title = XP_ACTION_LABELS[entry.action];
    if (entry.description) {
      title = entry.description.includes("Completed:") || entry.description.includes("logged:") 
        ? entry.description 
        : `Completed: ${entry.description}`;
    } else {
      title = `${title}`;
    }

    const currentDayItems = grouped.get(dayTimestamp)!;
    
    currentDayItems.push({
      id: entry.id,
      title,
      subtitle: `+${entry.amount} Insights`,
      date: dayjs(entry.timestamp).valueOf(),
      status: "completed",
    } as XPItem);
  });

  return Array.from(grouped.entries()).map(([date, data]) => ({
    date,
    title: dayjs(date).format("D MMM"), 
    data,
  }));
};

const renderXPItem = (item: XPItem) => {
  return (
    <View className="mb-4">
      <View className="py-2 flex-row justify-between items-start">
        <View className="flex-1 pr-4">
          <Text className="happy-font-body-bold text-[#2C2C2E] text-[15px] leading-5">
            {item.title}
          </Text>
          <View className="flex-row mt-1.5">
            <View className="bg-[#166534]/10 rounded-full px-2 py-0.5 border border-[#166534]/20 flex-row items-center">
              <Text className="happy-font-body-bold text-[#166534] text-[12px] tracking-wide">
                {item.subtitle.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>
        <Text className="happy-font-body-medium text-gray-500 text-[11px] mt-0.5 uppercase">
          {dayjs(item.date).format("h:mm a")}
        </Text>
      </View>
    </View>
  );
};

export const XPHistoryTimeline: React.FC<XPHistoryTimelineProps> = React.memo(
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
  }
);

XPHistoryTimeline.displayName = "XPHistoryTimeline";
