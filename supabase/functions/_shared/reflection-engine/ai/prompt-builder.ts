import { DailyContext, WeeklyContext, MonthlyContext } from "./types.ts";

export class PromptBuilder {
  /**
   * Builds the final prompt by injecting the DailyContext into the markdown template.
   */
  public buildDailyPrompt(template: string, context: DailyContext): string {
    return template.replace("{{CONTEXT}}", JSON.stringify(context, null, 2));
  }
  
  /**
   * Builds the final prompt by injecting the WeeklyContext into the markdown template.
   */
  public buildWeeklyPrompt(template: string, context: WeeklyContext): string {
    return template.replace("{{CONTEXT}}", JSON.stringify(context, null, 2));
  }

  /**
   * Builds the final prompt by injecting the MonthlyContext into the markdown template.
   */
  public buildMonthlyPrompt(template: string, context: MonthlyContext): string {
    return template.replace("{{CONTEXT}}", JSON.stringify(context, null, 2));
  }

  /**
   * Generic prompt builder for journal level reflections.
   */
  public buildJournalPrompt(template: string, journalContent: string): string {
    return template.replace("{{JOURNAL}}", journalContent);
  }
}

export const promptBuilder = new PromptBuilder();