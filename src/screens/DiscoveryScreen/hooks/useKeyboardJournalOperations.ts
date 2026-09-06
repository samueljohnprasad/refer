import { useCallback } from "react";
import { Alert, Keyboard } from "react-native";

export const MAX_JOURNAL_LENGTH = 7000;
export const CHAR_COUNT_THRESHOLD = MAX_JOURNAL_LENGTH * 0.8; // 80% (5,600 chars)
export const CHAR_COUNT_WARNING = MAX_JOURNAL_LENGTH * 0.95; // 95% (6,650 chars)

interface UseKeyboardJournalOperationsProps {
  isRealtimeActive: boolean;
  journalText: string;
  realtimeResult: string;
  enableAIInsights: boolean;
  saveDraft: (text: string) => Promise<void>;
  clearDraft: () => Promise<void>;
  setJournalText: (text: string) => void;
  onClose: () => void;
  onSubmit?: (text: string, enableAIInsights?: boolean) => void;
  onStop?: (text: string, enableAIInsights?: boolean) => void;
}

export const useKeyboardJournalOperations = ({
  isRealtimeActive,
  journalText,
  realtimeResult,
  enableAIInsights,
  saveDraft,
  clearDraft,
  setJournalText,
  onClose,
  onSubmit,
  onStop,
}: UseKeyboardJournalOperationsProps) => {
  const handleClose = useCallback(() => {
    if (isRealtimeActive) return;
    Keyboard.dismiss();
    if (journalText.trim().length > 0) {
      Alert.alert(
        "Save Draft?",
        "Your reflection will be saved so you can finish it later.",
        [
          {
            text: "Discard",
            style: "destructive",
            onPress: () => {
              void clearDraft();
              setJournalText("");
              onClose();
            },
          },
          {
            text: "Save & Close",
            onPress: () => {
              void saveDraft(journalText);
              onClose();
            },
          },
          { text: "Keep Writing", style: "cancel" },
        ]
      );
    } else {
      onClose();
    }
  }, [isRealtimeActive, journalText, clearDraft, saveDraft, setJournalText, onClose]);

  const handleSubmit = useCallback(() => {
    Keyboard.dismiss();
    const fullText = (journalText + (realtimeResult ? `\n\n${realtimeResult}` : "")).trim();
    if (fullText.length > 0) {
      void clearDraft();
      const handler = onSubmit || onStop;
      if (handler) {
        handler(fullText.substring(0, MAX_JOURNAL_LENGTH), enableAIInsights);
      }
    }
  }, [journalText, realtimeResult, enableAIInsights, onSubmit, onStop, clearDraft]);

  return {
    handleClose,
    handleSubmit,
  };
};
