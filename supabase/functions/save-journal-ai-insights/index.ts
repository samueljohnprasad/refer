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
  const reqId = crypto.randomUUID().slice(0, 8);
  const reqStart = Date.now();
  const logPrefix = `[save-journal][${reqId}]`;

  console.log(`${logPrefix} >>> Request received: ${req.method} ${req.url}`);

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      console.warn(`${logPrefix} Authentication failed: Missing or invalid Authorization header`);
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
      console.error(`${logPrefix} User authentication failed:`, userError?.message || "User not found");
      return new Response(
        JSON.stringify({ error: "Invalid token or user not found" }),
        { status: 401, headers: { "Content-Type": "application/json" } },
      );
    }

    console.log(`${logPrefix} Authenticated user: ${user.id} (${user.email ?? "no email"})`);

    const body = await parseJson<JournalEntry>(req);
    const { isAudio, journal, selectedDate, inputType, durationSeconds } = body;

    console.log(`${logPrefix} Payload: isAudio=${isAudio}, inputType=${inputType ?? "voice"}, duration=${durationSeconds ?? 0}s, date=${selectedDate ?? "now"}, payloadChars=${journal?.length ?? 0}`);

    //@ts-ignore
    // ponytail: fallback between key env names
    const apiKey =
      Deno.env.get("EXPO_PUBLIC_GEMINI_API_KEY") ||
      Deno.env.get("GEMINI_API_KEY") ||
      "";
    if (!apiKey && isAudio) {
      console.warn(`${logPrefix} WARNING: No Gemini API key found in Deno.env!`);
    } else {
      console.log(`${logPrefix} Gemini API key verified present`);
    }

    const transcribeStart = Date.now();
    console.log(`${logPrefix} Starting transcription (isAudio=${isAudio})...`);
    const transcripts = await transcribeAudio(apiKey, journal, isAudio, reqId);
    console.log(`${logPrefix} Transcription finished in ${Date.now() - transcribeStart}ms. Segments: ${transcripts.length}`);

    const rawContent = transcripts.join(" ").trim();
    // ponytail: strip whisper non-speech tokens
    const content = rawContent
      .replace(/^(\[(?:SOUND|BLANK_AUDIO|MUSIC)\]|\((?:silence|music)\))\s*/gi, "")
      .trim();

    const wordsCount = content.split(/\s+/).filter((word) => word.length > 0).length;
    console.log(
      `${logPrefix} Content cleaned. Length: ${content.length} chars, Words: ${wordsCount}. Preview: "${content.substring(0, 100)}${content.length > 100 ? "..." : ""}"`
    );

    if (!content) {
      // ponytail: block empty entries early
      console.warn(`${logPrefix} Blocked empty or non-speech entry after filtering`);
      return new Response(
        JSON.stringify({ error: "No audible speech detected in recording" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    console.log(`${logPrefix} Initializing JournalService...`);
    const journalService = new JournalService(supabase);

    const serviceStart = Date.now();
    console.log(`${logPrefix} Executing processJournalCompleted...`);
    const insights = await journalService.processJournalCompleted({
      userId: user.id,
      content,
      selectedDate,
      inputType,
      durationSeconds,
      wordsCount,
    });
    console.log(
      `${logPrefix} processJournalCompleted finished in ${Date.now() - serviceStart}ms. Record saved successfully.`
    );

    const totalElapsed = Date.now() - reqStart;
    console.log(`${logPrefix} <<< Completed 200 OK in ${totalElapsed}ms`);

    return new Response(JSON.stringify(insights), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    const totalElapsed = Date.now() - reqStart;
    console.error(`${logPrefix} <<< Unhandled server error in ${totalElapsed}ms:`, error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
});
