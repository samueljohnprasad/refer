import { DailyContext, WeeklyContext, MonthlyContext } from "./types.ts";

export class PromptBuilder {
  /**
   * Builds the final prompt by injecting the DailyContext into the markdown template.
   * Uses replaceAll so every placeholder is substituted and JSON content cannot
   * trigger double-substitution.
   */
  public buildDailyPrompt(template: string, context: DailyContext): string {
    let prompt = template.replaceAll("{{CONTEXT}}", JSON.stringify(context, null, 2));
    if (context.priorReflection) {
      prompt = prompt.replaceAll(
        "{{PRIOR_REFLECTION}}",
        context.priorReflection
      );
    } else {
      prompt = prompt.replaceAll("{{PRIOR_REFLECTION}}", "(not available)");
    }
    return prompt;
  }

  /**
   * Builds the final prompt by injecting the WeeklyContext into the markdown template.
   */
  public buildWeeklyPrompt(template: string, context: WeeklyContext): string {
    let prompt = template.replaceAll("{{CONTEXT}}", JSON.stringify(context, null, 2));
    if (context.priorReflection) {
      prompt = prompt.replaceAll(
        "{{PRIOR_REFLECTION}}",
        context.priorReflection
      );
    } else {
      prompt = prompt.replaceAll("{{PRIOR_REFLECTION}}", "(not available)");
    }
    return prompt;
  }

  /**
   * Builds the final prompt by injecting the MonthlyContext into the markdown template.
   */
  public buildMonthlyPrompt(template: string, context: MonthlyContext): string {
    let prompt = template.replaceAll("{{CONTEXT}}", JSON.stringify(context, null, 2));
    if (context.priorReflection) {
      prompt = prompt.replaceAll(
        "{{PRIOR_REFLECTION}}",
        context.priorReflection
      );
    } else {
      prompt = prompt.replaceAll("{{PRIOR_REFLECTION}}", "(not available)");
    }
    return prompt;
  }

  /**
   * Generic prompt builder for journal level reflections.
   */
  public buildJournalPrompt(template: string, journalContent: string): string {
    return template.replaceAll("{{JOURNAL}}", journalContent);
  }
}

export const promptBuilder = new PromptBuilder();
