// npx supabase functions deploy start-course --no-verify-jwt
// start-course/index.ts
// Creates user_course_progress for a course.
// Idempotent — safe to call multiple times. Returns existing state if already started.
// Called during auto-enrollment when get-course-progress returns courseProgress=null.

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import {
  CORS_HEADERS,
  createUserClient,
  extractToken,
  ok,
  err,
} from "../_shared/client.ts";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS")
    return new Response("ok", { headers: CORS_HEADERS });

  const token = extractToken(req);
  if (!token) return err("Missing authorization token", 401);

  const supabase = createUserClient(token);
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) return err("Failed to resolve authenticated user", 401);

  // ── 1. Parse request ──────────────────────────────────────────────────────
  let courseId: string;
  try {
    const body = (await req.json()) as Record<string, unknown>;
    courseId = body["courseId"] as string;
    if (!courseId) return err("courseId is required");
  } catch {
    return err("Invalid request body");
  }

  // ── 2. Verify course is published ─────────────────────────────────────────
  const { data: course, error: courseError } = await supabase
    .from("courses")
    .select("id")
    .eq("id", courseId)
    .eq("is_published", true)
    .single();

  if (courseError || !course) return err("Course not found", 404);

  // ── 3. Check if already started ──────────────────────────────────────────
  const { data: existingProgress } = await supabase
    .from("user_course_progress")
    .select("course_id")
    .eq("user_id", user.id)
    .eq("course_id", courseId)
    .maybeSingle();

  const alreadyStarted = existingProgress !== null;

  // ── 4. Resolve the first node in the course (section → unit → node) ─────
  const { data: firstSection, error: firstSectionError } = await supabase
    .from("sections")
    .select("id")
    .eq("course_id", courseId)
    .order("order_index", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (firstSectionError)
    return err(
      `Failed to fetch first section: ${firstSectionError.message}`,
      500,
    );
  if (!firstSection) return err("Course has no sections", 404);

  const firstSectionId = (firstSection as Record<string, unknown>)["id"] as string;

  const { data: firstUnit, error: firstUnitError } = await supabase
    .from("units")
    .select("id")
    .eq("section_id", firstSectionId)
    .order("order_index", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (firstUnitError)
    return err(`Failed to fetch first unit: ${firstUnitError.message}`, 500);
  if (!firstUnit) return err("Course has no units", 404);

  const firstUnitId = (firstUnit as Record<string, unknown>)["id"] as string;

  const { data: firstNode, error: firstNodeError } = await supabase
    .from("nodes")
    .select("id")
    .eq("unit_id", firstUnitId)
    .order("order_index", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (firstNodeError)
    return err(`Failed to fetch first node: ${firstNodeError.message}`, 500);
  if (!firstNode) return err("Course has no nodes", 404);

  const firstNodeId = (firstNode as Record<string, unknown>)["id"] as string;

  // ── 5. Upsert user_course_progress ────────────────────────────────────────
  const { error: upsertError } = await supabase
    .from("user_course_progress")
    .upsert(
      {
        user_id: user.id,
        course_id: courseId,
        status: "in_progress",
        started_at: new Date().toISOString(),
      },
      { onConflict: "user_id,course_id", ignoreDuplicates: true },
    );

  if (upsertError)
    return err(`Failed to start course: ${upsertError.message}`, 500);

  return ok({ courseProgressId: courseId, firstNodeId, alreadyStarted });
});
