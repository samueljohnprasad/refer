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
import { formateDate_y_m_d } from "../data/date";

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
    async (input: InsightsType): Promise<void> => {
      if (!user?.id) {
        throw new Error("Not authenticated");
      }

      setSaving(true);
      try {
        // const row = {
        //   user_id: user.id,
        //   created_at: formatDateKey(new Date()),
        //   selected_date: format(dateToUse, "yyyy-MM-dd"),
        //   title: input.title,
        //   enrichedTranscript: input.enrichedTranscript,
        //   aiInsights: input.aiInsights,
        //   moodScore: input.moodScore ?? null,
        //   mainEmoji: input.mainEmoji ?? null,
        //   feelings: input.feelings,
        //   suggestedTags: input.suggestedTags,
        //   positiveInsights: input.positiveInsights,
        // };
        const journalRow: Insert<"journal_records"> = {
          user_id: user.id,
          duration_seconds: 0,
          transcripts: input.enrichedTranscript,
          input_type: "voice",
          title: input.title,
          selected_date: formateDate_y_m_d(selectedDate),
        };

        const { data: journalData, error: journalError } = await supabase
          .from("journal_records")
          .insert(journalRow)
          .select()
          .single();
        if (journalError) throw journalError;

        const aiInsights: Insert<"journal_ai_insights"> = {
          journal_entry_id: journalData.id,
          aiInsights: input.aiInsights,
          feelings: input.feelings,
          energyLevel: input.energyLevel,
          stressLevel: input.stressLevel,
          triggers: input.triggers,
          worries: input.worries,
          achievements: input.achievements,
          sleepQuality: input.sleepQuality,
        };

        const { data: insightsData, error: insightsError } = await supabase
          .from("journal_ai_insights")
          .insert(aiInsights)
          .select()
          .single();
        if (insightsError) throw insightsError;

        const mood: Insert<"moods"> = {
          user_id: user.id,
          main_mood: input.mainEmoji,
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

        queryClient.invalidateQueries({ queryKey: ["userProfile"] });
        queryClient.invalidateQueries({ queryKey: ["journal_records"] });
        queryClient.invalidateQueries({ queryKey: ["journal_ai_insights"] });
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
