import type { NodeContext } from "./completionData.ts";

const AUTOMATIC_REWARD_TYPES = new Set(["trophy"]);

export async function isNodeUnlocked(
  database: any,
  userId: string,
  courseId: string,
  node: NodeContext,
) {
  const { data, error } = await database
    .from("nodes")
    .select(
      "id, type, unit_id, order_index, units!inner(order_index, sections!inner(order_index, course_id))",
    )
    .eq("units.sections.course_id", courseId);
  if (error) return false;

  const previousRequiredIds = (data ?? [])
    .filter((candidate: any) => !AUTOMATIC_REWARD_TYPES.has(candidate.type))
    .filter((candidate: any) => compareCourseOrder(candidate, node) < 0)
    .sort(compareCourseOrder)
    .map((candidate: { id: string }) => candidate.id);
  if (!previousRequiredIds.length) return true;

  const progress = await database
    .from("user_course_node_progress")
    .select("node_id")
    .eq("user_id", userId)
    .in("node_id", previousRequiredIds)
    .eq("status", "completed");
  if (progress.error) return false;
  return (progress.data ?? []).length === previousRequiredIds.length;
}

function compareCourseOrder(left: any, right: NodeContext) {
  const leftSection = left.units?.sections?.order_index ?? 0;
  const rightSection = right.units.sections.order_index;
  const leftUnit = left.units?.order_index ?? 0;
  const rightUnit = right.units.order_index;
  return (
    leftSection - rightSection ||
    leftUnit - rightUnit ||
    left.order_index - right.order_index
  );
}
