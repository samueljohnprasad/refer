import { DailyContext, WeeklyContext, MonthlyContext, AIStructuredMemory } from "./types.ts";

interface JournalAI {
  summary: string;
}

export interface Habit {
  name: string;
  completed: boolean;
  timestamp?: string | null;
}

export interface Meal {
  food: string;
  calories: number;
  time: string;
  meal_type?: string | null;
  timestamp?: string | null;
}

interface CBT {
  type: string;
  reflection: string;
}

interface Mood {
  main_mood: string | null;
  mood_score: number | null;
  time: string | null;
}

export class ContextBuilder {
  /**
   * Aggregates raw data into a structured context for the Daily Reflection.
   */
  public buildDailyContext(
    date: string,
    journalAIs: JournalAI[],
    habits: Habit[],
    meals: Meal[],
    cbt: CBT[],
    moods: Mood[],
    priorReflection?: string
  ): DailyContext {
    return {
      date,
      journalReflections: journalAIs.map(j => j.summary),
      habits: habits.map(h => ({ name: h.name, completed: h.completed, timestamp: h.timestamp })),
      meals: meals.map(m => ({ food: m.food, calories: m.calories, time: m.time, meal_type: m.meal_type, timestamp: m.timestamp })),
      cbt: cbt.map(c => ({ type: c.type, reflection: c.reflection })),
      moods: moods.map(m => ({ main_mood: m.main_mood, mood_score: m.mood_score, time: m.time })),
      priorReflection,
    };
  }

  /**
   * Aggregates daily AI summaries into a structured context for the Weekly Reflection.
   */
  public buildWeeklyContext(
    startDate: string,
    endDate: string,
    dailyReflections: string[],
    dailyMemories: AIStructuredMemory[],
    priorReflection?: string
  ): WeeklyContext {
    return {
      startDate,
      endDate,
      dailyReflections,
      dailyMemories,
      priorReflection,
    };
  }

  /**
   * Aggregates weekly AI summaries into a structured context for the Monthly Reflection.
   */
  public buildMonthlyContext(
    monthYear: string,
    weeklyReflections: string[],
    weeklyMemories: AIStructuredMemory[],
    priorReflection?: string
  ): MonthlyContext {
    return {
      monthYear,
      weeklyReflections,
      weeklyMemories,
      priorReflection,
    };
  }
}

export const contextBuilder = new ContextBuilder();
