const CAPTURE_PROMPT_KEYS: Record<string, string> = {
  "What made you smile today?": "smile",
  "What challenged you today, and how did you respond?": "challenge",
  "One thing you are grateful for right now?": "gratitude",
  "What did you learn about yourself today?": "selfLearning",
  "How can you take care of yourself better tomorrow?": "selfCare",
  "What is a small win you had today?": "smallWin",
  "Describe a moment where you felt at peace.": "peace",
  "Who is someone you appreciate, and why?": "appreciation",
  "What is one thing you want to let go of?": "letGo",
  "If you could change one thing about today, what would it be?": "changeOneThing",
  "What are you looking forward to this week?": "lookingForward",
  "How did you practice self-care today?": "selfCareToday",
  "What is a fear you faced or want to face?": "fear",
  "Write about a recent accomplishment.": "accomplishment",
  "What does your ideal day look like?": "idealDay",
  "What energy do you want to bring into tomorrow?": "tomorrowEnergy",
  "Describe your mood in three words.": "moodThreeWords",
  "What is a habit you want to build?": "habit",
  "Who made a positive impact on your day?": "positiveImpact",
  "What is something beautiful you saw today?": "beautifulThing",
};

export function getCapturePromptKey(prompt: string): string | undefined {
  return CAPTURE_PROMPT_KEYS[prompt];
}
