// npx supabase functions deploy complete-node --no-verify-jwt
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import {
  CORS_HEADERS,
  createUserClient,
  err,
  extractToken,
  ok,
} from "../_shared/client.ts";
import {
  awardTrophy,
  buildResult,
  CHEST,
  completeCourse,
  completeOnce,
  courseCelebration,
  fetchNode,
  findNextProgressionNode,
  findNextIncompleteCourseNode,
  findNextSectionNode,
  findNextUnitNode,
  hasInsightContent,
  isChestAvailable,
  lessonCelebration,
  parseInput,
  TROPHY,
  unitCelebration,
} from "./completionData.ts";
import { isNodeUnlocked } from "./nodeAccess.ts";

Deno.serve(async (request: Request) => {
  if (request.method === "OPTIONS")
    return new Response("ok", { headers: CORS_HEADERS });
  const token = extractToken(request);
  if (!token) return err("Missing authorization token", 401);

  const supabase = createUserClient(token);
  // ponytail: generated Edge types trail the deployed curriculum schema.
  const database = supabase as any;
  const userResult = await supabase.auth.getUser();
  const user = userResult.data.user;
  if (userResult.error || !user)
    return err("Failed to resolve authenticated user", 401);

  const input = await parseInput(request);
  if (!input) return err("nodeId and courseId are required");
  const node = await fetchNode(database, input.nodeId);
  if (!node || node.units.sections.course_id !== input.courseId) {
    return err("Node not found in course", 404);
  }
  if (node.type === TROPHY)
    return err("Trophies are awarded automatically", 409);
  if (!(await isNodeUnlocked(database, user.id, input.courseId, node))) {
    return err("Node is locked", 409);
  }

  if (node.type === CHEST) {
    if (!hasInsightContent(node))
      return err("Chest content is unavailable", 409);
    if (!(await isChestAvailable(database, user.id, node)))
      return err("Chest is locked", 409);
    const transition = await completeOnce(database, user.id, node.id);
    if (transition.error) return err("Failed to claim chest", 500);
    if (!transition.completed) return ok(buildResult(node.id));
    return advanceAfterCompletion(database, user.id, input.courseId, node, null);
  }

  return completeLearningNode(database, user.id, input.courseId, node);
});

async function completeLearningNode(
  database: any,
  userId: string,
  courseId: string,
  node: import("./completionData.ts").NodeContext,
) {
  const transition = await completeOnce(database, userId, node.id);
  if (transition.error) return err("Failed to mark node complete", 500);
  if (!transition.completed) return ok(buildResult(node.id));

  return advanceAfterCompletion(
    database,
    userId,
    courseId,
    node,
    lessonCelebration(node),
  );
}

async function advanceAfterCompletion(
  database: any,
  userId: string,
  courseId: string,
  node: import("./completionData.ts").NodeContext,
  lessonCelebrationContent: ReturnType<typeof lessonCelebration>,
) {
  const nextInUnit = await findNextProgressionNode(
    database,
    node.unit_id,
    node.order_index,
  );
  if (nextInUnit) {
    return ok({
      ...buildResult(node.id),
      nextNodeId: nextInUnit,
      celebration: lessonCelebrationContent,
    });
  }

  if (!(await awardTrophy(database, userId, node.unit_id))) {
    return err("Failed to award unit trophy", 500);
  }

  const nextInSection = await findNextUnitNode(database, node);
  if (nextInSection) {
    return ok({
      ...buildResult(node.id),
      nextNodeId: nextInSection,
      unitCompleted: true,
      celebration: unitCelebration(node),
    });
  }

  const nextInCourse = await findNextSectionNode(database, node);
  if (nextInCourse) {
    return ok({
      ...buildResult(node.id),
      nextNodeId: nextInCourse,
      unitCompleted: true,
      sectionCompleted: true,
      celebration: unitCelebration(node),
    });
  }

  const nextIncompleteNodeId = await findNextIncompleteCourseNode(
    database,
    userId,
    courseId,
  );
  if (nextIncompleteNodeId) {
    return ok({
      ...buildResult(node.id),
      nextNodeId: nextIncompleteNodeId,
      unitCompleted: true,
      sectionCompleted: true,
      celebration: unitCelebration(node),
    });
  }

  const course = await completeCourse(database, userId, courseId);
  if (!course) return err("Failed to complete course", 500);
  return ok({
    ...buildResult(node.id),
    unitCompleted: true,
    sectionCompleted: true,
    courseCompleted: true,
    celebration: courseCelebration(course),
  });
}
