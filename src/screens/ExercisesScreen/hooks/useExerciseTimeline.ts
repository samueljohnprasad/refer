/**
 * useExerciseTimeline
 *
 * Transforms raw CBT history data into the shape required by
 * the generic Timeline component + ExerciseTimelineCard.
 *
 * Responsibilities:
 *  1. Filter to unified exercises only (no legacy tables)
 *  2. Enrich each item with before/after ratings via RATING_EXTRACTOR_MAP
 *  3. Group items by day into TimelineSection[]
 */

import { useMemo, useCallback } from "react";
import dayjs from "dayjs";
import { useCBTHistory } from "../hooks/useCBTHistory";
import type { HistoryLogItem } from "../hooks/useCBTHistory";
import {
  getExerciseConfig,
  getCategoryMeta,
} from "@/src/data/exerciseRegistry";
import { RATING_EXTRACTOR_MAP } from "../config/ratingExtractors";
import type { TimelineSection } from "@/src/components/ui/Timeline/types";
import type { ExerciseTimelineItem } from "../components/ExerciseTimeline/types";
import type { ExerciseType } from "@/src/types/exerciseFlow";

// ─── Status normaliser ──────────────────────────────────────────────────

function normaliseStatus(
  raw: string,
): "completed" | "in_progress" | "draft" {
  if (
    raw === "completed" ||
    raw === "summary" ||
    raw === "checker_completed"
  ) {
    return "completed";
  }
  if (raw === "draft") {
    return "draft";
  }
  return "in_progress";
}

// ─── Rating extractor ───────────────────────────────────────────────────

function extractRatings(
  exerciseType: ExerciseType,
  response?: Record<string, any>,
): {
  beforeRating?: number;
  afterRating?: number;
  ratingLabel?: string;
  invertScale?: boolean;
} {
  if (!response) return {};

  const config = RATING_EXTRACTOR_MAP[exerciseType];
  if (!config) return {};

  const before = response[config.beforeKey];
  const after = response[config.afterKey];

  // Only include ratings when at least one is a valid number
  if (typeof before !== "number" && typeof after !== "number") {
    return {};
  }

  return {
    beforeRating: typeof before === "number" ? before : undefined,
    afterRating: typeof after === "number" ? after : undefined,
    ratingLabel: config.label,
    invertScale: config.invertScale,
  };
}

function extractTimelinePreview(
  exerciseType: ExerciseType,
  response?: Record<string, any>,
): {
  previewText?: string;
  expandedText?: string;
  tags?: string[];
  gratitudeEntries?: string[];
  emotions?: Array<{ emotion: string; intensity: number }>;
} {
  if (!response) return {};

  switch (exerciseType) {
    case "thought_catcher":
      return {
        previewText: response.balancedThought,
        expandedText: response.automaticThought,
      };
    case "thought_reframing":
      return {
        previewText: response.balancedThought,
        expandedText: response.automaticThought,
        tags: Array.isArray(response.selectedDistortions)
          ? response.selectedDistortions
          : undefined,
        emotions: Array.isArray(response.emotions)
          ? response.emotions.slice(0, 3) // Top 3 emotions
          : undefined,
      };
    case "abc_analysis":
      return {
        previewText: response.alternativeBelief,
        expandedText: response.activatingEvent,
        emotions: Array.isArray(response.consequenceEmotions)
          ? response.consequenceEmotions.slice(0, 3)
          : undefined,
      };
    case "gratitude_reframe":
      return {
        previewText: Array.isArray(response.gratitudeEntries) && response.gratitudeEntries.length > 0 
          ? "I am grateful for..."
          : undefined,
        gratitudeEntries: Array.isArray(response.gratitudeEntries)
          ? response.gratitudeEntries
          : undefined,
      };
    default:
      return {};
  }
}

// ─── Hook ───────────────────────────────────────────────────────────────

interface UseExerciseTimelineReturn {
  readonly sections: TimelineSection<ExerciseTimelineItem>[];
  readonly isLoadingMore: boolean;
  readonly fetchNextPage: () => void;
  readonly hasNextPage: boolean;
}

  export function useExerciseTimeline(
    onPressItem: (item: HistoryLogItem, e?: any) => void,
  ): UseExerciseTimelineReturn {
    const {
      data,
      isFetchingNextPage,
      fetchNextPage,
      hasNextPage,
    } = useCBTHistory();
  
    // Stable press handler factory
    const makeOnPress = useCallback(
      (entry: HistoryLogItem) => (e?: any) => onPressItem(entry, e),
      [onPressItem],
    );

  const sections = useMemo<TimelineSection<ExerciseTimelineItem>[]>(() => {
    if (!data?.pages) return [];

    // Flatten all pages → filter to unified only
    const allItems: HistoryLogItem[] = data.pages
      .flatMap((page) => page.data)
      .filter((item): item is HistoryLogItem => item.type === "unified");

    // Sort newest-first
    allItems.sort(
      (a, b) =>
        dayjs(b.date).valueOf() - dayjs(a.date).valueOf(),
    );

    // Group by day
    const grouped = new Map<number, ExerciseTimelineItem[]>();

    for (const item of allItems) {
      const dayTs: number = dayjs(item.date).startOf("day").valueOf();

      if (!grouped.has(dayTs)) {
        grouped.set(dayTs, []);
      }

      const exerciseType = item.exerciseType as ExerciseType;
      const config = getExerciseConfig(exerciseType);
      const categoryMeta = config ? getCategoryMeta(config.category) : null;
      const ratings = extractRatings(exerciseType, item.response);
      const previewData = extractTimelinePreview(exerciseType, item.response);

      const enriched: ExerciseTimelineItem = {
        id: item.id,
        date: dayjs(item.date).valueOf(),
        status: normaliseStatus(item.status),
        exerciseType,
        title: item.title ?? config?.title ?? "Exercise",
        categoryLabel: categoryMeta?.label ?? "Exercise",
        ...ratings,
        ...previewData,
        onPress: makeOnPress(item),
      };

      grouped.get(dayTs)!.push(enriched);
    }

    // Convert to TimelineSection[] sorted newest day first
    return Array.from(grouped.entries())
      .sort(([a], [b]) => b - a)
      .map(
        ([dayTs, items]): TimelineSection<ExerciseTimelineItem> => ({
          title: dayjs(dayTs).format("D ddd"),
          date: dayTs,
          data: items,
        }),
      );
  }, [data, makeOnPress]);

  return {
    sections,
    isLoadingMore: isFetchingNextPage,
    fetchNextPage,
    hasNextPage: hasNextPage ?? false,
  };
}
