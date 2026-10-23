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
import { useTranslation } from "react-i18next";
import { ExerciseTimelineEmptyState } from "../ExerciseTimelineEmptyState";

// ─── Component ──────────────────────────────────────────────────────────

interface ExerciseTimelineProps {
  /** Called when a log card is pressed — typically navigates to detail */
  readonly onPressItem: (item: HistoryLogItem) => void;
  /** Optional header above timeline */
  readonly header?: React.ReactElement;
}

const ExerciseTimeline: React.FC<ExerciseTimelineProps> = React.memo(
  ({ onPressItem, header }) => {
    const { t } = useTranslation("exercises");
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
        ListEmptyComponent={
          <ExerciseTimelineEmptyState
            title={t("log.spaceTitle")}
            description={t("log.spaceBody")}
            buttonLabel={t("log.explore")}
          />
        }
      />
    );
  },
);

ExerciseTimeline.displayName = "ExerciseTimeline";
export { ExerciseTimeline };
