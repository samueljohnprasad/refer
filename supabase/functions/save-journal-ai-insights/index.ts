// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { transcribeAudio } from "./translates.ts";
import { JournalService } from "../_shared/reflection-engine/services/journal.service.ts";
import { auth } from "./auth.ts";

type JournalEntry = {
  isAudio: boolean;
  journal: string;
  selectedDate?: string;
  inputType?: string;
  title?: string;
  durationSeconds?: number;
  wordsCount?: number;
};

async function parseJson<T>(req: Request): Promise<T> {
  return (await req.json()) as T;
}
//@ts-ignore
Deno.serve(async (req: Request) => {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Missing or invalid Authorization header" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
    const token = authHeader.replace("Bearer ", "");
    const supabase = auth(token);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);
    if (userError || !user) {
      console.error("User verification failed:", userError);
      return new Response(
        JSON.stringify({ error: "Invalid token or user not found" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const body = await parseJson<JournalEntry>(req);
    const { isAudio, journal, selectedDate, inputType, title, durationSeconds, wordsCount } = body;

    console.log("Starting transcription...");
    //@ts-ignore
    const apiKey = Deno.env.get("GEMINI_API_KEY") || "";
    if (!apiKey && isAudio) {
      console.warn("No GEMINI_API_KEY found in environment!");
    }
    
    const transcripts = await transcribeAudio(
      apiKey,
      journal,
      isAudio
    );

    const journalService = new JournalService(supabase);
    const insights = await journalService.processJournalCompleted({
      userId: user.id,
      content: transcripts.join(" "),
      selectedDate,
      inputType,
      title,
      durationSeconds,
      wordsCount,
    });

    return new Response(JSON.stringify(insights), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Unhandled error in function:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
