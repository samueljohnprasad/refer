import { DailyContext, WeeklyContext, MonthlyContext, AIStructuredMemory } from "./types.ts";

export class ContextBuilder {
  /**
   * Aggregates raw data into a structured context for the Daily Reflection.
   */
  public buildDailyContext(
    date: string,
    journalAIs: any[],
    habits: any[],
    meals: any[],
    cbt: any[]
  ): DailyContext {
    return {
      date,
      journalReflections: journalAIs.map(j => j.reflection),
      habits: habits.map(h => ({ name: h.name, completed: h.completed })),
      meals: meals.map(m => ({ food: m.food, calories: m.calories, time: m.time })),
      cbt: cbt.map(c => ({ type: c.type, reflection: c.reflection })),
    };
  }

  /**
   * Aggregates daily AI summaries into a structured context for the Weekly Reflection.
   */
  public buildWeeklyContext(
    startDate: string,
    endDate: string,
    dailyReflections: string[],
    dailyMemories: AIStructuredMemory[]
  ): WeeklyContext {
    return {
      startDate,
      endDate,
      dailyReflections,
      dailyMemories,
    };
  }

  /**
   * Aggregates weekly AI summaries into a structured context for the Monthly Reflection.
   */
  public buildMonthlyContext(
    monthYear: string,
    weeklyReflections: string[],
    weeklyMemories: AIStructuredMemory[]
  ): MonthlyContext {
    return {
      monthYear,
      weeklyReflections,
      weeklyMemories,
    };
  }
}

export const contextBuilder = new ContextBuilder();