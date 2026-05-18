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

  // ── 2. Fetch course progress + section ids in parallel ────────────────────
  const [courseProgressResult, sectionsResult] = await Promise.all([
    supabase
      .from("user_course_progress")
      .select("user_id, course_id, status, started_at, completed_at")
      .eq("user_id", user.id)
      .eq("course_id", courseId)
      .maybeSingle(),

    supabase
      .from("sections")
      .select("id")
      .eq("course_id", courseId),
  ]);

  if (courseProgressResult.error)
    return err(
      `Failed to fetch course progress: ${courseProgressResult.error.message}`,
      500,
    );
  if (sectionsResult.error)
    return err(`Failed to fetch sections: ${sectionsResult.error.message}`, 500);

  // ── 3. Resolve all node ids for the course via sections → units → nodes ──
  const sectionIds = (sectionsResult.data ?? []).map(
    (section: { id: string }) => section.id,
  );

  let unitIds: string[] = [];
  if (sectionIds.length > 0) {
    const { data: unitsData, error: unitsError } = await supabase
      .from("units")
      .select("id")
      .in("section_id", sectionIds);

    if (unitsError)
      return err(`Failed to fetch units: ${unitsError.message}`, 500);

    unitIds = (unitsData ?? []).map((unit: { id: string }) => unit.id);
  }

  let nodeIds: string[] = [];
  if (unitIds.length > 0) {
    const { data: nodesData, error: nodesError } = await supabase
      .from("nodes")
      .select("id")
      .in("unit_id", unitIds);

    if (nodesError)
      return err(`Failed to fetch nodes: ${nodesError.message}`, 500);

    nodeIds = (nodesData ?? []).map((node: { id: string }) => node.id);
  }

  let nodeProgressRows: Array<Record<string, unknown>> = [];
  if (nodeIds.length > 0) {
    const { data: nodeProgressData, error: nodeProgressError } = await supabase
      .from("user_course_node_progress")
      .select(
        "user_id, node_id, status, attempts, best_score, last_score, last_attempted_at, completed_at",
      )
      .eq("user_id", user.id)
      .in("node_id", nodeIds);

    if (nodeProgressError)
      return err(
        `Failed to fetch node progress: ${nodeProgressError.message}`,
        500,
      );

    nodeProgressRows = (nodeProgressData ?? []) as Array<Record<string, unknown>>;
  }

  // ── 4. Build nodeProgressMap as keyed object ─────────────────────────────

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

  // ── 5. Build courseProgress (null if not enrolled) ───────────────────────
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
