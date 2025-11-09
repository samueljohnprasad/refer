import { useState, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/src/network/auth/supabase";
import { useAuth } from "@/src/context/AuthContext";
import { formateDate_y_m_d } from "@/src/utils/date";

interface DeleteJournalParams {
  journalId: number;
  selectedDate: Date;
}

interface ToggleBookmarkParams {
  journalId: number;
  isBookmarked: boolean;
  selectedDate: Date;
}

export const useJournalOperations = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [deleting, setDeleting] = useState<boolean>(false);
  const [bookmarking, setBookmarking] = useState<boolean>(false);

  /**
   * Delete journal entry and associated data
   */
  const deleteJournal = useCallback(
    async ({ journalId, selectedDate }: DeleteJournalParams): Promise<void> => {
      if (!user?.id) {
        throw new Error("User not authenticated");
      }

      setDeleting(true);
      try {
        // Delete journal_ai_insights first (foreign key constraint)
        const { error: insightsError } = await supabase
          .from("journal_ai_insights")
          .delete()
          .eq("journal_entry_id", journalId);

        if (insightsError) {
          console.error("[deleteJournal] Error deleting insights:", insightsError);
          throw insightsError;
        }

        // Delete moods
        const { error: moodsError } = await supabase
          .from("moods")
          .delete()
          .eq("journal_entry_id", journalId);

        if (moodsError) {
          console.error("[deleteJournal] Error deleting moods:", moodsError);
          throw moodsError;
        }

        // Delete the journal record itself
        const { error: journalError } = await supabase
          .from("journal_records")
          .delete()
          .eq("id", journalId)
          .eq("user_id", user.id);

        if (journalError) {
          console.error("[deleteJournal] Error deleting journal:", journalError);
          throw journalError;
        }

        // Invalidate queries
        const formattedDate: string = formateDate_y_m_d(selectedDate);
        await queryClient.invalidateQueries({
          queryKey: ["journals_data", user?.id, formattedDate],
        });

        await queryClient.invalidateQueries({
          queryKey: ["bookmarked_journals", user?.id],
        });

        await queryClient.invalidateQueries({
          queryKey: ["moods"],
          refetchType: "active",
        });

        console.log("[deleteJournal] Successfully deleted journal:", journalId);
      } catch (error) {
        console.error("[deleteJournal] Failed to delete journal:", error);
        throw error;
      } finally {
        setDeleting(false);
      }
    },
    [user?.id, queryClient]
  );

  /**
   * Toggle bookmark status of journal entry
   */
  const toggleBookmark = useCallback(
    async ({
      journalId,
      isBookmarked,
      selectedDate,
    }: ToggleBookmarkParams): Promise<void> => {
      if (!user?.id) {
        throw new Error("User not authenticated");
      }

      setBookmarking(true);
      try {
        const newBookmarkStatus: boolean = !isBookmarked;
        const bookmarkedAt: string | null = newBookmarkStatus
          ? new Date().toISOString()
          : null;

        const updateData: {
          is_bookmarked: boolean;
          bookmarked_at: string | null;
        } = {
          is_bookmarked: newBookmarkStatus,
          bookmarked_at: bookmarkedAt,
        };

        const { error } = await supabase
          .from("journal_records")
          .update(updateData)
          .eq("id", journalId)
          .eq("user_id", user.id);

        if (error) {
          console.error("[toggleBookmark] Error:", error);
          throw error;
        }

        // Invalidate queries
        const formattedDate: string = formateDate_y_m_d(selectedDate);
        await queryClient.invalidateQueries({
          queryKey: ["journals_data", user?.id, formattedDate],
        });

        await queryClient.invalidateQueries({
          queryKey: ["bookmarked_journals", user?.id],
        });

        console.log("[toggleBookmark] Successfully toggled bookmark:", {
          journalId,
          newStatus: newBookmarkStatus,
        });
      } catch (error) {
        console.error("[toggleBookmark] Failed to toggle bookmark:", error);
        throw error;
      } finally {
        setBookmarking(false);
      }
    },
    [user?.id, queryClient]
  );

  return {
    deleteJournal,
    toggleBookmark,
    deleting,
    bookmarking,
  };
};
