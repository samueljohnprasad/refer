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
import { Button } from "@/src/components/ui/Button";
import { useRouter } from "expo-router";

// ─── Empty State ────────────────────────────────────────────────────────

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
