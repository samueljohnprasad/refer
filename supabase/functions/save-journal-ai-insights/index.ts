// npx supabase functions deploy save-journal-ai-insights --no-verify-jwt
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
  durationSeconds?: number;
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
        { status: 401, headers: { "Content-Type": "application/json" } },
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
        { status: 401, headers: { "Content-Type": "application/json" } },
      );
    }

    const body = await parseJson<JournalEntry>(req);
    // FE sends durationSeconds, isAudio, etc.
    const { isAudio, journal, selectedDate, inputType, durationSeconds } = body;

    console.log("Starting transcription...");
    //@ts-ignore
    const apiKey = Deno.env.get("GEMINI_API_KEY") || "";
    if (!apiKey && isAudio) {
      console.warn("No GEMINI_API_KEY found in environment!");
    }

    const transcripts = await transcribeAudio(apiKey, journal, isAudio);

    console.log("Transcribe results:", JSON.stringify(transcripts));

    const content = transcripts.join(" ").trim();
    console.log(
      "Combined content length:",
      content.length,
      "Content:",
      content.substring(0, 100) + "...",
    );

    if (!content) {
      // ponytail: block empty entries early
      console.warn("Blocked empty journal entry.");
      return new Response(
        JSON.stringify({ error: "No content provided or speech detected" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    console.log("Initializing JournalService...");
    const journalService = new JournalService(supabase);

    console.log("Calling processJournalCompleted...");
    const insights = await journalService.processJournalCompleted({
      userId: user.id,
      content,
      selectedDate,
      inputType,
      durationSeconds,
      wordsCount: content.split(/\s+/).filter((word) => word.length > 0).length,
    });
    console.log(
      "Finished processJournalCompleted, insights:",
      JSON.stringify(insights),
    );

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
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
});
