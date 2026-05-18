// start-course/index.ts
// Creates user_course_progress + unlocks the first node.
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
    .eq("course_id", courseId)
    .maybeSingle();

  const alreadyStarted = existingProgress !== null;

  // ── 4. Upsert user_course_progress ────────────────────────────────────────
  const { error: upsertError } = await supabase
    .from("user_course_progress")
    .upsert(
      {
        course_id: courseId,
        status: "in_progress",
        started_at: new Date().toISOString(),
      },
      { onConflict: "user_id,course_id", ignoreDuplicates: true },
    );

  if (upsertError) return err("Failed to start course", 500);

  // ── 5. Find the first node in the course (by order) ──────────────────────
  const { data: firstNodeData, error: firstNodeError } = await supabase
    .from("nodes")
    .select(
      `
      id,
      units!inner (
        section_id,
        order_index,
        sections!inner (
          course_id,
          order_index
        )
      ),
      order_index
    `,
    )
    .eq("units.sections.course_id", courseId)
    .order("units.sections.order_index", { ascending: true })
    .order("units.order_index", { ascending: true })
    .order("order_index", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (firstNodeError || !firstNodeData) return err("Course has no nodes", 404);

  const firstNodeId = (firstNodeData as Record<string, unknown>)[
    "id"
  ] as string;

  // ── 6. Unlock the first node ─────────────────────────────────────────────
  const { error: nodeProgressError } = await supabase
    .from("user_node_progress")
    .upsert(
      { node_id: firstNodeId, status: "not_started", attempts: 0 },
      { onConflict: "user_id,node_id", ignoreDuplicates: true },
    );

  if (nodeProgressError) return err("Failed to unlock first node", 500);

  return ok({ courseProgressId: courseId, firstNodeId, alreadyStarted });
});
