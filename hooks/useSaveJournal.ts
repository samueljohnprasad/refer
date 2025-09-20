import { useCallback, useState } from "react";
import { supabase } from "@/lib/supabase";
import { FeelingsType, InsightsType } from "@/network/genAi";
import { useAuth } from "@/context/AuthContext";

export interface JournalEntryRow extends InsightsType {
  id: string;
  created_at: string;
  user_id: string;
  date: string;
}

const formatDateKey = (date: Date): string => {
  // Convert to local date YYYY-MM-DD
  const tz = date.getTimezoneOffset() * 60000;
  const local = new Date(date.getTime() - tz);
  return local.toISOString().slice(0, 10);
};

export const useSaveJournal = () => {
  const { user } = useAuth();
  const [saving, setSaving] = useState<boolean>(false);

  const saveJournal = useCallback(
    async (input: InsightsType): Promise<JournalEntryRow> => {
      if (!user?.id) {
        throw new Error("Not authenticated");
      }
      setSaving(true);
      try {
        const row = {
          user_id: user.id,
          created_at: formatDateKey(new Date()),
          title: input.title,
          enrichedTranscript: input.enrichedTranscript,
          aiInsights: input.aiInsights,
          moodScore: input.moodScore ?? null,
          mainEmoji: input.mainEmoji ?? null,
          feelings: input.feelings,
          suggestedTags: input.suggestedTags,
          positiveInsights: input.positiveInsights,
        };

        const { data, error } = await supabase
          .from("journal_entries")
          .insert(row)
          .select()
          .single();

        console.log("errorerror", error, data);
        if (error) throw error;
        return data as JournalEntryRow;
      } catch (error) {
        console.error("Failed to save journal:", error);
        throw error;
      } finally {
        setSaving(false);
      }
    },
    [user?.id]
  );

  return { saveJournal, saving } as const;
};
