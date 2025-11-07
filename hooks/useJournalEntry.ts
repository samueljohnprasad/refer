import { useCallback, useMemo, useState } from "react";

export interface UseJournalEntryReturn {
  currentPrompt: string;
  shufflePrompt: () => void;
}

export const useJournalEntry = (): UseJournalEntryReturn => {
  const dailyPrompts: string[] = useMemo(
    () => [
      "What made you smile today?",
      "What challenged you today, and how did you respond?",
      "One thing you are grateful for right now?",
      "What did you learn about yourself today?",
      "How can you take care of yourself better tomorrow?",
    ],
    []
  );

  const [currentPrompt, setCurrentPrompt] = useState<string>(dailyPrompts[0]);

  const shufflePrompt = useCallback((): void => {
    const next = dailyPrompts[Math.floor(Math.random() * dailyPrompts.length)];
    setCurrentPrompt(next);
  }, [dailyPrompts]);

  return {
    currentPrompt,
    shufflePrompt,
  };
};
