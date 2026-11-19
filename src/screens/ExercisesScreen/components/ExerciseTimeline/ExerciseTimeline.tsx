/**
 * ExerciseTimeline
 *
 * My Log as the prototype draws it (.agents/exercises.html): a full-width day heading
 * (Today / Yesterday / weekday) above that day's entry cards — no date rail or stem.
 * `useExerciseTimeline` supplies the grouped data, `ExerciseTimelineCard` each entry.
 */

import React, { useCallback, useMemo } from "react";
import { ActivityIndicator, View } from "react-native";
import { Text } from "@/src/components/ui/Text";
import { LegendList } from "@legendapp/list";
import { useHeaderHeight } from "expo-router/react-navigation";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { router } from "expo-router";
import { ExerciseTimelineCard } from "./ExerciseTimelineCard";
import { useExerciseTimeline } from "../../hooks/useExerciseTimeline";
import type { ExerciseTimelineItem } from "./types";
import type { HistoryLogItem } from "../../hooks/useCBTHistory";
import { ExerciseTimelineEmptyState } from "../ExerciseTimelineEmptyState";
import { dayHeading } from "@/src/domains/exercises/domain/timelineEntry";
import { HelpRowWithSheet } from "@/src/domains/home/ui/containers/HelpRowWithSheet";

type Row =
  | { kind: "day"; id: string; label: string }
  | { kind: "entry"; id: string; item: ExerciseTimelineItem };

interface ExerciseTimelineProps {
  /** Called when a log card is pressed — typically navigates to detail */
  readonly onPressItem: (item: HistoryLogItem) => void;
  /** Optional header above timeline */
  readonly header?: React.ReactElement;
}

const ExerciseTimeline: React.FC<ExerciseTimelineProps> = React.memo(
  ({ onPressItem, header }) => {
    const { t } = useTranslation("exercises");
    const headerHeight = useHeaderHeight();
    const insets = useSafeAreaInsets();
    const { sections, isLoadingMore, fetchNextPage } = useExerciseTimeline(onPressItem);

    const dayLabels = useMemo(() => ({ today: t("log.today"), yesterday: t("log.yesterday") }), [t]);

    const rows = useMemo<Row[]>(
      () =>
        sections.flatMap((s): Row[] => [
          { kind: "day", id: `day-${s.date}`, label: dayHeading(new Date(s.date), undefined, undefined, dayLabels) },
          ...s.data.map((item): Row => ({ kind: "entry", id: item.id, item })),
        ]),
      [sections, dayLabels],
    );

    const renderItem = useCallback(({ item: row, index }: { item: Row; index: number }) =>
      row.kind === "day" ? (
        <Text
          accessibilityRole="header"
          className={`${index === 0 ? "mt-4" : "mt-6"} mb-2 text-[15px] happy-font-body-bold text-happy-label-2`}
        >
          {row.label}
        </Text>
      ) : (
        <ExerciseTimelineCard item={row.item} />
      ), []);

    return (
      <LegendList
        data={rows}
        keyExtractor={(r) => r.id}
        renderItem={renderItem}
        getItemType={(r) => r.kind}
        onEndReached={fetchNextPage}
        onEndReachedThreshold={0.5}
        estimatedItemSize={110}
        ListHeaderComponent={
          <>
            <View style={{ height: Math.max(0, headerHeight - insets.top) }} />
            {header}
          </>
        }
        ListEmptyComponent={
          <ExerciseTimelineEmptyState
            artType="gratitude_reframe"
            title={t("log.spaceTitle")}
            description={t("log.spaceBody")}
            buttonLabel={t("log.explore")}
            onAction={() => router.setParams({ tab: "discover" })}
          />
        }
        ListFooterComponent={
          <>
            {isLoadingMore && <View className="py-4 items-center"><ActivityIndicator size="small" /></View>}
            <HelpRowWithSheet />
          </>
        }
        contentContainerStyle={{ paddingBottom: 120, paddingHorizontal: 16 }}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
        scrollEventThrottle={16}
      />
    );
  },
);

ExerciseTimeline.displayName = "ExerciseTimeline";
export { ExerciseTimeline };
