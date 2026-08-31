import type { Exercise } from "@/src/types/journeyV5";
import type { CourseExerciseCategoryConfig } from "@/src/components/exercise/courseExerciseCategoryConfig";

export interface V1CategoryEngineProps {
  exercise: Exercise;
  savedResponse?: unknown;
  locked?: boolean;
  config?: CourseExerciseCategoryConfig;
  onInteraction: (
    response: Record<string, unknown>,
    /** Whether the current persistent-footer action is enabled. */
    isFooterActionEnabled?: boolean,
  ) => void;
}

export interface RecallCard {
  id: string;
  conceptId: string;
  question: string;
  answer: string;
}

export interface RecallWarmupContent {
  type: "recall_warmup";
  cards: RecallCard[];
}

export interface RecallWarmupResponse extends Record<string, unknown> {
  format: "recall_warmup";
  phase: "intro" | "card" | "complete";
  currentCardIndex: number;
  cardPhase: "question" | "answer";
  reviewSignals: Record<string, "remembered" | "practice_again">;
}
