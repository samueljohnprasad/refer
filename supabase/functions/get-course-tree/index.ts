// get-course-tree/index.ts
// Returns the full content tree for a course: course + sections + units + nodes.
// Replaces 4 client sub-queries with a single Edge Function round trip.
// Cache: aggressive (tree only changes on content republish).

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

  // ── 1. Parse and validate request body ──────────────────────────────────
  let courseId: string;
  try {
    const body = (await req.json()) as Record<string, unknown>;
    courseId = body["courseId"] as string;
    if (!courseId) return err("courseId is required");
  } catch {
    return err("Invalid request body");
  }

  // ── 2. Fetch course (must be published) ──────────────────────────────────
  const { data: course, error: courseError } = await supabase
    .from("courses")
    .select(
      "id, title, description, icon_url, color_hex, order_index, is_published",
    )
    .eq("id", courseId)
    .eq("is_published", true)
    .single();

  if (courseError || !course) return err("Course not found", 404);

  // ── 3. Fetch sections for this course ────────────────────────────────────
  const { data: sections, error: sectionsError } = await supabase
    .from("sections")
    .select("id, course_id, title, order_index")
    .eq("course_id", courseId)
    .order("order_index", { ascending: true });

  if (sectionsError) return err("Failed to fetch sections", 500);

  const sectionIds = (sections ?? []).map((s: { id: string }) => s.id);

  // ── 4. Fetch units for all sections ─────────────────────────────────────
  let units: unknown[] = [];
  if (sectionIds.length > 0) {
    const { data: unitsData, error: unitsError } = await supabase
      .from("units")
      .select("id, section_id, title, icon_key, order_index")
      .in("section_id", sectionIds)
      .order("order_index", { ascending: true });

    if (unitsError) return err("Failed to fetch units", 500);
    units = unitsData ?? [];
  }

  const unitIds = (units as Array<{ id: string }>).map((u) => u.id);

  // ── 5. Fetch nodes for all units ─────────────────────────────────────────
  let nodes: unknown[] = [];
  if (unitIds.length > 0) {
    const { data: nodesData, error: nodesError } = await supabase
      .from("nodes")
      .select(
        "id, unit_id, title, type, content_id, content_type, pass_threshold, order_index, estimated_mins",
      )
      .in("unit_id", unitIds)
      .order("order_index", { ascending: true });

    if (nodesError) return err("Failed to fetch nodes", 500);
    nodes = nodesData ?? [];
  }

  // ── 6. Build camelCase response ──────────────────────────────────────────
  return ok({
    course: {
      id: course.id,
      title: course.title,
      description: course.description,
      iconUrl: course.icon_url,
      colorHex: course.color_hex,
      orderIndex: course.order_index,
      isPublished: course.is_published,
    },
    sections: (sections ?? []).map((s: Record<string, unknown>) => ({
      id: s["id"],
      courseId: s["course_id"],
      title: s["title"],
      orderIndex: s["order_index"],
    })),
    units: (units as Array<Record<string, unknown>>).map((u) => ({
      id: u["id"],
      sectionId: u["section_id"],
      title: u["title"],
      iconKey: u["icon_key"],
      orderIndex: u["order_index"],
    })),
    nodes: (nodes as Array<Record<string, unknown>>).map((n) => ({
      id: n["id"],
      unitId: n["unit_id"],
      title: n["title"],
      type: n["type"],
      contentId: n["content_id"],
      contentType: n["content_type"],
      passThreshold: n["pass_threshold"],
      orderIndex: n["order_index"],
      estimatedMins: n["estimated_mins"],
    })),
  });
});
