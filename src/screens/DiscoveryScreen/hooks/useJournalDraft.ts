import { useState, useEffect, useCallback, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DRAFT_STORAGE_KEY = "@happy_journal_composer_draft";

export interface JournalDraft {
  text: string;
  prompt: string;
  savedAt: number;
}

export function useJournalDraft(currentPrompt: string) {
  const [initialDraft, setInitialDraft] = useState<string>("");
  const [isDraftLoaded, setIsDraftLoaded] = useState<boolean>(false);
  const draftRef = useRef<string>("");

  // Load draft on mount
  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const raw = await AsyncStorage.getItem(DRAFT_STORAGE_KEY);
        if (raw && isMounted) {
          const parsed = JSON.parse(raw) as JournalDraft;
          if (parsed.text?.trim()) {
            setInitialDraft(parsed.text);
            draftRef.current = parsed.text;
          }
        }
      } catch (err) {
        console.warn("Failed to load journal draft", err);
      } finally {
        if (isMounted) setIsDraftLoaded(true);
      }
    }
    void load();
    return () => {
      isMounted = false;
    };
  }, []);

  // ponytail: debounce auto-save draft to avoid unnecessary disk I/O
  const saveDraft = useCallback(
    async (text: string) => {
      draftRef.current = text;
      try {
        if (!text.trim()) {
          await AsyncStorage.removeItem(DRAFT_STORAGE_KEY);
        } else {
          const draft: JournalDraft = {
            text,
            prompt: currentPrompt,
            savedAt: Date.now(),
          };
          await AsyncStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
        }
      } catch (err) {
        console.warn("Failed to persist draft", err);
      }
    },
    [currentPrompt]
  );

  const clearDraft = useCallback(async () => {
    draftRef.current = "";
    try {
      await AsyncStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch (err) {
      console.warn("Failed to clear draft", err);
    }
  }, []);

  return {
    initialDraft,
    isDraftLoaded,
    saveDraft,
    clearDraft,
  };
}
