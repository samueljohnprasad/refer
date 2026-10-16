import { Tables } from "@/types/types";

// ponytail: decoupled AI insights type to work with journal_ai table
export type JournalAIInsightsExtended = {
  id: string;
  journal_entry_id: number;
  created_at: string;
  aiInsights: string | null;
  feelings: any | null;
  energyLevel: number | null;
  stressLevel: number | null;
  sleepQuality: number | null;
  achievements: string[] | null;
  worries: string[] | null;
  goals: string[] | null;
  triggers: string[] | null;
  copingStrategies: string[] | null;
  "physical-symptoms": string[] | null;
  physicalSymptoms?: string[] | null;
  cognitivePattern?: string | null;
  suggestedExerciseName?: string | null;
  suggestedExercise?: string | null;
  nextJournalPrompt?: string | null;
  strengthSpotlight?: string | null;
};

import type { ReflectionContextV1 } from "@/src/domains/journal/model/reflectionLineage";

export type JournalEntry = Tables<"journal_records"> & {
  journal_ai?: Tables<"journal_ai"> | null;
  moods?: Tables<"moods"> | null;
  journal_reflection_lineage?: ReflectionContextV1 | ReflectionContextV1[] | null;
};

