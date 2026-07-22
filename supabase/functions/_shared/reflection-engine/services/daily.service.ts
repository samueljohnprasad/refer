import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";
import { reflectionEngine } from "../ai/reflection-engine.ts";
import { contextBuilder } from "../ai/context-builder.ts";

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

interface DailyAIRecord {
  summary: string;
}

export class DailyService {
  constructor(private supabase: SupabaseClient) {}

  /**
   * Generates and saves a Daily Reflection.
   */
  public async generateAndSaveDailyReflection(
    userId: string,
    date: string, // YYYY-MM-DD format
  ): Promise<unknown> {
    try {
      console.log(
        `Starting Daily AI reflection for user: ${userId} on date: ${date}`,
      );

      // Compute yesterday's date for comparison
      const currentDate = new Date(date);
      const yesterday = new Date(currentDate);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split("T")[0];

      // 1. Fetch data from DB (parallel)
      const [
        { data: journalAIs },
        { data: habits },
        { data: meals },
        { data: cbt },
        { data: priorDaily },
      ] = await Promise.all([
        this.supabase
          .from("journal_ai")
          .select("*")
          .eq("user_id", userId)
          .gte("created_at", `${date}T00:00:00Z`)
          .lte("created_at", `${date}T23:59:59Z`),
        this.supabase.from("habits").select("*").eq("user_id", userId).eq("date", date),
        this.supabase.from("meals").select("*").eq("user_id", userId).eq("date", date),
        this.supabase.from("cbt_logs").select("*").eq("user_id", userId).eq("date", date),
        this.supabase
          .from("daily_ai")
          .select("summary")
          .eq("user_id", userId)
          .eq("reflection_date", yesterdayStr)
          .maybeSingle(),
      ]);

      const priorReflection = (priorDaily as DailyAIRecord | null)?.summary;

      // 2. Build the context string
      const context = contextBuilder.buildDailyContext(
        date,
        (journalAIs || []) as JournalAI[],
        (habits || []) as Habit[],
        (meals || []) as Meal[],
        (cbt || []) as CBT[],
        priorReflection,
      );

      // 3. Generate Reflection via AI Engine
      const aiResult = await reflectionEngine.generateDailyReflection(context);

      // 4. Save to daily_ai table
      const { data, error } = await this.supabase
        .from("daily_ai")
        .upsert(
          {
            user_id: userId,
            reflection_date: date,
            summary: aiResult.daily_reflection,
            structured_memory: aiResult.structured_memory,
          },
          { onConflict: "user_id, reflection_date" },
        )
        .select()
        .single();

      if (error) {
        throw error;
      }

      console.log(`Successfully saved Daily AI reflection for ${date}`);
      return data;
    } catch (error) {
      console.error(`Error processing daily reflection for ${date}:`, error);
      throw error;
    }
  }
}
