import { useState, useCallback } from "react";
import { Alert } from "react-native";
import * as Haptics from "expo-haptics";
import { useToast } from "heroui-native";
import { useSaveJournal } from "@/hooks/post/useSaveJournal";
import { useJournalOperations } from "@/hooks/journals/useJournalOperations";
import { JournalEntry } from "@/hooks/data/types";
import { Enums } from "@/database.types";
import { createLogger } from "@/src/lib/logger";
import { usePostHog } from "posthog-react-native";
import { requestReviewForMilestone } from "@/src/hooks/useReviewPrompt";
import { useTranslation } from "react-i18next";

const log = createLogger("useJournalOperationsHandler");

interface UseJournalOperationsHandlerProps {
  entry?: JournalEntry | null;
  insights?: unknown;
  journalText: string;
  selectedMood: Enums<"mood">;
  onClose?: () => void;
}

export const useJournalOperationsHandler = ({
  entry,
  insights,
  journalText,
  selectedMood,
  onClose,
}: UseJournalOperationsHandlerProps) => {
  const { toast } = useToast();
  const { t } = useTranslation("journal");
  const { saveJournal } = useSaveJournal();
  const { deleteJournal, toggleBookmark } = useJournalOperations();
  const posthog = usePostHog();
  const [isBookmarked, setIsBookmarked] = useState<boolean>(entry?.is_bookmarked ?? false);

  const handleDeleteEntry = useCallback((): void => {
    if (!entry?.id) return;
    Alert.alert(
      t("entryDetail.deleteTitle"),
      t("entryDetail.deleteMessage"),
      [
        { text: t("delete.cancel"), style: "cancel" },
        {
          text: t("delete.confirm"),
          style: "destructive",
          onPress: async (): Promise<void> => {
            try {
              await deleteJournal({
                journalId: entry.id,
                selectedDate: entry.selected_date ? new Date(entry.selected_date) : new Date(),
              });
              posthog?.capture("journal_entry_deleted");
              toast.show({
                placement: "top",
                variant: "success",
                label: t("entryDetail.deleted"),
              });
              onClose?.();
            } catch (error) {
              log.error("Error deleting entry:", error);
            }
          },
        },
      ]
    );
  }, [entry, deleteJournal, toast, onClose, posthog, t]);

  const handleContinue = useCallback(async (): Promise<void> => {
    try {
      if (!insights) return;

      const updatedInsights = {
        ...entry,
        transcripts: journalText,
        moods: entry?.moods
          ? {
              ...entry.moods,
              main_mood: selectedMood,
            }
          : { main_mood: selectedMood },
      } as JournalEntry;

      if (!journalText.trim()) {
        log.warn("Attempted to save empty journal entry text");
        toast.show({
          placement: "top",
          variant: "warning",
          label: t("entryDetail.emptyTextError"),
        });
        return;
      }

      await saveJournal(updatedInsights);
      posthog?.capture("journal_entry_saved");
      toast.show({
        placement: "top",
        variant: "success",
        label: t("entryDetail.saved"),
      });
      // ponytail: trigger Day-1 App Store review prompt 2.0s after first journal save
      setTimeout(() => {
        void requestReviewForMilestone("first_journal_saved");
      }, 2000);
      onClose?.();
    } catch (error) {
      log.error("Failed to save journal entry", error);
      toast.show({
        placement: "bottom",
        variant: "danger",
        label: t("entryDetail.saveError"),
      });
    }
  }, [saveJournal, insights, journalText, selectedMood, toast, onClose, entry, posthog, t]);

  const handleToggleBookmark = useCallback(async (): Promise<void> => {
    if (!entry?.id) return;
    const newStatus = !isBookmarked;
    setIsBookmarked(newStatus);
    Haptics.selectionAsync();
    toast.show({
      placement: "top",
      variant: "success",
      label: t(newStatus ? "entryDetail.bookmarked" : "entryDetail.bookmarkRemoved"),
    });

    try {
      await toggleBookmark({
        journalId: entry.id,
        selectedDate: entry.selected_date ? new Date(entry.selected_date) : new Date(),
        isBookmarked: !newStatus,
      });
      posthog?.capture("journal_entry_bookmark_toggled", {
        bookmarked: newStatus,
      });
    } catch {
      setIsBookmarked(!newStatus);
    }
  }, [entry, isBookmarked, toast, toggleBookmark, posthog, t]);

  return {
    isBookmarked,
    handleDeleteEntry,
    handleContinue,
    handleToggleBookmark,
  };
};
