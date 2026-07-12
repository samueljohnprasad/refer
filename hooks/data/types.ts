import { Tables } from "@/types/types";

/**
 * Extends the DB journal_ai_insights type with new CBT-informed fields
 * generated at analysis time. These fields are available immediately after
 * analysis but require a DB migration to be persisted long-term.
 */
export type JournalAIInsightsExtended = Tables<"journal_ai_insights"> & {
  cognitivePattern?: string | null;
  suggestedExerciseName?: string | null;
  suggestedExercise?: string | null;
  nextJournalPrompt?: string | null;
  strengthSpotlight?: string | null;
};

export type JournalEntry = Tables<"journal_records"> & {
  journal_ai_insights: JournalAIInsightsExtended | null;
  moods: Tables<"moods"> | null;
};

