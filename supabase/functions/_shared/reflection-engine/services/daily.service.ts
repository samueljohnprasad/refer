import { reflectionEngine } from "../ai/reflection-engine.ts";
import { contextBuilder } from "../ai/context-builder.ts";

export class DailyService {
  constructor(private supabase: any) {}

  /**
   * Generates and saves a Daily Reflection.
   */
  public async generateAndSaveDailyReflection(
    userId: string,
    date: string, // YYYY-MM-DD format
  ): Promise<any> {
    try {
      console.log(
        `Starting Daily AI reflection for user: ${userId} on date: ${date}`,
      );

      // 1. Fetch data from DB
      const [
        { data: journalAIs },
        { data: habits },
        { data: meals },
        { data: cbt },
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
      ]);

      // 2. Build the context string
      const context = contextBuilder.buildDailyContext(
        date,
        journalAIs || [],
        habits || [],
        meals || [],
        cbt || [],
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
