import { RecallWarmupContent, RecallWarmupResponse } from "@/src/domains/journey/learning/v1LearningEngineTypes";

// ponytail: single function to initialize or restore state securely
export function createRecallWarmupResponse(
  content: RecallWarmupContent,
  existing?: RecallWarmupResponse
): RecallWarmupResponse {
  if (existing) {
    return {
      ...existing,
      currentCardIndex: Math.max(0, Math.min(existing.currentCardIndex ?? 0, content.cards.length - 1)),
      cardPhase: existing.cardPhase === "answer" ? "answer" : "question",
      reviewSignals: existing.reviewSignals || {},
    };
  }

  return {
    format: "recall_warmup",
    phase: "card",
    currentCardIndex: 0,
    cardPhase: "question",
    reviewSignals: {},
  };
}
