import { WhatIfContent } from "./whatIfContent";
import { WhatIfResponse } from "./whatIfResponse";

// ponytail: single function to build state, bounded clamps
export function createWhatIfResponse(
  content: WhatIfContent,
  existing?: WhatIfResponse
): WhatIfResponse {
  if (existing) {
    return {
      ...existing,
      consequenceIndex: Math.max(0, Math.min(existing.consequenceIndex ?? 0, content.steps.length)),
    };
  }
  return {
    format: "what_if",
    phase: "prediction",
    selectedPredictionId: null,
    consequenceIndex: 0,
  };
}
