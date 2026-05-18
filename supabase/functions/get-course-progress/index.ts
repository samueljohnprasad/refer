// get-course-progress/index.ts
// Returns courseProgress row + nodeProgressMap (keyed by nodeId) for a course.
// Builds the map server-side so the client gets O(1) lookups rather than an array to scan.
// Cache: short TTL — invalidated after every node mutation.

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

  // ── 2. Fetch course progress and node progress in parallel ────────────────
  const [courseProgressResult, nodeProgressResult] = await Promise.all([
    supabase
      .from("user_course_progress")
      .select("user_id, course_id, status, started_at, completed_at")
      .eq("course_id", courseId)
      .maybeSingle(),

    supabase
      .from("user_node_progress")
      .select(
        `
        user_id, node_id, status, attempts,
        best_score, last_score, last_attempted_at, completed_at,
        nodes!inner (
          unit_id,
          units!inner (
            section_id,
            sections!inner ( course_id )
          )
        )
      `,
      )
      .eq("nodes.units.sections.course_id", courseId),
  ]);

  if (courseProgressResult.error)
    return err("Failed to fetch course progress", 500);
  if (nodeProgressResult.error)
    return err("Failed to fetch node progress", 500);

  // ── 3. Build nodeProgressMap as keyed object ─────────────────────────────
  const nodeProgressRows = (nodeProgressResult.data ?? []) as Array<
    Record<string, unknown>
  >;

  const nodeProgressMap: Record<string, unknown> = {};
  for (const row of nodeProgressRows) {
    const nodeId = row["node_id"] as string;
    nodeProgressMap[nodeId] = {
      status: row["status"],
      attempts: row["attempts"],
      bestScore: row["best_score"],
      lastScore: row["last_score"],
      lastAttemptedAt: row["last_attempted_at"],
      completedAt: row["completed_at"],
    };
  }

  // ── 4. Build courseProgress (null if not enrolled) ───────────────────────
  const courseProgressRow = courseProgressResult.data as Record<
    string,
    unknown
  > | null;
  const courseProgress = courseProgressRow
    ? {
        userId: courseProgressRow["user_id"],
        courseId: courseProgressRow["course_id"],
        status: courseProgressRow["status"],
        startedAt: courseProgressRow["started_at"],
        completedAt: courseProgressRow["completed_at"],
      }
    : null;

  return ok({ courseProgress, nodeProgressMap });
});
