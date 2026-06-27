/**
 * ExerciseTimeline
 *
 * Exercise-specific wrapper around the generic Timeline primitive.
 * Connects `useExerciseTimeline` (data) with `ExerciseTimelineCard` (UI)
 * and feeds them into the reusable `<Timeline>` component.
 */

import React, { useCallback } from "react";
import { View, Text } from "react-native";
import { Timeline } from "@/src/components/ui/Timeline";
import { ExerciseTimelineCard } from "./ExerciseTimelineCard";
import { useExerciseTimeline } from "../../hooks/useExerciseTimeline";
import type { ExerciseTimelineItem } from "./types";
import type { HistoryLogItem } from "../../hooks/useCBTHistory";

// ─── Empty State ────────────────────────────────────────────────────────

const EmptyState: React.FC = React.memo(() => (
  <View className="items-center justify-center px-8 py-20">
    <View className="mb-4 h-20 w-20 items-center justify-center rounded-[28px] bg-sage-50">
      <Text className="text-[40px]">📚</Text>
    </View>
    <Text className="happy-font-heading-bold mt-4 text-lg text-ink">
      Your exercise journal
    </Text>
    <Text className="happy-font-body-medium mt-1 text-center text-sm leading-5 text-ink-muted">
      Complete your first exercise to see it here.
    </Text>
  </View>
));
EmptyState.displayName = "ExerciseTimelineEmpty";

// ─── Component ──────────────────────────────────────────────────────────

interface ExerciseTimelineProps {
  /** Called when a log card is pressed — typically navigates to detail */
  readonly onPressItem: (item: HistoryLogItem) => void;
  /** Optional header above timeline */
  readonly header?: React.ReactElement;
}

const ExerciseTimeline: React.FC<ExerciseTimelineProps> = React.memo(
  ({ onPressItem, header }) => {
    const { sections, isLoadingMore, fetchNextPage } =
      useExerciseTimeline(onPressItem);

    const renderItem = useCallback(
      (item: ExerciseTimelineItem) => <ExerciseTimelineCard item={item} />,
      [],
    );

    return (
      <Timeline<ExerciseTimelineItem>
        sections={sections}
        renderItem={renderItem}
        onEndReached={fetchNextPage}
        isLoadingMore={isLoadingMore}
        ListHeaderComponent={header}
        ListEmptyComponent={<EmptyState />}
      />
    );
  },
);

ExerciseTimeline.displayName = "ExerciseTimeline";
export { ExerciseTimeline };
