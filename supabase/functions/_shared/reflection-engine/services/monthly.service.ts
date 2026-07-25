import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";
import { reflectionEngine } from "../ai/reflection-engine.ts";
import { contextBuilder } from "../ai/context-builder.ts";
import { AIStructuredMemory } from "../ai/types.ts";
import { WeeklyService } from "./weekly.service.ts";
import { getUserTimezone } from "../../timezone.ts";
import { toZonedTime, format as formatTz } from "npm:date-fns-tz@^3.0.0";
import { format, getWeek, eachWeekOfInterval } from "npm:date-fns@^4.1.0";

interface WeeklySummaryRecord {
  weekly_summary: {
    summary?: string;
    structured_memory?: AIStructuredMemory;
  } | null;
}

interface MonthlyAIRecord {
  summary: string;
}

/**
 * Computes the first day of the previous month for the given YYYY-MM.
 */
function priorMonthFirstDay(monthYear: string): string {
  const [year, month] = monthYear.split("-").map(Number);
  const prior = new Date(year, month - 2, 1); // month is 1-based; month-2 = previous month
  const y = prior.getFullYear();
  const m = String(prior.getMonth() + 1).padStart(2, "0");
  const d = String(prior.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Computes the last day of the previous month.
 */
function priorMonthLastDay(monthYear: string): string {
  const [year, month] = monthYear.split("-").map(Number);
  const prior = new Date(year, month - 1, 0); // day 0 of current month = last day of previous month
  const y = prior.getFullYear();
  const m = String(prior.getMonth() + 1).padStart(2, "0");
  const d = String(prior.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Computes the first and last day of a month given "YYYY-MM".
 */
function monthBounds(monthYear: string): { firstDay: string; lastDay: string } {
  const [year, month] = monthYear.split("-").map(Number);
  const first = new Date(year, month - 1, 1);
  const last = new Date(year, month, 0);
  const pad = (n: number) => String(n).padStart(2, "0");
  return {
    firstDay: `${year}-${pad(month)}-${pad(first.getDate())}`,
    lastDay: `${year}-${pad(month)}-${pad(last.getDate())}`,
  };
}

export class MonthlyService {
  constructor(private supabase: SupabaseClient) {}

  /**
   * Generates and saves a Monthly Reflection.
   */
  public async generateAndSaveMonthlyReflection(
    userId: string,
    monthYear: string, // "YYYY-MM" format
  ): Promise<unknown> {
    try {
      console.log(
        `Starting Monthly AI reflection for user: ${userId} month: ${monthYear}`,
      );

      const { firstDay, lastDay } = monthBounds(monthYear);
      const priorFirst = priorMonthFirstDay(monthYear);
      const priorLast = priorMonthLastDay(monthYear);

      // 1. Fetch weekly summaries for the month + prior month summary for comparison
      const [
        { data: weeklyRecords },
        { data: priorMonthly },
      ] = await Promise.all([
        this.supabase
          .from("weekly_ai")
          .select("week_number, summary, structured_memory")
          .eq("user_id", userId)
          .eq("year", parseInt(monthYear.slice(0, 4), 10)),
        this.supabase
          .from("monthly_ai")
          .select("summary")
          .eq("user_id", userId)
          .eq("year", parseInt(priorFirst.slice(0, 4), 10))
          .eq("month", parseInt(priorFirst.slice(5, 7), 10))
          .maybeSingle(),
      ]);

      console.log(`[monthly.service] Fetched data for ${monthYear}:`, {
        weeklyCount: weeklyRecords?.length || 0,
        hasPriorMonthly: !!priorMonthly
      });

      // ponytail: missing weekly auto-recovery with timezone-aware today cap
      // Calculate Timezone-Aware Today
      const userTimezone = await getUserTimezone(this.supabase, userId);
      const today = formatTz(toZonedTime(new Date(), userTimezone), "yyyy-MM-dd");
      
      const capDate = lastDay < today ? lastDay : today;

      // Identify missing weeks
      const targetYearInt = parseInt(monthYear.slice(0, 4), 10);
      const existingWeeks = new Set((weeklyRecords || []).map((w: any) => w.week_number));
      
      const missingWeeks: number[] = [];
      let intervalWeeks: Date[] = [];
      
      if (firstDay <= capDate) {
        intervalWeeks = eachWeekOfInterval({
          start: new Date(`${firstDay}T00:00:00.000Z`),
          end: new Date(`${capDate}T00:00:00.000Z`)
        });
      }
      
      for (const d of intervalWeeks) {
        const wk = getWeek(d);
        if (!existingWeeks.has(wk)) {
          missingWeeks.push(wk);
        }
      }

      // Parallel generate missing weeklies
      let finalWeeklyRecords = weeklyRecords || [];
      
      if (missingWeeks.length > 0) {
        console.log(`[monthly.service] Generating missing weekly insights for weeks:`, missingWeeks);
        const weeklyService = new WeeklyService(this.supabase);
        
        await Promise.all(
          missingWeeks.map(wk => 
            weeklyService.generateAndSaveWeeklyReflection(userId, wk, targetYearInt)
              .catch(err => console.error(`Failed to generate weekly AI for week ${wk}:`, err))
          )
        );

        // Refetch after generation
        const { data: refreshedWeeklyAIs } = await this.supabase
          .from("weekly_ai")
          .select("week_number, summary, structured_memory")
          .eq("user_id", userId)
          .eq("year", targetYearInt);
          
        if (refreshedWeeklyAIs) {
          finalWeeklyRecords = refreshedWeeklyAIs;
        }
      }

      const weeklyReflections: string[] = [];
      const weeklyMemories: AIStructuredMemory[] = [];
      
      const targetMonthStr = monthYear.slice(5, 7);
      const targetMonthInt = parseInt(targetMonthStr, 10);

      finalWeeklyRecords.forEach(record => {
        // Approximate month check: week_number * 7 days.
        const weekDate = new Date(Date.UTC(targetYearInt, 0, 4 + (record.week_number - 1) * 7));
        if (weekDate.getUTCMonth() + 1 === targetMonthInt) {
          if (record.summary) {
            weeklyReflections.push(record.summary);
          }
          if (record.structured_memory) {
            weeklyMemories.push(record.structured_memory as AIStructuredMemory);
          }
        }
      });

      const priorReflection = (priorMonthly as MonthlyAIRecord | null)?.summary;

      // 2. Build context
      const context = contextBuilder.buildMonthlyContext(
        monthYear,
        weeklyReflections,
        weeklyMemories,
        priorReflection,
      );

      console.log(`[monthly.service] Built context:`, JSON.stringify(context, null, 2));

      // 3. Generate Reflection via AI Engine
      console.log(`[monthly.service] Calling Gemini...`);
      const aiResult = await reflectionEngine.generateMonthlyReflection(context);

      console.log(`[monthly.service] Gemini Output:`, JSON.stringify(aiResult, null, 2));

      // 4. Save to monthly_ai table per migration
      const yr = parseInt(monthYear.slice(0, 4), 10);
      const mo = parseInt(monthYear.slice(5, 7), 10);
      const { data, error } = await this.supabase
        .from("monthly_ai")
        .upsert(
          {
            user_id: userId,
            year: yr,
            month: mo,
            summary: aiResult.monthly_reflection,
            personalized_reflection: aiResult.insights,
            structured_memory: aiResult.structured_memory,
          },
          { onConflict: "user_id, year, month" },
        )
        .select()
        .single();

      if (error) {
        throw error;
      }

      console.log(`Successfully saved Monthly AI reflection for ${monthYear}`);
      return data;
    } catch (error) {
      console.error(`Error processing monthly reflection for ${monthYear}:`, error);
      throw error;
    }
  }
}
