import { Insert, Relationships, Tables } from "@/types/types";

export type JournalEntry = Insert<"journal_records"> & {
  journal_ai_insights: Insert<"journal_ai_insights"> | null;
  moods: Insert<"moods"> | null;
};

