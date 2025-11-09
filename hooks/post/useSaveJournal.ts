import { useAuth } from "@/src/context/AuthContext";
import { supabase } from "@/src/network/auth/supabase";
import { InsightsType } from "@/src/network/genAi";
import { useCallback, useState } from "react";
import { useUpdateStreak } from "@/hooks/data/useUpdateStreak";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { selectedDateDiscoveryAtom } from "@/src/screens/DiscoveryScreen/helpers";
import { useAtomValue } from "jotai";
import { Insert } from "@/types/types";
import { formateDate_y_m_d } from "../../src/utils/date";
import { JournalEntry } from "../data/types";

export interface JournalEntryRow extends InsightsType {
  id: string;
  created_at: string;
  user_id: string;
  date: string;
}

export const useSaveJournal = () => {
  const { user } = useAuth();
  const [saving, setSaving] = useState<boolean>(false);
  const updateStreakMutation = useUpdateStreak();
  const queryClient = useQueryClient();
  const selectedDate = useAtomValue(selectedDateDiscoveryAtom);
  const saveJournal = useCallback(
    async (input: JournalEntry): Promise<void> => {
      if (!user?.id) {
        throw new Error("Not authenticated");
      }

      setSaving(true);
      try {
        const journalRow: Insert<"journal_records"> = {
          user_id: user.id,
          duration_seconds: 0,
          transcripts: input.transcripts,
          input_type: "voice",
          title: input.title,
          selected_date: selectedDate.toISOString(),
        };

        const { data: journalData, error: journalError } = await supabase
          .from("journal_records")
          .insert(journalRow)
          .select()
          .single();
        if (journalError) throw journalError;

        const aiInsights: Insert<"journal_ai_insights"> = {
          journal_entry_id: journalData.id,
          aiInsights: input.journal_ai_insights?.aiInsights,
          feelings: input.journal_ai_insights?.feelings,
          energyLevel: input.journal_ai_insights?.energyLevel,
          stressLevel: input.journal_ai_insights?.stressLevel,
          triggers: input.journal_ai_insights?.triggers,
          worries: input.journal_ai_insights?.worries,
          achievements: input.journal_ai_insights?.achievements,
          sleepQuality: input.journal_ai_insights?.sleepQuality,
        };

        const { data: insightsData, error: insightsError } = await supabase
          .from("journal_ai_insights")
          .insert(aiInsights)
          .select()
          .single();
        if (insightsError) throw insightsError;

        const mood: Insert<"moods"> = {
          user_id: user.id,
          main_mood: input.moods?.main_mood,
          selected_date: format(selectedDate, "yyyy-MM-dd"),
          input_method: "journal",
          journal_entry_id: journalData.id,
        };

        const { error: moodError } = await supabase
          .from("moods")
          .insert(mood)
          .select()
          .single();
        if (moodError) throw moodError;

        const streakResult = await updateStreakMutation.mutateAsync({
          userId: user.id,
          forceReset: false,
        });

        const formattedDate = formateDate_y_m_d(selectedDate);
        queryClient.invalidateQueries({
          queryKey: ["journals_data", user?.id, formattedDate],
        });
      } catch (error) {
        console.error("Failed to save journal:", error);
        throw error;
      } finally {
        setSaving(false);
      }
    },
    [user?.id, updateStreakMutation, queryClient, selectedDate]
  );

  return { saveJournal, saving };
};
