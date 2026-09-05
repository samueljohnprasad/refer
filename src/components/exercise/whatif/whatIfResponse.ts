// ponytail: generic index signature for stable state saving
export interface WhatIfResponse {
  format: "what_if_machine";
  phase: "prediction" | "running" | "complete";
  selectedPredictionId: string | null;
  consequenceIndex: number;
  [key: string]: unknown;
}
