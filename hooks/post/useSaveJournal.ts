import { useAuth } from "@/src/context/AuthContext";
import { supabase } from "@/src/network/auth/supabase";
import { InsightsType } from "@/src/network/genAi";
import { useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { selectedDateDiscoveryAtom } from "@/src/screens/DiscoveryScreen/helpers";
import { useAtomValue } from "jotai";
import { Insert } from "@/types/types";
import { formateDate_y_m_d } from "../../src/utils/date";
import { JournalEntry } from "../data/types";
import { getMoodScore } from "@/src/utils/mood";
import { countWords } from "@/src/utils/textUtils";
import { useXPOptional } from "@/src/context/XPContext";
import { XPActionType } from "@/src/types/xp";
import { useRewardsContext } from "@/src/context/RewardsContext";
import { useChallengesOptional } from "@/src/context/ChallengesContext";

export interface JournalEntryRow extends InsightsType {
  id: string;
  created_at: string;
  user_id: string;
  date: string;
}

export const useSaveJournal = () => {
  const { user } = useAuth();
  const [saving, setSaving] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const selectedDate = useAtomValue(selectedDateDiscoveryAtom);
  const xp = useXPOptional();
  const { earnCoinsForAction } = useRewardsContext();
  const challenges = useChallengesOptional();

  const saveJournal = useCallback(
    async (input: JournalEntry): Promise<void> => {
      if (!user?.id) {
        throw new Error("Not authenticated");
      }

      setSaving(true);
      const formattedDate: string = formateDate_y_m_d(selectedDate);
      const queryKey = ["journals_data", user.id, formattedDate];
      const moodScore = getMoodScore(input.moods?.main_mood);

      await queryClient.cancelQueries({ queryKey });
      const previousJournals = queryClient.getQueryData<JournalEntry[]>(queryKey);
      
      const previousDailyMoods = queryClient.getQueriesData<Map<string, number>>({
        queryKey: ["daily-moods", user.id],
      });

      const optimisticJournal = {
        ...input,
        id: input.id || Date.now(),
        user_id: user.id,
        selected_date: selectedDate.toISOString(),
        words_count: countWords(input.transcripts || ""),
      } as JournalEntry;

      queryClient.setQueryData<JournalEntry[]>(queryKey, (old) => {
        if (!old) return [optimisticJournal];
        const existingIndex = old.findIndex(j => j.id === optimisticJournal.id);
        if (existingIndex >= 0) {
          const newArr = [...old];
          newArr[existingIndex] = { ...newArr[existingIndex], ...optimisticJournal };
          return newArr;
        }
        return [...old, optimisticJournal];
      });

      if (moodScore !== null && moodScore !== undefined) {
        queryClient.setQueriesData<Map<string, number>>({
          queryKey: ["daily-moods", user.id],
        }, (oldMap) => {
          if (!oldMap) return oldMap;
          const newMap = new Map(oldMap);
          newMap.set(formattedDate, Math.round(moodScore));
          return newMap;
        });
      }

      try {
        const journalRow: Insert<"journal_records"> = {
          id: input.id,
          user_id: user.id,
          duration_seconds: input.duration_seconds || 0,
          transcripts: input.transcripts,
          input_type: input.input_type,
          title: input.title,
          selected_date: selectedDate.toISOString(),
          words_count: countWords(input.transcripts || ""),
        };

        const { data: journalData, error: journalError } = await supabase
          .from("journal_records")
          .upsert(journalRow, { onConflict: "id" })
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
          .upsert(aiInsights, { onConflict: "journal_entry_id" })
          .select()
          .single();
        if (insightsError) throw insightsError;

        const mood: Insert<"moods"> = {
          user_id: user.id,
          main_mood: input.moods?.main_mood,
          selected_date: selectedDate.toISOString(),
          input_method: "journal",
          journal_entry_id: journalData.id,
          mood_score: getMoodScore(input.moods?.main_mood),
        };

        const { error: moodError } = await supabase
          .from("moods")
          .upsert(mood, { onConflict: "journal_entry_id" })
          .select()
          .single();
        if (moodError) throw moodError;

        // Award XP based on input type
        if (input.input_type === "voice") {
          xp?.awardXP(XPActionType.VOICE_JOURNAL);
          earnCoinsForAction("VOICE_JOURNAL");
          challenges?.updateProgress("voice_journal");
        } else if (input.input_type === "image") {
          xp?.awardXP(XPActionType.IMAGE_JOURNAL);
          earnCoinsForAction("IMAGE_JOURNAL");
          challenges?.updateProgress("image_journal");
        } else {
          xp?.awardXP(XPActionType.JOURNAL_ENTRY);
          earnCoinsForAction("JOURNAL_ENTRY");
        }
        // Update journal count challenge
        challenges?.updateProgress("journal_count");

        await queryClient.invalidateQueries({ queryKey });

        // Invalidate mood-related queries
        await queryClient.invalidateQueries({
          queryKey: ["daily-moods"],
          refetchType: "active",
        });
        await queryClient.invalidateQueries({
          queryKey: ["daily-moods-intervals"],
          refetchType: "active",
        });

        // Invalidate streak query
        if (user?.id) {
          await queryClient.invalidateQueries({ queryKey: ["streak", user.id] });
        }
      } catch (error) {
        if (previousJournals) {
          queryClient.setQueryData(queryKey, previousJournals);
        }
        previousDailyMoods.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
        throw error;
      } finally {
        setSaving(false);
      }
    },
    [user?.id, queryClient, selectedDate, logStreakIfNeeded],
  );

  const saveJournalQuick = useCallback(
    async (
      text: string,
      options: {
        inputType: "typing" | "voice";
        duration?: number;
      } = { inputType: "typing" },
    ): Promise<void> => {
      const basicJournalEntry: JournalEntry = {
        transcripts: text,
        title: text.substring(0, 30).trim() + (text.length > 30 ? "..." : ""),
        input_type: options.inputType,
        duration_seconds: Math.round(options.duration || 0),
        moods: {
          main_mood: "fine",
        },
        journal_ai_insights: null,
        words_count: countWords(text),
      };

      await saveJournal(basicJournalEntry);
    },
    [saveJournal],
  );

  return { saveJournal, saveJournalQuick, saving };
};
