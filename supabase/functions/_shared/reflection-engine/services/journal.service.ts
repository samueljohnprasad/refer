import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { reflectionEngine } from "../ai/reflection-engine.ts";

// Note: You should pass the Supabase client initialized with the user's Auth context,
// or use the service role key if processing asynchronously in the background.
export class JournalService {
  constructor(private supabase: any) {}

  /**
   * Generates and saves an AI reflection for a completed journal.
   */
  public async processJournalCompleted(
    journalId: string,
    userId: string,
    content: string,
  ): Promise<any> {
    try {
      console.log(
        `Starting AI reflection generation for journal: ${journalId}`,
      );

      // 1. Generate Reflection via AI Engine
      const aiResult =
        await reflectionEngine.generateJournalReflection(content);

      // 2. Save to database
      const { data, error } = await this.supabase
        .from("journal_ai")
        .insert({
          journal_id: journalId,
          user_id: userId,
          summary: aiResult.reflection,
          confidence: aiResult.confidence,
          structured_memory: aiResult.structured_memory,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      console.log(`Successfully saved AI reflection for journal: ${journalId}`);
      return data;
    } catch (error) {
      console.error(
        `Error processing journal reflection for ${journalId}:`,
        error,
      );
      throw error;
    }
  }
}
