import { useAuth } from "@/src/context/AuthContext";
import { supabase } from "@/src/network/auth/supabase";
import { InsightsType } from "@/src/network/genAi";
import { Tables } from "@/types/types";
import { useCallback, useState } from "react";
import { getTodayDate } from "@/hooks/data/useStreakCalculation";
import { useUpdateStreak } from "@/hooks/data/useUpdateStreak";
import { useQueryClient } from "@tanstack/react-query";
import { useStreakReminders } from "@/hooks/notifications/useStreakReminders";
import { format } from "date-fns";

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
  const { sendMilestoneNotification } = useStreakReminders();
  const queryClient = useQueryClient();

  const saveJournal = useCallback(
    async (
      input: InsightsType,
      customDate?: Date
    ): Promise<Tables<"journal_entries">> => {
      if (!user?.id) {
        throw new Error("Not authenticated");
      }
      setSaving(true);
      try {
        const dateToUse = customDate || new Date();
        const row = {
          user_id: user.id,
          created_at: formatDateKey(new Date()),
          selected_date: format(dateToUse, "yyyy-MM-dd"),
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
          const streakResult = await updateStreakMutation.mutateAsync({
            userId: user.id,
            forceReset: false,
          });

          // Invalidate queries to refresh UI
          queryClient.invalidateQueries({ queryKey: ["userProfile"] });
          queryClient.invalidateQueries({ queryKey: ["journalEntries"] });
          queryClient.invalidateQueries({ queryKey: ["moods"] });

          // Check for new achievements
          try {
            // Send milestone notification based on current streak
            const { data: profile } = await supabase
              .from("profiles")
              .select("current_streak")
              .eq("id", user.id)
              .single();

            const currentStreak = profile?.current_streak ?? 0;

            // Send notification for milestone streaks
            const milestones = [1, 3, 7, 14, 30, 45, 60, 90, 100, 180, 365];
            if (milestones.includes(currentStreak)) {
              await sendMilestoneNotification(currentStreak);
            }
          } catch (achievementError) {
            console.error("Error checking achievements:", achievementError);
            // Don't fail if achievement check fails
          }
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
