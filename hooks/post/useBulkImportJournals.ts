import { useState, useCallback } from "react";
import { format, addDays } from "date-fns";
import { useAuth } from "@/src/context/AuthContext";
import { supabase } from "@/src/network/auth/supabase";
import { InsightsType } from "@/src/network/genAi";
import { useQueryClient } from "@tanstack/react-query";
import { Insert } from "@/types/types";
import { getMoodScore } from "@/src/utils/mood";
import sampleData from "@/src/network/sample_insights_20.json";

export const useBulkImportJournals = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [importing, setImporting] = useState<boolean>(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  const bulkImport = useCallback(
    async (startDate: Date, count: number): Promise<void> => {
      if (!user?.id) {
        throw new Error("Not authenticated");
      }

      if (count <= 0 || count > 20) {
        throw new Error("Count must be between 1 and 20");
      }

      setImporting(true);
      setProgress({ current: 0, total: count });

      try {
        // Process entries one by one to ensure proper database relationships
        for (let i = 0; i < count; i++) {
          const currentDate = addDays(startDate, i);
          const randomIndex = Math.floor(Math.random() * sampleData.length);
          const entryData = sampleData[randomIndex] as InsightsType;
          
          
          // 1. Create journal record
          const journalRow: Insert<"journal_records"> = {
            user_id: user.id,
            duration_seconds: Math.floor(Math.random() * 300) + 60, // 1-5 minutes
            transcripts: entryData.enrichedTranscript || `Sample journal entry for ${format(currentDate, "MMMM do, yyyy")}.`,
            input_type: "voice",
            title: entryData.title || `Journal Entry ${i + 1}`,
            selected_date: currentDate.toISOString(),
            is_bookmarked: false,
          };

          const { data: journalData, error: journalError } = await supabase
            .from("journal_records")
            .insert(journalRow)
            .select()
            .single();
            
          if (journalError) {
            console.error(`Failed to insert journal ${i + 1}:`, journalError);
            throw journalError;
          }

          // 2. Create AI insights
          const aiInsights: Insert<"journal_ai_insights"> = {
            journal_entry_id: journalData.id,
            aiInsights: entryData.aiInsights,
            feelings: entryData.feelings,
            energyLevel: entryData.energyLevel || Math.floor(Math.random() * 5) + 1,
            stressLevel: entryData.stressLevel || Math.floor(Math.random() * 5) + 1,
            triggers: entryData.triggers || [],
            worries: entryData.worries || [],
            achievements: entryData.achievements || [],
            sleepQuality: entryData.sleepQuality || Math.floor(Math.random() * 5) + 1,
          };

          const { error: insightsError } = await supabase
            .from("journal_ai_insights")
            .insert(aiInsights);
            
          if (insightsError) {
            console.error(`Failed to insert AI insights ${i + 1}:`, insightsError);
            throw insightsError;
          }

          // 3. Create mood entry
          const mood: Insert<"moods"> = {
            user_id: user.id,
            main_mood: entryData.mainEmoji,
            selected_date: currentDate.toISOString(),
            input_method: "journal",
            journal_entry_id: journalData.id,
            mood_score: getMoodScore(entryData.mainEmoji),
          };

          const { error: moodError } = await supabase
            .from("moods")
            .insert(mood);
            
          if (moodError) {
            console.error(`Failed to insert mood ${i + 1}:`, moodError);
            throw moodError;
          }

          // Update progress
          setProgress({ current: i + 1, total: count });
          
          // Small delay to prevent overwhelming the database
          await new Promise(resolve => setTimeout(resolve, 100));
        }

        // Invalidate all relevant queries to refresh UI
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ["userProfile"] }),
          queryClient.invalidateQueries({ queryKey: ["moods"] }),
          queryClient.invalidateQueries({ queryKey: ["daily-moods"] }),
          queryClient.invalidateQueries({ queryKey: ["daily-moods-range"] }),
          queryClient.invalidateQueries({ queryKey: ["journals_data"] }),
          queryClient.invalidateQueries({ queryKey: ["weeklyAISummary"] }),
        ]);
      } catch (error) {
        console.error("Failed to bulk import journals:", error);
        throw error;
      } finally {
        setImporting(false);
        setTimeout(() => {
          setProgress({ current: 0, total: 0 });
        }, 1000);
      }
    },
    [user?.id, queryClient]
  );

  return { bulkImport, importing, progress } as const;
};
