import { useMemo, useCallback, useState, useEffect } from "react";
import * as Haptics from "expo-haptics";

interface UseJournalingOptionsViewModelOptions {
  allPrompts: string[];
  currentPrompt: string;
  onClose: () => void;
  onSelectPrompt: (prompt: string) => void;
  onScanJournal?: () => void;
}

export interface JournalingOptionsViewModel {
  displayPrompts: string[];
  selectedPrompt: string;
  handleSelectPrompt: (prompt: string) => void;
  handleScanJournal: () => void;
}

// ponytail: prompt selection hook managing prompt filtering and feedback timing
export function useJournalingOptionsViewModel({
  allPrompts,
  currentPrompt,
  onClose,
  onSelectPrompt,
  onScanJournal,
}: UseJournalingOptionsViewModelOptions): JournalingOptionsViewModel {
  // ponytail: local selection gives instant highlight feedback before sheet dismiss
  const [selectedPrompt, setSelectedPrompt] = useState<string>(currentPrompt);

  useEffect(() => {
    setSelectedPrompt(currentPrompt);
  }, [currentPrompt]);

  const displayPrompts = useMemo((): string[] => {
    const validPrompts = (allPrompts || []).filter(
      (p): p is string => Boolean(p) && p !== "Free Write" && typeof p === "string"
    );
    const otherPrompts = validPrompts.filter((p) => p !== currentPrompt);
    return [currentPrompt, ...otherPrompts].slice(0, 5);
  }, [allPrompts, currentPrompt]);

  const handleSelectPrompt = useCallback(
    (prompt: string): void => {
      setSelectedPrompt(prompt);
      void Haptics.selectionAsync().catch(() => {});
      // ponytail: 150ms gives clear visual checkmark tick before sheet dismisses
      setTimeout(() => {
        onSelectPrompt(prompt);
        onClose();
      }, 150);
    },
    [onSelectPrompt, onClose]
  );

  const handleScanJournal = useCallback((): void => {
    void Haptics.selectionAsync().catch(() => {});
    onScanJournal?.();
    setTimeout(onClose, 120);
  }, [onScanJournal, onClose]);

  return {
    displayPrompts,
    selectedPrompt,
    handleSelectPrompt,
    handleScanJournal,
  };
}
