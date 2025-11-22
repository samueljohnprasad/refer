import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useMemo, useState } from "react";

export interface UseJournalEntryReturn {
  currentPrompt: string;
  shufflePrompt: () => void;
  setPrompt: (prompt: string) => void;
  allPrompts: string[];
}

const PROMPT_STORAGE_KEY = "current_journal_prompt";

export const useJournalEntry = (): UseJournalEntryReturn => {
  const dailyPrompts: string[] = useMemo(
    () => [
      "What made you smile today?",
      "What challenged you today, and how did you respond?",
      "One thing you are grateful for right now?",
      "What did you learn about yourself today?",
      "How can you take care of yourself better tomorrow?",
      "What is a small win you had today?",
      "Describe a moment where you felt at peace.",
      "Who is someone you appreciate, and why?",
      "What is one thing you want to let go of?",
      "If you could change one thing about today, what would it be?",
      "What are you looking forward to this week?",
      "How did you practice self-care today?",
      "What is a fear you faced or want to face?",
      "Write about a recent accomplishment.",
      "What does your ideal day look like?",
      "What energy do you want to bring into tomorrow?",
      "Describe your mood in three words.",
      "What is a habit you want to build?",
      "Who made a positive impact on your day?",
      "What is something beautiful you saw today?",
    ],
    []
  );

  const [currentPrompt, setCurrentPrompt] = useState<string>(dailyPrompts[0]);

  // Load saved prompt on mount
  useEffect(() => {
    const loadPrompt = async () => {
      try {
        const saved = await AsyncStorage.getItem(PROMPT_STORAGE_KEY);
        if (saved) {
          setCurrentPrompt(saved);
        }
      } catch (error) {
        console.error("Failed to load prompt:", error);
      }
    };
    loadPrompt();
  }, []);

  const updatePrompt = useCallback((newPrompt: string) => {
    setCurrentPrompt(newPrompt);
    AsyncStorage.setItem(PROMPT_STORAGE_KEY, newPrompt).catch((error) => {
      console.error("Failed to save prompt:", error);
    });
  }, []);

  const shufflePrompt = useCallback((): void => {
    const next = dailyPrompts[Math.floor(Math.random() * dailyPrompts.length)];
    updatePrompt(next);
  }, [dailyPrompts, updatePrompt]);

  return {
    currentPrompt,
    shufflePrompt,
    setPrompt: updatePrompt,
    allPrompts: dailyPrompts,
  };
};
