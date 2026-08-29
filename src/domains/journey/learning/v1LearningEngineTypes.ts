import type { Exercise } from "@/src/types/journeyV5";

export interface V1InteractionOptions {
  revealImmediately?: boolean;
}

export interface V1CategoryEngineProps {
  exercise: Exercise;
  savedResponse?: unknown;
  locked?: boolean;
  onInteraction: (
    response: Record<string, unknown>,
    /** Whether the current persistent-footer action is enabled. */
    isFooterActionEnabled?: boolean,
    options?: V1InteractionOptions,
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

export interface RecallWarmupResponse {
  format: "recall_warmup";
  phase: "intro" | "card" | "complete";
  currentCardIndex: number;
  cardPhase: "question" | "answer";
  reviewSignals: Record<string, "remembered" | "practice_again">;
}
