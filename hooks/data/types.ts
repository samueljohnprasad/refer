import { Tables } from "@/types/types";

export type JournalEntry = Tables<"journal_records"> & {
  journal_ai_insights: Tables<"journal_ai_insights"> | null;
  moods: Tables<"moods"> | null;
};
