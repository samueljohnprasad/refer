import React, { useMemo } from "react";
import { View, Text } from "react-native";
import dayjs from "dayjs";
import { XP_ACTION_LABELS, XPHistoryEntry } from "@/src/types/xp";
import { Timeline } from "@/src/components/ui/Timeline";
import type { TimelineItemData, TimelineSection } from "@/src/components/ui/Timeline/types";
import { APP_FONT_FAMILIES } from "@/src/theme/typography";
import { useTranslation } from "react-i18next";
import XPHistoryTimelineEmptyState from "./XPHistoryTimelineEmptyState";

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

// ponytail: normalize event titles to category + detail per audit #9-#13
function normalizeTimelineItem(
  entry: XPHistoryEntry,
  t: (key: "progressionScreen.challengeCompleted" | "progressionScreen.journeyStarted" | "progressionScreen.activityCompleted" | "progressionScreen.mood") => string,
): {
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
      category: t("progressionScreen.challengeCompleted"),
      detail: cleanName,
      status: "challenge",
      isMultiLine: true,
    };
  }

  // Journey milestone check (e.g. "First step on your journey")
  if (/journey/i.test(desc) || /first step/i.test(desc)) {
    return {
      category: t("progressionScreen.journeyStarted"),
      detail: "Sleep Reset",
      status: "milestone",
      isMultiLine: true,
    };
  }

  // Mood check: shorten "Mood logged: Good" -> "Mood: Good"
  if (/^Mood logged:\s*(.+)$/i.test(desc) || /^Mood:\s*(.+)$/i.test(desc)) {
    const moodName = desc.replace(/^Mood( logged)?:\s*/i, "").trim();
    return {
      category: t("progressionScreen.mood"),
      detail: moodName,
      status: "completed",
      isMultiLine: false,
    };
  }

  // Activity milestone check
  if (/^Completed:\s*(.+)$/i.test(desc)) {
    const activityName = desc.replace(/^Completed:\s*/i, "").trim();
    return {
      category: t("progressionScreen.activityCompleted"),
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
  t: (key: "progressionScreen.challengeCompleted" | "progressionScreen.journeyStarted" | "progressionScreen.activityCompleted" | "progressionScreen.mood") => string,
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

    const { category, detail, status, isMultiLine } = normalizeTimelineItem(entry, t);

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
const renderSectionHeader = (
  section: TimelineSection<XPItem>,
  t: (key: "progressionScreen.today" | "progressionScreen.yesterday" | "progressionScreen.insights") => string,
) => {
  const isToday = dayjs(section.date).isSame(dayjs(), "day");
  const isYesterday = dayjs(section.date).isSame(dayjs().subtract(1, "day"), "day");
  const dayLabel = isToday
    ? t("progressionScreen.today")
    : isYesterday
      ? t("progressionScreen.yesterday")
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
          {section.dailyTotal} {t("progressionScreen.insights")}
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
      const { t } = useTranslation("common");
      const timelineData = useMemo(
        () => transformHistoryToTimeline(entries, t),
        [entries, t],
      );

      return (
        <Timeline
          sections={timelineData}
          renderItem={renderXPItem}
          renderSectionHeader={(section) => renderSectionHeader(section, t)}
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
