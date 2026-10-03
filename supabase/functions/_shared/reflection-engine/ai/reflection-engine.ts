import { aiService } from "./ai-service.ts";
import type { AiObservationContext } from "../../ai-observability.ts";
import { contextBuilder } from "./context-builder.ts";
import { promptBuilder } from "./prompt-builder.ts";
import { promptLoader } from "./prompt-loader.ts";
import {
  JournalReflectionResult,
  DailyReflectionResult,
  WeeklyReflectionResult,
  MonthlyReflectionResult,
  DailyContext,
  WeeklyContext,
  MonthlyContext,
} from "./types.ts";

export class ReflectionEngine {
  public async generateJournalReflection(
    journalContent: string,
    observation?: AiObservationContext,
  ): Promise<JournalReflectionResult> {
    const template = await promptLoader.loadPrompt("journal");
    console.log("Template loaded:");
    const prompt = promptBuilder.buildJournalPrompt(template, journalContent);
    return await aiService.generateJournalReflection(prompt, undefined, observation);
  }

  public async generateDailyReflection(
    context: DailyContext,
  ): Promise<DailyReflectionResult> {
    const template = await promptLoader.loadPrompt("daily");
    const prompt = promptBuilder.buildDailyPrompt(template, context);
    return await aiService.generateDailyReflection(prompt);
  }

  public async generateWeeklyReflection(
    context: WeeklyContext,
  ): Promise<WeeklyReflectionResult> {
    const template = await promptLoader.loadPrompt("weekly");
    const prompt = promptBuilder.buildWeeklyPrompt(template, context);
    return await aiService.generateWeeklyReflection(prompt);
  }

  public async generateMonthlyReflection(
    context: MonthlyContext,
  ): Promise<MonthlyReflectionResult> {
    const template = await promptLoader.loadPrompt("monthly");
    const prompt = promptBuilder.buildMonthlyPrompt(template, context);
    return await aiService.generateMonthlyReflection(prompt);
  }
}

export const reflectionEngine = new ReflectionEngine();
