// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { transcribeAudio } from "./translates.ts";
import { getInsights } from "./genai.ts";
import { auth } from "./auth.ts";

type JournalEntry = {
  isAudio: boolean;
  journal: string;
  selectedDate: string;
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

    // 3) Get user
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

    // 4) Parse request body
    const body = await parseJson<JournalEntry>(req);
    const { isAudio, journal } = body;

    // 5) Transcribe audio
    console.log("Starting transcription...");
    const transcripts = await transcribeAudio(
      "AIzaSyBJX6jaVX6bI4M19dQEGq10OXIo-4AxgOU",
      journal,
      isAudio
    );
    //  const { error, data } = await supabase.from("test").upsert({
    //     data: { transcripts, journal, isAudio  },
    //   });
    const { error: insightsError, insights } = await getInsights(
      transcripts.join(" ")
    );

    if (insightsError) {
      return new Response(JSON.stringify({ error: insightsError }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

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

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/save-journal-ai-insights' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
