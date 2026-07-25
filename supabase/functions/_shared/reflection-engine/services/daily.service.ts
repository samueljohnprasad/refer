import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";
import { reflectionEngine } from "../ai/reflection-engine.ts";
import { contextBuilder, Habit, Meal } from "../ai/context-builder.ts";
import { getUserUtcDateRange } from "../../timezone.ts";

interface JournalAI {
  summary: string;
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

      // Calculate exact local start and end of day converted to UTC timestamps using shared timezone helper // ponytail: reusable timezone boundary logic
      const { startOfDay, endOfDay, timezone } = await getUserUtcDateRange(this.supabase, userId, date);
      console.log(`[daily.service] Using date boundaries for tz ${timezone}: ${startOfDay} to ${endOfDay}`);

      // 1. Fetch data from DB (parallel)
      const [
        { data: journalRecords },
        { data: habits },
        { data: meals },
        { data: exercises },
        { data: moods },
        { data: priorDaily },
      ] = await Promise.all([
        this.supabase
          .from("journal_records")
          .select("id")
          .eq("user_id", userId)
          .gte("selected_date", startOfDay)
          .lte("selected_date", endOfDay),
        this.supabase
          .from("habit_completions")
          .select("completed_at, habits(name)")
          .eq("user_id", userId)
          .gte("completed_at", startOfDay)
          .lte("completed_at", endOfDay),
        this.supabase
          .from("calorie_entries")
          .select("foods, total_calories, meal_type, selected_date")
          .eq("user_id", userId)
          .gte("selected_date", startOfDay)
          .lte("selected_date", endOfDay),
        this.supabase
          .from("exercise_entries")
          .select("*")
          .eq("user_id", userId)
          .gte("created_at", startOfDay)
          .lte("created_at", endOfDay),
        this.supabase
          .from("moods")
          .select("main_mood, mood_score, selected_date")
          .eq("user_id", userId)
          .gte("selected_date", startOfDay)
          .lte("selected_date", endOfDay),
        this.supabase
          .from("daily_ai")
          .select("summary")
          .eq("user_id", userId)
          .eq("reflection_date", yesterdayStr)
          .maybeSingle(),
      ]);


      const priorReflection = (priorDaily as DailyAIRecord | null)?.summary;

      // Combine all exercise types into the CBT context array
      const cbtContext: CBT[] = [
        ...(exercises || []).map((c: any) => ({ type: c.exercise_type, reflection: JSON.stringify(c.response) })),
      ];

      // 1.5 Fetch journal AI insights using the journal record IDs
      let journalAIs: any[] = [];
      const journalIds = (journalRecords || []).map((j: any) => j.id);
      if (journalIds.length > 0) {
        const { data: aiData, error: aiError } = await this.supabase
          .from("journal_ai")
          .select("*")
          .in("journal_id", journalIds);
        
        if (aiError) {
          console.error("Error fetching journal_ai:", aiError);
        } else {
          journalAIs = aiData || [];
        }
      }

      console.log(`[daily.service] Fetched data for ${date}:`, {
        journalCount: journalAIs?.length || 0,
        habitsCount: habits?.length || 0,
        mealsCount: meals?.length || 0,
        cbtCount: cbtContext.length,
        moodsCount: moods?.length || 0,
        hasPriorDaily: !!priorDaily
      });

      // ponytail: if completely empty day, skip AI call and return generic response
      if (
        (journalAIs?.length || 0) === 0 &&
        (habits?.length || 0) === 0 &&
        (meals?.length || 0) === 0 &&
        cbtContext.length === 0 &&
        (moods?.length || 0) === 0
      ) {
        console.log(`[daily.service] No data for ${date}, skipping AI generation.`);
        const emptyResult = {
          daily_reflection: "No entries recorded for this day.",
          structured_memory: {}
        };

        const { data, error } = await this.supabase
          .from("daily_ai")
          .upsert(
            {
              user_id: userId,
              reflection_date: date,
              summary: emptyResult.daily_reflection,
              structured_memory: emptyResult.structured_memory,
            },
            { onConflict: "user_id, reflection_date" },
          )
          .select()
          .single();

        if (error) throw error;
        return data;
      }

      // 2. Build the context string
      const dailyHabits: Habit[] = (habits || []).map(
        // @ts-ignore - Supabase join typing // ponytail: handle habit completion join mapping
        (h) => ({ name: h.habits?.name || "Unknown Habit", completed: true, timestamp: h.completed_at })
      );
      const dailyMeals: Meal[] = (meals || []).map(
        // ponytail: map calorie entries to daily meals context
        (m) => ({ food: m.foods, calories: m.total_calories, meal_type: m.meal_type, time: m.selected_date, timestamp: m.selected_date })
      );

      const formattedMoods = (moods || []).map((m: any) => {
        // Extract time (HH:MM) from the ISO selected_date string
        let timeString = null;
        if (m.selected_date) {
          const dt = new Date(m.selected_date);
          timeString = dt.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
        }
        return {
          main_mood: m.main_mood,
          mood_score: m.mood_score,
          time: timeString
        };
      });

      const context = contextBuilder.buildDailyContext(
        date,
        (journalAIs || []) as JournalAI[],
        dailyHabits,
        dailyMeals,
        cbtContext,
        formattedMoods,
        priorReflection,
      );

      console.log(`[daily.service] Built context for ${date}:`, JSON.stringify(context, null, 2));

      // 3. Generate Reflection via AI Engine
      console.log(`[daily.service] Calling Gemini for ${date}...`);
      const aiResult = await reflectionEngine.generateDailyReflection(context);
      
      console.log(`[daily.service] Gemini Output for ${date}:`, JSON.stringify(aiResult, null, 2));

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
