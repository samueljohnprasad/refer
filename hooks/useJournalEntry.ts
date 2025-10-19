import { useCallback, useMemo, useState } from "react";

export interface MoodOption {
  emoji: string;
  label: string;
}

export interface Recommendation {
  activity: string;
  quote: string;
}

export interface BadgeItem {
  id: number;
  title: string;
  icon: string;
  achieved: boolean;
}

export interface UseJournalEntryReturn {
  moods: MoodOption[];
  selectedMood: string;
  setSelectedMood: (emoji: string) => void;

  currentPrompt: string;
  shufflePrompt: () => void;

  currentRecommendation: Recommendation;
}

export const useJournalEntry = (): UseJournalEntryReturn => {
  const moods: MoodOption[] = useMemo(
    () => [
      { emoji: "😀", label: "Happy" },
      { emoji: "😌", label: "Calm" },
      { emoji: "😢", label: "Sad" },
      { emoji: "😡", label: "Angry" },
      { emoji: "😴", label: "Tired" },
      { emoji: "🤩", label: "Excited" },
      { emoji: "😟", label: "Anxious" },
      { emoji: "🙂", label: "Content" },
    ],
    []
  );

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

  const [selectedMood, setSelectedMood] = useState<string>("🙂");
  const [currentPrompt, setCurrentPrompt] = useState<string>(dailyPrompts[0]);

  const shufflePrompt = useCallback((): void => {
    const next = dailyPrompts[Math.floor(Math.random() * dailyPrompts.length)];
    setCurrentPrompt(next);
  }, [dailyPrompts]);

  const moodRecommendations: Record<string, Recommendation> = useMemo(
    () => ({
      "😀": {
        activity: "Go for a walk and share your joy!",
        quote: "Happiness is only real when shared.",
      },
      "😌": {
        activity: "Enjoy 10 minutes of deep breathing.",
        quote: "Calm mind brings inner strength.",
      },
      "😢": {
        activity: "Listen to uplifting music.",
        quote: "Tears are words the heart can’t express.",
      },
      "😡": {
        activity: "Try journaling your frustrations.",
        quote:
          "For every minute you remain angry, you lose 60 seconds of peace.",
      },
      "😴": {
        activity: "Take a short nap or meditate.",
        quote: "Rest and self-care are so important.",
      },
      "🤩": {
        activity: "Channel that energy into a creative project!",
        quote: "Enthusiasm moves the world.",
      },
      "😟": {
        activity: "Try a short guided meditation.",
        quote:
          "You don’t have to control your thoughts. Just don’t let them control you.",
      },
      "🙂": {
        activity: "Reflect on 3 things that went well today.",
        quote: "Contentment is the greatest wealth.",
      },
    }),
    []
  );

  const currentRecommendation: Recommendation = useMemo(() => {
    return moodRecommendations[selectedMood] ?? moodRecommendations["🙂"];
  }, [moodRecommendations, selectedMood]);

  return {
    moods,
    selectedMood,
    setSelectedMood,
    currentPrompt,
    shufflePrompt,
    currentRecommendation,
  };
};
