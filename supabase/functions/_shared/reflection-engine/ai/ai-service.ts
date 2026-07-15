import { geminiClient } from "./client.ts";
import { 
  JournalReflectionResult,
  DailyReflectionResult, 
  WeeklyReflectionResult, 
  MonthlyReflectionResult 
} from "./types.ts";

export class AIService {
  
  public async generateJournalReflection(prompt: string, systemInstruction?: string): Promise<JournalReflectionResult> {
    const rawResult = await geminiClient.generateJson(prompt, systemInstruction);
    return rawResult as JournalReflectionResult;
  }

  public async generateDailyReflection(prompt: string, systemInstruction?: string): Promise<DailyReflectionResult> {
    const rawResult = await geminiClient.generateJson(prompt, systemInstruction);
    return rawResult as DailyReflectionResult;
  }

  public async generateWeeklyReflection(prompt: string, systemInstruction?: string): Promise<WeeklyReflectionResult> {
    const rawResult = await geminiClient.generateJson(prompt, systemInstruction);
    return rawResult as WeeklyReflectionResult;
  }

  public async generateMonthlyReflection(prompt: string, systemInstruction?: string): Promise<MonthlyReflectionResult> {
    const rawResult = await geminiClient.generateJson(prompt, systemInstruction);
    return rawResult as MonthlyReflectionResult;
  }
}

export const aiService = new AIService();