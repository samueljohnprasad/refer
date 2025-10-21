import { useState, useCallback } from "react";
import { format, addDays } from "date-fns";
import { useAuth } from "@/src/context/AuthContext";
import { supabase } from "@/src/network/auth/supabase";
import { InsightsType } from "@/src/network/genAi";
import { useQueryClient } from "@tanstack/react-query";
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
        const rows = [];
        
        // Prepare all rows for bulk insert
        for (let i = 0; i < count; i++) {
          const currentDate = addDays(startDate, i);
          // Randomly select an entry from the sample data
          const randomIndex = Math.floor(Math.random() * sampleData.length);
          const entryData = sampleData[randomIndex] as InsightsType;
          
          const row = {
            user_id: user.id,
            created_at: currentDate.toISOString(),
            selected_date: format(currentDate, "yyyy-MM-dd"),
            title: entryData.title,
            enrichedTranscript: entryData.enrichedTranscript,
            aiInsights: entryData.aiInsights,
            moodScore: entryData.moodScore ?? null,
            mainEmoji: entryData.mainEmoji ?? null,
            feelings: entryData.feelings,
            suggestedTags: entryData.suggestedTags,
            positiveInsights: entryData.positiveInsights,
          };
          
          rows.push(row);
        }

        // Bulk insert all rows
        const { error } = await supabase
          .from("journal_entries")
          .insert(rows);

        if (error) throw error;

        // Invalidate queries to refresh UI
        queryClient.invalidateQueries({ queryKey: ["userProfile"] });
        queryClient.invalidateQueries({ queryKey: ["journalEntries"] });
        queryClient.invalidateQueries({ queryKey: ["moods"] });

        setProgress({ current: count, total: count });
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
