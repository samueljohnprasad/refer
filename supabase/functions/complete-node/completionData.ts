export const COMPLETED = "completed";
export const CHEST = "chest";
export const TROPHY = "trophy";
const AUTOMATIC_REWARD_NODE_TYPES = [TROPHY] as const;

export interface NodeContext {
  id: string;
  title: string;
  type: string;
  unit_id: string;
  order_index: number;
  reward_content: Record<string, unknown> | null;
  units: {
    id: string;
    title: string;
    reward_content: Record<string, unknown> | null;
    section_id: string;
    order_index: number;
    sections: { course_id: string; order_index: number };
  };
}

export async function parseInput(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    if (typeof body.nodeId !== "string" || typeof body.courseId !== "string")
      return null;
    return { nodeId: body.nodeId, courseId: body.courseId };
  } catch {
    return null;
  }
}

export async function fetchNode(
  database: any,
  nodeId: string,
): Promise<NodeContext | null> {
  const { data, error } = await database
    .from("nodes")
    .select(
      `id, title, type, unit_id, order_index, reward_content,
     units!inner(id, title, reward_content, section_id, order_index,
       sections!inner(course_id, order_index))`,
    )
    .eq("id", nodeId)
    .single();
  return error ? null : (data as NodeContext);
}

async function fetchProgress(database: any, userId: string, nodeId: string) {
  const { data } = await database
    .from("user_course_node_progress")
    .select("status")
    .eq("user_id", userId)
    .eq("node_id", nodeId)
    .maybeSingle();
  return data as { status: string } | null;
}

export async function completeOnce(
  database: any,
  userId: string,
  nodeId: string,
) {
  const now = new Date().toISOString();
  const update = await database
    .from("user_course_node_progress")
    .update({ status: COMPLETED, last_attempted_at: now, completed_at: now })
    .eq("user_id", userId)
    .eq("node_id", nodeId)
    .neq("status", COMPLETED)
    .select("node_id");
  if (update.error) return { completed: false, error: update.error };
  if (update.data?.length) return { completed: true, error: null };

  const insert = await database.from("user_course_node_progress").insert({
    user_id: userId,
    node_id: nodeId,
    status: COMPLETED,
    attempts: 1,
    last_attempted_at: now,
    completed_at: now,
  });
  if (insert.error?.code === "23505") return { completed: false, error: null };
  return { completed: !insert.error, error: insert.error };
}

export async function isChestAvailable(
  database: any,
  userId: string,
  node: NodeContext,
) {
  const { data } = await database
    .from("nodes")
    .select("id")
    .eq("unit_id", node.unit_id)
    .lt("order_index", node.order_index)
    .not("type", "in", `(${AUTOMATIC_REWARD_NODE_TYPES.join(",")})`)
    .order("order_index", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (!data) return false;
  return (await fetchProgress(database, userId, data.id))?.status === COMPLETED;
}

export async function findNextProgressionNode(
  database: any,
  unitId: string,
  orderIndex: number,
) {
  const { data } = await database
    .from("nodes")
    .select("id")
    .eq("unit_id", unitId)
    .gt("order_index", orderIndex)
    .not("type", "in", `(${AUTOMATIC_REWARD_NODE_TYPES.join(",")})`)
    .order("order_index", { ascending: true })
    .limit(1)
    .maybeSingle();
  return (data?.id as string | undefined) ?? null;
}

export async function findNextUnitNode(database: any, node: NodeContext) {
  const { data } = await database
    .from("units")
    .select("id, order_index, nodes!inner(id, type, order_index)")
    .eq("section_id", node.units.section_id)
    .gt("order_index", node.units.order_index)
    .order("order_index", { ascending: true })
    .limit(1)
    .maybeSingle();
  return firstRequiredNodeId(data?.nodes);
}

export async function findNextSectionNode(database: any, node: NodeContext) {
  const { data } = await database
    .from("sections")
    .select(
      "id, units!inner(id, order_index, nodes!inner(id, type, order_index))",
    )
    .eq("course_id", node.units.sections.course_id)
    .gt("order_index", node.units.sections.order_index)
    .order("order_index", { ascending: true })
    .limit(1)
    .maybeSingle();
  const units = [...(data?.units ?? [])].sort(byOrder);
  return firstRequiredNodeId(units[0]?.nodes);
}

function firstRequiredNodeId(
  nodes: Array<{ id: string; type: string; order_index: number }> | undefined,
) {
  return (
    [...(nodes ?? [])]
      .filter(
        ({ type }) =>
          !AUTOMATIC_REWARD_NODE_TYPES.includes(
            type as (typeof AUTOMATIC_REWARD_NODE_TYPES)[number],
          ),
      )
      .sort(byOrder)[0]?.id ?? null
  );
}

function byOrder(
  left: { order_index: number },
  right: { order_index: number },
) {
  return left.order_index - right.order_index;
}

export async function awardTrophy(
  database: any,
  userId: string,
  unitId: string,
) {
  const { data, error } = await database
    .from("nodes")
    .select("id")
    .eq("unit_id", unitId)
    .eq("type", TROPHY);
  if (error || !data?.length) return !error;
  const now = new Date().toISOString();
  const rows = data.map(({ id }: { id: string }) => ({
    user_id: userId,
    node_id: id,
    status: COMPLETED,
    attempts: 1,
    last_attempted_at: now,
    completed_at: now,
  }));
  const result = await database
    .from("user_course_node_progress")
    .upsert(rows, { onConflict: "user_id,node_id", ignoreDuplicates: true });
  return !result.error;
}

export async function completeCourse(
  database: any,
  userId: string,
  courseId: string,
) {
  const now = new Date().toISOString();
  const progress = await database
    .from("user_course_progress")
    .update({ status: COMPLETED, completed_at: now, finale_seen_at: null })
    .eq("user_id", userId)
    .eq("course_id", courseId);
  if (progress.error) return null;
  const { data, error } = await database
    .from("courses")
    .select("id, title, reward_content")
    .eq("id", courseId)
    .single();
  return error ? null : data;
}

export async function findNextIncompleteCourseNode(
  database: any,
  userId: string,
  courseId: string,
) {
  const { data: nodes, error } = await database
    .from("nodes")
    .select(
      "id, type, order_index, units!inner(order_index, sections!inner(order_index, course_id))",
    )
    .eq("units.sections.course_id", courseId);
  if (error) return null;

  const requiredNodes = (nodes ?? [])
    .filter(({ type }: { type: string }) => !AUTOMATIC_REWARD_NODE_TYPES.includes(type as (typeof AUTOMATIC_REWARD_NODE_TYPES)[number]))
    .sort(compareCourseNodeOrder);
  const nodeIds = requiredNodes.map(({ id }: { id: string }) => id);
  if (!nodeIds.length) return null;

  const { data: completed, error: progressError } = await database
    .from("user_course_node_progress")
    .select("node_id")
    .eq("user_id", userId)
    .eq("status", COMPLETED)
    .in("node_id", nodeIds);
  if (progressError) return null;

  const completedIds = new Set(
    (completed ?? []).map(({ node_id }: { node_id: string }) => node_id),
  );
  return requiredNodes.find(({ id }: { id: string }) => !completedIds.has(id))?.id ?? null;
}

function compareCourseNodeOrder(left: any, right: any) {
  return (
    (left.units?.sections?.order_index ?? 0) - (right.units?.sections?.order_index ?? 0) ||
    (left.units?.order_index ?? 0) - (right.units?.order_index ?? 0) ||
    left.order_index - right.order_index ||
    left.id.localeCompare(right.id)
  );
}

export function buildResult(nodeId: string) {
  return {
    nodeId,
    nextNodeId: null,
    unitCompleted: false,
    sectionCompleted: false,
    courseCompleted: false,
    celebration: null,
  };
}

export function lessonCelebration(node: NodeContext) {
  if (
    !hasStrings(node.reward_content, [
      "title",
      "takeaway",
      "primaryActionLabel",
    ])
  ) {
    console.warn(`[rewards] missing lesson content for node ${node.id}`);
    return null;
  }
  return { level: "lesson", nodeId: node.id, content: node.reward_content };
}

export const hasInsightContent = (node: NodeContext) =>
  hasStrings(node.reward_content, ["title", "body", "claimActionLabel", "primaryActionLabel"]);

export function unitCelebration(node: NodeContext) {
  if (
    !hasStrings(node.units.reward_content, [
      "title",
      "capabilityLabel",
      "capabilityStatement",
      "primaryActionLabel",
    ])
  ) {
    console.warn(`[rewards] missing unit content for unit ${node.units.id}`);
    return null;
  }
  return {
    level: "unit",
    unitId: node.units.id,
    unitTitle: node.units.title,
    content: node.units.reward_content,
  };
}

export function courseCelebration(course: {
  id: string;
  title: string;
  reward_content: Record<string, unknown> | null;
}) {
  const content = course.reward_content;
  const valid =
    hasStrings(content, [
      "title",
      "acknowledgement",
      "capabilityHeading",
      "reviewActionLabel",
      "doneActionLabel",
    ]) &&
    Array.isArray(content?.capabilitySummary) &&
    content.capabilitySummary.length >= 3 &&
    content.capabilitySummary.length <= 5 &&
    content.capabilitySummary.every((item) => typeof item === "string");
  if (!valid) {
    console.warn(`[rewards] missing course content for course ${course.id}`);
    return null;
  }
  return {
    level: "course",
    courseId: course.id,
    courseTitle: course.title,
    content,
  };
}

function hasStrings(value: Record<string, unknown> | null, keys: string[]) {
  return Boolean(
    value && keys.every((key) => typeof value[key] === "string" && value[key]),
  );
}
