import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";
import { reflectionEngine } from "../ai/reflection-engine.ts";

export interface JournalInput {
  userId: string;
  content: string;
  selectedDate?: string;
  inputType?: string;
  durationSeconds?: number;
  wordsCount?: number;
}

export class JournalService {
  constructor(private supabase: SupabaseClient) {}

  /**
   * Generates AI reflection and saves to journal_records in one shot.
   * FE does NOT send journalId — we create the record here.
   */
  public async processJournalCompleted(input: JournalInput): Promise<unknown> {
    const {
      userId,
      content,
      selectedDate,
      inputType,
      durationSeconds,
      wordsCount,
    } = input;

    console.log(
      `Generating AI reflection for user: ${userId}. Content length: ${content.length}`,
    );

    // 1. Generate Reflection via AI Engine
    console.log("Calling reflectionEngine.generateJournalReflection...");
    const aiResult = await reflectionEngine.generateJournalReflection(content);
    console.log(
      "AI result received:",
      JSON.stringify(aiResult).substring(0, 200) + "...",
    );

    // 2. Insert journal_records row with AI fields merged in
    const { data, error } = await this.supabase
      .from("journal_records")
      .insert({
        user_id: userId,
        transcripts: content,
        selected_date: selectedDate ?? new Date().toISOString(),
        input_type: inputType ?? "voice",
        title: aiResult.title || "-",
        duration_seconds: durationSeconds ?? 0,
        words_count: wordsCount ?? 0,
      })
      .select()
      .single();

    if (error) {
      console.error("Error saving journal record:", error);
      throw error;
    }

    // 3. Also store in journal_ai table
    const { error: aiError } = await this.supabase.from("journal_ai").insert({
      journal_id: String(data.id),
      user_id: userId,
      summary: aiResult.reflection,
      confidence: aiResult.confidence,
      structured_memory: aiResult.structured_memory,
    });

    if (aiError) {
      console.error("Error saving to journal_ai:", aiError);
    }

    // 4. Store in the mood table
    const moodMap: Record<
      number,
      "terrible" | "bad" | "fine" | "good" | "great"
    > = {
      1: "terrible",
      2: "bad",
      3: "fine",
      4: "good",
      5: "great",
    };

    const getMoodEnum = (score?: number | null) =>
      moodMap[score ?? 3] ?? "fine";

    const score = aiResult.moodScore ?? 3;
    const { error: moodError } = await this.supabase.from("moods").upsert(
      {
        user_id: userId,
        journal_entry_id: Number(data.id),
        main_mood: getMoodEnum(score),
        mood_score: score,
        selected_date: selectedDate ?? new Date().toISOString(),
        input_method: inputType ?? "journal",
      },
      { onConflict: "journal_entry_id" },
    );

    if (moodError) {
      console.error("Error saving to moods table:", moodError);
    }

    // 5. Update user streak in profiles
    try {
      const { data: profile } = await this.supabase
        .from("profiles")
        .select("current_streak, longest_streak, last_journal_date")
        .eq("id", userId)
        .single();

      if (profile) {
        const todayStr = new Date().toISOString().split("T")[0];
        const lastJournalStr = profile.last_journal_date
          ? new Date(profile.last_journal_date).toISOString().split("T")[0]
          : null;
          
        let newStreak = profile.current_streak || 0;
        let updateStreak = false;

        if (lastJournalStr !== todayStr) {
          // If the last journal was yesterday, increment streak
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split("T")[0];

          if (lastJournalStr === yesterdayStr) {
            newStreak += 1;
          } else {
            newStreak = 1;
          }
          updateStreak = true;
        }

        if (updateStreak) {
          const newLongest = Math.max(newStreak, profile.longest_streak || 0);
          await this.supabase
            .from("profiles")
            .update({
              current_streak: newStreak,
              longest_streak: newLongest,
              last_journal_date: new Date().toISOString(),
            })
            .eq("id", userId);
        }
      }
    } catch (e) {
      console.error("Error updating streak in profile:", e);
    }

    console.log(`Saved journal record id: ${data.id}, journal_ai, and moods`);
    return data;
  }
}
