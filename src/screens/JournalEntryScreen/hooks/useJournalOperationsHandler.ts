import { useState, useCallback } from "react";
import { Alert } from "react-native";
import * as Haptics from "expo-haptics";
import { useToast } from "heroui-native";
import { useSaveJournal } from "@/hooks/post/useSaveJournal";
import { useJournalOperations } from "@/hooks/journals/useJournalOperations";
import { JournalEntry } from "@/hooks/data/types";
import { Enums } from "@/database.types";
import { createLogger } from "@/src/lib/logger";

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
  const { saveJournal } = useSaveJournal();
  const { deleteJournal, toggleBookmark } = useJournalOperations();
  const [isBookmarked, setIsBookmarked] = useState<boolean>(entry?.is_bookmarked ?? false);

  const handleDeleteEntry = useCallback((): void => {
    if (!entry?.id) return;
    Alert.alert(
      "Delete Reflection",
      "Are you sure you want to delete this journal entry? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async (): Promise<void> => {
            try {
              await deleteJournal({
                journalId: entry.id,
                selectedDate: entry.selected_date ? new Date(entry.selected_date) : new Date(),
              });
              toast.show({
                placement: "top",
                variant: "success",
                label: "Entry deleted",
              });
              onClose?.();
            } catch (error) {
              log.error("Error deleting entry:", error);
            }
          },
        },
      ]
    );
  }, [entry, deleteJournal, toast, onClose]);

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
          label: "Please enter journal text before saving",
        });
        return;
      }

      await saveJournal(updatedInsights);
      toast.show({
        placement: "top",
        variant: "success",
        label: "Journal saved successfully",
      });
      onClose?.();
    } catch (error) {
      log.error("Failed to save journal entry", error);
      toast.show({
        placement: "bottom",
        variant: "danger",
        label: "Failed to save journal",
      });
    }
  }, [saveJournal, insights, journalText, selectedMood, toast, onClose, entry]);

  const handleToggleBookmark = useCallback(async (): Promise<void> => {
    if (!entry?.id) return;
    const newStatus = !isBookmarked;
    setIsBookmarked(newStatus);
    Haptics.selectionAsync();
    toast.show({
      placement: "top",
      variant: "success",
      label: newStatus ? "Entry bookmarked" : "Bookmark removed",
    });

    try {
      await toggleBookmark({
        journalId: entry.id,
        selectedDate: entry.selected_date ? new Date(entry.selected_date) : new Date(),
        isBookmarked: !newStatus,
      });
    } catch {
      setIsBookmarked(!newStatus);
    }
  }, [entry, isBookmarked, toast, toggleBookmark]);

  return {
    isBookmarked,
    handleDeleteEntry,
    handleContinue,
    handleToggleBookmark,
  };
};
