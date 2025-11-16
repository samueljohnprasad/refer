import { useState, useCallback } from "react";
import { FeelingsType } from "@/src/network/genAi";
import { BackupState } from "../types";

interface UseJournalEditProps {
  initialTags: FeelingsType[];
  initialText: string;
}

interface UseJournalEditReturn {
  isEditing: boolean;
  tags: FeelingsType[];
  journalText: string;
  backupState: BackupState;
  setTags: (
    tags: FeelingsType[] | ((prev: FeelingsType[]) => FeelingsType[])
  ) => void;
  setJournalText: (text: string) => void;
  handleEdit: () => void;
  handleDone: () => void;
  handleClose: (onClose?: () => void) => void;
}

/**
 * Hook to manage journal editing state and actions
 * Handles edit mode, backup/restore of changes
 */
export const useJournalEdit = ({
  initialEmoji,
  initialTags,
  initialText,
}: UseJournalEditProps): UseJournalEditReturn => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [selectedEmoji, setSelectedEmoji] = useState<string>(initialEmoji);
  const [tags, setTags] = useState<FeelingsType[]>(initialTags);
  const [journalText, setJournalText] = useState<string>(initialText);
  const [backupState, setBackupState] = useState<BackupState>({
    selectedEmoji: "",
    tags: [],
    journalText: "",
  });

  const handleEdit = useCallback((): void => {
    setBackupState({
      selectedEmoji,
      tags,
      journalText,
    });
    setIsEditing(true);
  }, [selectedEmoji, tags, journalText]);

  const handleDone = useCallback((): void => {
    setIsEditing(false);
  }, []);

  const handleClose = useCallback(
    (onClose?: () => void): void => {
      if (isEditing) {
        // Restore backup state if editing and exit edit mode (don't close modal)
        setSelectedEmoji(backupState.selectedEmoji);
        setTags(backupState.tags);
        setJournalText(backupState.journalText);
        setIsEditing(false);
      } else {
        // Only close modal when not editing
        onClose?.();
      }
    },
    [isEditing, backupState]
  );

  return {
    isEditing,
    tags,
    journalText,
    backupState,
    setTags,
    setJournalText,
    handleEdit,
    handleDone,
    handleClose,
  };
};
