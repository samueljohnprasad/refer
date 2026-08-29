import { CheckpointContent, CheckpointItem } from "./checkpointContent";
import { CheckpointResponse } from "./checkpointResponse";

// ponytail: single function to build state
export function createCheckpointResponse(
  content: CheckpointContent,
  existing?: CheckpointResponse
): CheckpointResponse {
  if (existing) {
    return {
      ...existing,
      currentItemIndex: Math.max(0, Math.min(existing.currentItemIndex ?? 0, content.items.length - 1)),
    };
  }
  return {
    format: "checkpoint",
    phase: "intro",
    currentItemIndex: 0,
    itemAttempts: {},
    itemOutcomes: {},
    currentMatchSelection: { leftId: null, rightId: null },
  };
}

// Helper to record an outcome
export function recordItemOutcome(
  response: CheckpointResponse,
  item: CheckpointItem,
  isCorrect: boolean
): CheckpointResponse {
  const attempts = response.itemAttempts[item.id] || 0;
  
  if (isCorrect) {
    const isFirstTry = attempts === 0;
    const existingOutcome = response.itemOutcomes[item.conceptId];
    
    // If it's already "review_soon", keep it. Otherwise, if it's the first try, it's "solid", else "review_soon".
    const newOutcome = existingOutcome === "review_soon" ? "review_soon" : (isFirstTry ? "solid" : "review_soon");
    
    return {
      ...response,
      itemOutcomes: { ...response.itemOutcomes, [item.conceptId]: newOutcome },
    };
  } else {
    // If they get it wrong, we can immediately mark the concept as review_soon.
    return {
      ...response,
      itemAttempts: { ...response.itemAttempts, [item.id]: attempts + 1 },
      itemOutcomes: { ...response.itemOutcomes, [item.conceptId]: "review_soon" },
    };
  }
}
