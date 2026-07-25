import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";
import { reflectionEngine } from "../ai/reflection-engine.ts";
import { contextBuilder } from "../ai/context-builder.ts";
import { AIStructuredMemory } from "../ai/types.ts";
import { DailyService } from "./daily.service.ts";
import { toZonedTime, format as formatTz } from "npm:date-fns-tz@^3.0.0";
import { format, setWeek, setYear, startOfWeek, endOfWeek, subWeeks, eachDayOfInterval } from "npm:date-fns@^4.1.0";
import { getUserTimezone } from "../../timezone.ts";

interface DailyAIRecord {
  summary: string;
  structured_memory: AIStructuredMemory;
  reflection_date: string;
}

interface WeeklySummaryRecord {
  summary: string;
}

export class WeeklyService {
  constructor(private supabase: SupabaseClient) {}

  /**
   * Generates and saves a Weekly Reflection.
   */
  public async generateAndSaveWeeklyReflection(
    userId: string,
    week_index: number, // strictly numeric week number (e.g. 28)
    year: number,       // strictly numeric year (e.g. 2026)
  ): Promise<unknown> {
    // ponytail: derive Sunday-Saturday dates using date-fns
    const baseDate = setWeek(setYear(new Date(Date.UTC(year, 0, 1)), year), week_index);
    const startDate = format(startOfWeek(baseDate), "yyyy-MM-dd");
    const endDate = format(endOfWeek(baseDate), "yyyy-MM-dd");

    try {

      console.log(
        `Starting Weekly AI reflection for user: ${userId} week_index: ${week_index} year: ${year} (${startDate} to ${endDate})`,
      );


      // 1. Fetch daily reflections for the week + prior week summary for comparison
      let [
        { data: dailyAIs },
        { data: priorWeekly },
      ] = await Promise.all([
        this.supabase
          .from("daily_ai")
          .select("summary, structured_memory, reflection_date")
          .eq("user_id", userId)
          .gte("reflection_date", startDate)
          .lte("reflection_date", endDate)
          .order("reflection_date", { ascending: true }),
        this.supabase
          .from("weekly_ai")
          .select("summary, structured_memory")
          .eq("user_id", userId)
          .eq("year", year)
          .eq("week_number", week_index - 1)
          .maybeSingle(),
      ]);

      // ponytail: auto-generate missing daily insights before weekly reflection calculation
      const existingDates = new Set((dailyAIs || []).map((d: DailyAIRecord) => d.reflection_date));
      
      const userTimezone = await getUserTimezone(this.supabase, userId);
      const today = formatTz(toZonedTime(new Date(), userTimezone), "yyyy-MM-dd");
      const capDate = endDate < today ? endDate : today;
      
      const missingDates: string[] = [];
      let intervalDates: Date[] = [];
      
      if (startDate <= capDate) {
        intervalDates = eachDayOfInterval({
          start: new Date(`${startDate}T00:00:00.000Z`),
          end: new Date(`${capDate}T00:00:00.000Z`)
        });
      }
      
      for (const d of intervalDates) {
        const dStr = format(d, "yyyy-MM-dd");
        if (!existingDates.has(dStr)) {
          missingDates.push(dStr);
        }
      }

      if (missingDates.length > 0) {
        console.log(`[weekly.service] Generating missing daily insights for:`, missingDates);
        const dailyService = new DailyService(this.supabase);
        await Promise.all(
          missingDates.map(date => 
            dailyService.generateAndSaveDailyReflection(userId, date)
              .catch(err => console.error(`Failed to generate daily AI for ${date}:`, err))
          )
        );

        const { data: refreshedDailyAIs } = await this.supabase
          .from("daily_ai")
          .select("summary, structured_memory, reflection_date")
          .eq("user_id", userId)
          .gte("reflection_date", startDate)
          .lte("reflection_date", endDate)
          .order("reflection_date", { ascending: true });
          
        if (refreshedDailyAIs) {
          dailyAIs = refreshedDailyAIs;
        }
      }

      console.log(`[weekly.service] Fetched data for ${startDate} to ${endDate}:`, {
        dailyCount: dailyAIs?.length || 0,
        hasPriorWeekly: !!priorWeekly
      });

      const dailyReflections = (dailyAIs || [] as DailyAIRecord[]).map(d => d.summary);
      const dailyMemories = (dailyAIs || [] as DailyAIRecord[]).map(d => d.structured_memory);
      const priorReflection = (priorWeekly as WeeklySummaryRecord | null)?.summary || undefined;

      // 2. Build context
      const context = contextBuilder.buildWeeklyContext(
        startDate,
        endDate,
        dailyReflections,
        dailyMemories,
        priorReflection,
      );

      console.log(`[weekly.service] Built context:`, JSON.stringify(context, null, 2));

      // 3. Generate Reflection via AI Engine
      console.log(`[weekly.service] Calling Gemini...`);
      const aiResult = await reflectionEngine.generateWeeklyReflection(context);

      console.log(`[weekly.service] Gemini Output:`, JSON.stringify(aiResult, null, 2));

      // 4. Save to weekly_ai table (per 20260714223800_ai_reflection_tables.sql)
      const { data, error } = await this.supabase
        .from("weekly_ai")
        .upsert(
          {
            user_id: userId,
            year: year,
            week_number: week_index,
            summary: aiResult.weekly_reflection,
            personalized_reflection: aiResult.insights,
            structured_memory: aiResult.structured_memory,
          },
          { onConflict: "user_id, year, week_number" },
        )
        .select()
        .single();

      if (error) {
        throw error;
      }

      console.log(`Successfully saved Weekly AI reflection for ${startDate} to ${endDate}`);
      return data;
    } catch (error) {
      console.error(`Error processing weekly reflection for ${startDate} to ${endDate}:`, error);
      throw error;
    }
  }

}
