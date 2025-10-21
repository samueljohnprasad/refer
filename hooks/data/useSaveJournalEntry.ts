import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/src/network/auth/supabase";
import { InsightsType } from "@/src/network/genAi";
import { useUpdateStreak } from "./useUpdateStreak";
import { getTodayDate } from "./useStreakCalculation";

interface SaveJournalEntryParams {
  userId: string;
  insights: InsightsType;
  transcripts: string[];
  durationSeconds?: number;
  selectedDate?: string;
}

interface SaveJournalEntryResult {
  journalEntryId: number;
  streakUpdated: boolean;
  newStreak: number;
}

/**
 * Hook to save journal entry and update streak
 */
export const useSaveJournalEntry = () => {
  const queryClient = useQueryClient();
  const updateStreakMutation = useUpdateStreak();

  return useMutation({
    mutationFn: async ({
      userId,
      insights,
      transcripts,
      durationSeconds,
      selectedDate,
    }: SaveJournalEntryParams): Promise<SaveJournalEntryResult> => {
      // 1. Save journal entry to database
      const { data: journalEntry, error: saveError } = await supabase
        .from("journal_entries")
        .insert({
          user_id: userId,
          title: insights.title || "Untitled Entry",
          enrichedTranscript: insights.enrichedTranscript || transcripts.join(" "),
          summary: insights.summary,
          moodScore: insights.moodScore,
          mainEmoji: insights.mainEmoji,
          feelings: insights.feelings as any,
          suggestedTags: insights.suggestedTags,
          positiveInsights: insights.positiveInsights,
          aiInsights: insights.aiInsights,
          duration_seconds: durationSeconds,
          selected_date: selectedDate || getTodayDate(),
        })
        .select("id")
        .single();

      if (saveError) {
        console.error("Error saving journal entry:", saveError);
        throw new Error("Failed to save journal entry");
      }

      if (!journalEntry) {
        throw new Error("Journal entry was not created");
      }

      // 2. Update streak (only if journaling for today)
      const isToday = !selectedDate || selectedDate === getTodayDate();
      let streakUpdated = false;
      let newStreak = 0;

      if (isToday) {
        try {
          const streakResult = await updateStreakMutation.mutateAsync({
            userId,
            forceReset: false,
          });
          
          streakUpdated = true;
          newStreak = streakResult.current_streak;
        } catch (error) {
          console.error("Error updating streak:", error);
          // Don't fail the entire operation if streak update fails
        }
      }

      return {
        journalEntryId: journalEntry.id,
        streakUpdated,
        newStreak,
      };
    },
    onSuccess: (data) => {
      // Invalidate relevant queries to refresh UI
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      queryClient.invalidateQueries({ queryKey: ["journalEntries"] });
      queryClient.invalidateQueries({ queryKey: ["moods"] });
      
      console.log("Journal entry saved successfully:", data);
    },
    onError: (error) => {
      console.error("Failed to save journal entry:", error);
    },
  });
};
