/**
 * ExerciseTimelineCard
 *
 * Thin container: owns no JSX of its own beyond wiring. Delegates state/derivation to
 * useTimelineEntryCard and all rendering to the pure TimelineEntryCard presentation view —
 * matching .agents/exercises.html's `.en`/`.enh`/`.exp` entry exactly (see domain/timelineEntry.ts
 * for the arc/note derivation rules).
 */

import React from "react";
import { useTimelineEntryCard } from "@/src/domains/exercises/ui/containers/useTimelineEntryCard";
import { TimelineEntryCard } from "@/src/domains/exercises/ui/presentation/views/TimelineEntryCard";
import type { ExerciseTimelineItem } from "./types";

interface ExerciseTimelineCardProps {
  readonly item: ExerciseTimelineItem;
}

const ExerciseTimelineCard: React.FC<ExerciseTimelineCardProps> = React.memo(({ item }) => {
  const viewModel = useTimelineEntryCard(item);
  return <TimelineEntryCard {...viewModel} />;
});

ExerciseTimelineCard.displayName = "ExerciseTimelineCard";
export { ExerciseTimelineCard };
