/**
 * Exercise Timeline Types
 *
 * Extends the generic TimelineItemData with exercise-specific fields
 * for the card UI (category label, ratings, press handler).
 */

import type { ExerciseType } from "@/src/types/exerciseFlow";
import type { TimelineItemData } from "@/src/components/ui/Timeline/types";

export interface ExerciseTimelineItem extends TimelineItemData {
  /** The unified exercise type key */
  readonly exerciseType: ExerciseType;
  /** Exercise display title (e.g. "Thought Catcher") */
  readonly title: string;
  /** Category display label (e.g. "CBT Core") */
  readonly categoryLabel: string;
  /** Before rating extracted from response (if available) */
  readonly beforeRating?: number;
  /** After rating extracted from response (if available) */
  readonly afterRating?: number;
  /** Human-readable label for the shift badge (e.g. "Distress") */
  readonly ratingLabel?: string;
  /** Whether higher = better for this exercise's rating */
  readonly invertScale?: boolean;
  /** Navigation callback */
  readonly onPress: () => void;
}
