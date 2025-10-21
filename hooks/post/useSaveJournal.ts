import { useAuth } from "@/src/context/AuthContext";
import { supabase } from "@/src/network/auth/supabase";
import { InsightsType } from "@/src/network/genAi";
import { Tables } from "@/types/types";
import { useCallback, useState } from "react";
import { getTodayDate } from "@/hooks/data/useStreakCalculation";
import { useUpdateStreak } from "@/hooks/data/useUpdateStreak";
import { useQueryClient } from "@tanstack/react-query";

export interface JournalEntryRow extends InsightsType {
  id: string;
  created_at: string;
  user_id: string;
  date: string;
}

const formatDateKey = (date: Date): string => {
  // Returns ISO 8601 string with timezone (e.g., "2025-09-25T18:32:20.000Z")
  return date.toISOString();
};

export const useSaveJournal = () => {
  const { user } = useAuth();
  const [saving, setSaving] = useState<boolean>(false);
  const updateStreakMutation = useUpdateStreak();
  const queryClient = useQueryClient();

  const saveJournal = useCallback(
    async (input: InsightsType): Promise<Tables<'journal_entries'>> => {
      if (!user?.id) {
        throw new Error("Not authenticated");
      }
      setSaving(true);
      try {
        const row = {
          user_id: user.id,
          created_at: formatDateKey(new Date()),
          selected_date: getTodayDate(),
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

        if (error) throw error;

        // Update streak after successful journal save
        try {
          await updateStreakMutation.mutateAsync({
            userId: user.id,
            forceReset: false,
          });
          
          // Invalidate queries to refresh UI
          queryClient.invalidateQueries({ queryKey: ["userProfile"] });
          queryClient.invalidateQueries({ queryKey: ["journalEntries"] });
          queryClient.invalidateQueries({ queryKey: ["moods"] });
        } catch (streakError) {
          console.error("Error updating streak:", streakError);
          // Don't fail the entire operation if streak update fails
        }

        return data;
      } catch (error) {
        console.error("Failed to save journal:", error);
        throw error;
      } finally {
        setSaving(false);
      }
    },
    [user?.id, updateStreakMutation, queryClient]
  );

  return { saveJournal, saving } as const;
};
