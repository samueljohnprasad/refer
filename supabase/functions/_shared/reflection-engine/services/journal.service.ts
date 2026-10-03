import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";
import { reflectionEngine } from "../ai/reflection-engine.ts";
import type { AiObservationContext } from "../../ai-observability.ts";

export interface JournalInput {
  userId: string;
  content: string;
  selectedDate?: string;
  inputType?: string;
  durationSeconds?: number;
  wordsCount?: number;
  aiObservation?: AiObservationContext;
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
      aiObservation,
    } = input;

    console.log(
      `[JournalService] Step 1/5: Generating AI reflection for user: ${userId} (content length: ${content.length})...`,
    );

    // 1. Generate Reflection via AI Engine
    const reflectionStart = Date.now();
    const aiResult = await reflectionEngine.generateJournalReflection(content, aiObservation);
    const reflectionElapsed = Date.now() - reflectionStart;
    console.log(
      `[JournalService] Step 1/5 complete in ${reflectionElapsed}ms: Title="${aiResult.title}", MoodScore=${aiResult.moodScore}`,
    );

    // 2. Insert journal_records row with AI fields merged in
    console.log(`[JournalService] Step 2/5: Inserting journal_records row...`);
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
      console.error("[JournalService] Error saving journal record:", error);
      throw error;
    }
    console.log(`[JournalService] Step 2/5 complete: Saved journal_records id=${data.id}`);

    // 3. Also store in journal_ai table
    console.log(`[JournalService] Step 3/5: Storing structured summary in journal_ai for id=${data.id}...`);
    const { error: aiError } = await this.supabase.from("journal_ai").insert({
      journal_id: String(data.id),
      user_id: userId,
      summary: aiResult.reflection,
      confidence: aiResult.confidence,
      structured_memory: aiResult.structured_memory,
    });

    if (aiError) {
      console.error("[JournalService] Error saving to journal_ai:", aiError);
    } else {
      console.log(`[JournalService] Step 3/5 complete: Saved journal_ai record`);
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
    console.log(`[JournalService] Step 4/5: Upserting mood score=${score} (${getMoodEnum(score)}) for journal_entry_id=${data.id}...`);
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
      console.error("[JournalService] Error saving to moods table:", moodError);
    } else {
      console.log(`[JournalService] Step 4/5 complete: Upserted moods record`);
    }

    // 5. Update user streak in profiles
    console.log(`[JournalService] Step 5/5: Updating user streak for user=${userId}...`);
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
          console.log(`[JournalService] Step 5/5: Profile streak updated: current=${newStreak}, longest=${newLongest}`);
        } else {
          console.log(`[JournalService] Step 5/5: Profile streak already updated today (${todayStr})`);
        }
      }

      // ponytail: Unify streaks by also calling the journey streak RPC
      // so doing a journal counts towards the global app streak
      const { error: rpcError } = await this.supabase.rpc('update_user_streak');
      if (rpcError) {
        console.error("[JournalService] Error updating user_streaks via RPC:", rpcError);
      } else {
        console.log(`[JournalService] Step 5/5: Global app streak updated via RPC`);
      }

    } catch (e) {
      console.error("[JournalService] Error updating streak in profile:", e);
    }

    console.log(`[JournalService] Complete: Successfully saved journal record id=${data.id}`);
    return {
      ...data,
      journal_ai: {
        summary: aiResult.reflection,
        confidence: aiResult.confidence,
        structured_memory: aiResult.structured_memory,
      },
      moods: {
        main_mood: getMoodEnum(score),
        mood_score: score,
      },
    };
  }
}
