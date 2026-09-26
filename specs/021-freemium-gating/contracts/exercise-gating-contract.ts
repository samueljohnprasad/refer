/**
 * Contract: Exercise Gating Interface
 *
 * Defines the contract for categorizing and badging exercises under Model A.
 */

import type { ExerciseType, ExerciseCategory } from "@/src/types/exerciseFlow";

export interface ExerciseGatingConfig {
  /** Master set of exercise types requiring active Pro subscription */
  proExerciseTypes: ReadonlySet<ExerciseType>;

  /** Helper to determine if an exercise type is Pro-only */
  isExerciseProOnly: (type: ExerciseType) => boolean;
}

export interface GatedCardProps {
  /** The exercise configuration */
  exerciseType: ExerciseType;
  /** Whether the user currently possesses Pro entitlement */
  hasPro: boolean;
  /** Callback invoked when the card is pressed */
  onPress: () => void;
}
