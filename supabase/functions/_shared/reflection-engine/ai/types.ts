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
  habits: any[];
  meals: any[];
  cbt: any[];
}

export interface WeeklyContext {
  startDate: string;
  endDate: string;
  dailyReflections: string[];
  dailyMemories: AIStructuredMemory[];
}

export interface MonthlyContext {
  monthYear: string;
  weeklyReflections: string[];
  weeklyMemories: AIStructuredMemory[];
}