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

export type JournalEntry = Tables<"journal_records"> & {
  journal_ai_insights: JournalAIInsightsExtended | null;
  journal_ai?: Tables<"journal_ai"> | null;
  moods: Tables<"moods"> | null;
};

