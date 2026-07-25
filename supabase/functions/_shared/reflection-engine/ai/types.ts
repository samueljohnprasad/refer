export type ReflectionLevel = "journal" | "daily" | "weekly" | "monthly";

export interface AIStructuredMemory {
  themes?: string[];
  emotions?: string[];
  routines?: string[];
  challenges?: string[];
  positive_experiences?: string[];
  life_events?: string[];
}

export interface JournalReflectionResult {
  reflection: string;
  structured_memory: AIStructuredMemory;
  confidence: number;
  title?: string;
  moodScore?: number;
  mainEmoji?: string;
  energyLevel?: number;
  stressLevel?: number;
  cognitivePattern?: string;
  strengthSpotlight?: string;
  nextJournalPrompt?: string;
}



export interface DailyReflectionResult {
  daily_reflection: string;
  structured_memory: AIStructuredMemory;
}

export interface WeeklyReflectionResult {
  weekly_reflection: string;
  observed_patterns: string[];
  insights: string[];
  structured_memory: AIStructuredMemory;
}

export interface MonthlyReflectionResult {
  monthly_reflection: string;
  defining_themes: string[];
  insights: string[];
  structured_memory: AIStructuredMemory;
}

// Data Context passed to prompt builders
export interface DailyContext {
  date: string;
  journalReflections: string[];
  habits: { name: string; completed: boolean }[];
  meals: { food: string; calories: number; time: string }[];
  cbt: { type: string; reflection: string }[];
  moods: { main_mood: string | null; mood_score: number | null; time: string | null }[];
  /** Yesterday's reflection text, if available. */
  priorReflection?: string;
}

export interface WeeklyContext {
  startDate: string;
  endDate: string;
  dailyReflections: string[];
  dailyMemories: AIStructuredMemory[];
  /** Last week's reflection text, if available. */
  priorReflection?: string;
}

export interface MonthlyContext {
  monthYear: string;
  weeklyReflections: string[];
  weeklyMemories: AIStructuredMemory[];
  /** Last month's reflection text, if available. */
  priorReflection?: string;
}
