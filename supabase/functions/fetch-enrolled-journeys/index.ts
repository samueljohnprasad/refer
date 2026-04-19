// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
//@ts-ignore
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { auth } from "../save-journal-ai-insights/auth.ts";

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

    // Create client for user verification
    const userSupabase = auth(token);

    // Get user
    const {
      data: { user },
      error: userError,
    } = await userSupabase.auth.getUser(token);
    if (userError || !user) {
      console.error("User verification failed:", userError);
      return new Response(
        JSON.stringify({ error: "Invalid token or user not found" }),
        { status: 401, headers: { "Content-Type": "application/json" } },
      );
    }

    // Create admin client for database queries
    const SUPABASE_URL = "https://xaqeueshxpehijtxwklo.supabase.co";
    const SUPABASE_SERVICE_ROLE_KEY =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhcWV1ZXNoeHBlaGlqdHh3a2xvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjU5NjY4MywiZXhwIjoyMDY4MTcyNjgzfQ.V5jpUlbJsNQAOH4jFjwfjSG4MK4SA2vVnAKLI99mPlE";
    const adminSupabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // First, fetch user's enrollments
    const { data: enrollments, error: enrollmentsError } = await adminSupabase
      .from("user_journey_enrollments")
      .select("id, journey_id, status")
      .eq("user_id", user.id)
      .order("enrolled_at", { ascending: false });

    if (enrollmentsError) {
      console.error("Enrollments query error:", enrollmentsError);
      return new Response(JSON.stringify({ error: enrollmentsError.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!enrollments || enrollments.length === 0) {
      return new Response(JSON.stringify({ data: [] }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Extract journey IDs from enrollments
    const journeyIds = enrollments.map((e) => e.journey_id);

    // Fetch journey templates using those IDs
    const { data: journeys, error: journeysError } = await adminSupabase
      .from("journey_templates")
      .select("*")
      .in("id", journeyIds)
      .eq("is_active", true);

    if (journeysError) {
      console.error("Journeys query error:", journeysError);
      return new Response(JSON.stringify({ error: journeysError.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Build the response by matching enrollments with journeys
    const items = await Promise.all(
      (journeys ?? []).map(async (j: any) => {
        // Find the matching enrollment
        const enrollment = enrollments.find((e: any) => e.journey_id === j.id);

        const enrollmentStatus = enrollment?.status ?? null;
        const isEnrolled = enrollmentStatus === "active";

        // Count completed nodes if enrolled
        let completedNodes = 0;
        if (enrollment && isEnrolled) {
          const { count } = await adminSupabase
            .from("user_node_progress")
            .select("id", { count: "exact", head: true })
            .eq("enrollment_id", enrollment.id)
            .eq("status", "completed");

          completedNodes = count ?? 0;
        }

        return {
          id: j.id,
          slug: j.slug,
          title: j.title,
          description: j.description ?? "",
          iconUrl: j.icon_url ?? null,
          colorScheme: j.color_scheme ?? "blue",
          category: j.category ?? "general",
          difficulty: j.difficulty ?? "beginner",
          estimatedDays: j.estimated_days ?? null,
          totalNodes: j.total_nodes ?? 0,
          completedNodes,
          isEnrolled,
          enrollmentStatus,
          colorThemeKey: j.color_theme_key ?? null,
          iconKey: j.icon_key ?? null,
        };
      }),
    );

    // Find the course with the latest node completion date
    let activeSlug = null;
    const { data: latestCompletion } = await adminSupabase
      .from("user_node_completions")
      .select("journey_id, completed_at")
      .eq("user_id", user.id)
      .order("completed_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (latestCompletion) {
      const latestJourney = items.find(
        (item: any) => item.id === latestCompletion.journey_id,
      );
      if (latestJourney) {
        activeSlug = latestJourney.slug;
      }
    } else if (items.length > 0) {
      // If no completions, use the first enrolled course
      activeSlug = items[0].slug;
    }

    return new Response(
      JSON.stringify({ data: items, activeSlug: activeSlug ?? 'anxiety-toolkit', success: true }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
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

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/fetch-enrolled-journeys' \
    --header 'Authorization: Bearer YOUR_JWT_TOKEN' \
    --header 'Content-Type: application/json'

*/
