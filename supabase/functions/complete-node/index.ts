// complete-node/index.ts
// Marks a node as completed and unlocks the next node in sequence.
// No attempt tracking or scoring — simple Done-button completion.
// Rule order: next in unit → first of next unit → first of next section → course complete.

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import {
  CORS_HEADERS,
  createUserClient,
  extractToken,
  ok,
  err,
} from "../_shared/client.ts";

// ── Types ─────────────────────────────────────────────────────────────────────

interface NodeContext {
  id: string;
  unit_id: string;
  order_index: number;
  units: {
    id: string;
    section_id: string;
    order_index: number;
    sections: {
      id: string;
      course_id: string;
      order_index: number;
    };
  };
}

// ── Main handler ──────────────────────────────────────────────────────────────

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS")
    return new Response("ok", { headers: CORS_HEADERS });

  const token = extractToken(req);
  if (!token) return err("Missing authorization token", 401);

  const supabase = createUserClient(token);

  // ── 1. Parse request ──────────────────────────────────────────────────────
  let nodeId: string, courseId: string;
  try {
    const body = (await req.json()) as Record<string, unknown>;
    nodeId = body["nodeId"] as string;
    courseId = body["courseId"] as string;
    if (!nodeId || !courseId) return err("nodeId and courseId are required");
  } catch {
    return err("Invalid request body");
  }

  // ── 2. Fetch node with full tree context ──────────────────────────────────
  const { data: nodeData, error: nodeError } = await supabase
    .from("nodes")
    .select(
      `
      id, unit_id, order_index,
      units!inner (
        id, section_id, order_index,
        sections!inner ( id, course_id, order_index )
      )
    `,
    )
    .eq("id", nodeId)
    .single();

  if (nodeError || !nodeData) return err("Node not found", 404);
  const node = nodeData as unknown as NodeContext;

  // ── 3. Check for re-completion ────────────────────────────────────────────
  const { data: currentProgress } = await supabase
    .from("user_node_progress")
    .select("status")
    .eq("node_id", nodeId)
    .maybeSingle();

  const isRecompletion =
    (currentProgress as Record<string, unknown> | null)?.["status"] ===
    "completed";

  // ── 4. Mark node as completed ─────────────────────────────────────────────
  const now = new Date().toISOString();
  const { error: updateError } = await supabase
    .from("user_node_progress")
    .upsert(
      {
        node_id: nodeId,
        status: "completed",
        attempts: 1,
        last_score: null,
        best_score: null,
        last_attempted_at: now,
        ...(!isRecompletion ? { completed_at: now } : {}),
      },
      { onConflict: "user_id,node_id" },
    );

  if (updateError) return err("Failed to mark node complete", 500);

  // ── 5. Re-completion: no unlock, return early ─────────────────────────────
  if (isRecompletion) {
    return ok({
      nodeId,
      nextNodeId: null,
      unitCompleted: false,
      sectionCompleted: false,
      courseCompleted: false,
    });
  }

  // ── 6. Unlock next node ───────────────────────────────────────────────────
  const unlockResult = await unlockNextNode(supabase, node, courseId);

  return ok({ nodeId, ...unlockResult });
});

// ── unlockNextNode ────────────────────────────────────────────────────────────

async function unlockNextNode(
  supabase: ReturnType<typeof import("../_shared/client.ts").createUserClient>,
  node: NodeContext,
  courseId: string,
): Promise<{
  nextNodeId: string | null;
  unitCompleted: boolean;
  sectionCompleted: boolean;
  courseCompleted: boolean;
}> {
  const { unit_id: unitId, order_index: nodeOrderIndex } = node;
  const unit = node.units;
  const section = unit.sections;
  const { section_id: sectionId, order_index: unitOrderIndex } = unit;
  const { order_index: sectionOrderIndex } = section;

  // Rule 1: next node in same unit
  const { data: nextInUnit } = await supabase
    .from("nodes")
    .select("id")
    .eq("unit_id", unitId)
    .gt("order_index", nodeOrderIndex)
    .order("order_index", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (nextInUnit) {
    const nextNodeId = (nextInUnit as Record<string, unknown>)["id"] as string;
    await unlockNodeProgress(supabase, nextNodeId);
    return {
      nextNodeId,
      unitCompleted: false,
      sectionCompleted: false,
      courseCompleted: false,
    };
  }

  // Rule 2: first node of next unit in same section
  const { data: nextUnit } = await supabase
    .from("units")
    .select(`id, nodes!inner ( id, order_index )`)
    .eq("section_id", sectionId)
    .gt("order_index", unitOrderIndex)
    .order("order_index", { ascending: true })
    .order("nodes.order_index", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (nextUnit) {
    const nodesArr = (nextUnit as Record<string, unknown>)["nodes"] as Array<
      Record<string, unknown>
    >;
    const nextNodeId = nodesArr[0]!["id"] as string;
    await unlockNodeProgress(supabase, nextNodeId);
    return {
      nextNodeId,
      unitCompleted: true,
      sectionCompleted: false,
      courseCompleted: false,
    };
  }

  // Rule 3: first node of next section in same course
  const { data: nextSection } = await supabase
    .from("sections")
    .select(
      `
      id,
      units!inner (
        id, order_index,
        nodes!inner ( id, order_index )
      )
    `,
    )
    .eq("course_id", courseId)
    .gt("order_index", sectionOrderIndex)
    .order("order_index", { ascending: true })
    .order("units.order_index", { ascending: true })
    .order("units.nodes.order_index", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (nextSection) {
    const unitsArr = (nextSection as Record<string, unknown>)["units"] as Array<
      Record<string, unknown>
    >;
    const nodesArr = unitsArr[0]!["nodes"] as Array<Record<string, unknown>>;
    const nextNodeId = nodesArr[0]!["id"] as string;
    await unlockNodeProgress(supabase, nextNodeId);
    return {
      nextNodeId,
      unitCompleted: true,
      sectionCompleted: true,
      courseCompleted: false,
    };
  }

  // Rule 4: no more nodes → course complete
  await supabase
    .from("user_course_progress")
    .update({ status: "completed", completed_at: new Date().toISOString() })
    .eq("course_id", courseId);

  return {
    nextNodeId: null,
    unitCompleted: true,
    sectionCompleted: true,
    courseCompleted: true,
  };
}

/** Inserts a not_started progress row for the given node. Idempotent. */
async function unlockNodeProgress(
  supabase: ReturnType<typeof import("../_shared/client.ts").createUserClient>,
  nodeId: string,
): Promise<void> {
  await supabase
    .from("user_node_progress")
    .upsert(
      { node_id: nodeId, status: "not_started", attempts: 0 },
      { onConflict: "user_id,node_id", ignoreDuplicates: true },
    );
}
