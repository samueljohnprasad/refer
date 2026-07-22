import { DailyContext, WeeklyContext, MonthlyContext, AIStructuredMemory } from "./types.ts";

interface JournalAI {
  reflection: string;
}

interface Habit {
  name: string;
  completed: boolean;
}

interface Meal {
  food: string;
  calories: number;
  time: string;
}

interface CBT {
  type: string;
  reflection: string;
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
    priorReflection?: string
  ): DailyContext {
    return {
      date,
      journalReflections: journalAIs.map(j => j.reflection),
      habits: habits.map(h => ({ name: h.name, completed: h.completed })),
      meals: meals.map(m => ({ food: m.food, calories: m.calories, time: m.time })),
      cbt: cbt.map(c => ({ type: c.type, reflection: c.reflection })),
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
