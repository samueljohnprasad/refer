/**
 * Bridge utility: maps journey node task types to unified exercise-flow routes.
 *
 * Journey exercise nodes have their own renderer (ExerciseNodeRenderer).
 * This bridge is for future use when journey nodes want to launch
 * a standalone unified exercise instead.
 *
 * Usage (in journey node handler):
 *   const route = getExerciseFlowRoute(node.taskType);
 *   if (route) router.push(route);
 */

import { getExerciseConfig } from "@/src/data/exerciseRegistry";
import { ExerciseType } from "../types/exerciseFlow";

/**
 * Map a journey node taskType to a unified exercise-flow route string.
 * Returns undefined if the taskType doesn't map to a known unified exercise.
 */
export function getExerciseFlowRoute(taskType: string): string | undefined {
  const config = getExerciseConfig(taskType as ExerciseType);
  if (!config) return undefined;
  return `/tabs/screens/exercise-flow?type=${config.type}`;
}

/**
 * Check if a journey node's taskType corresponds to a unified exercise.
 */
export function isUnifiedExercise(taskType: string): boolean {
  return !!getExerciseConfig(taskType as ExerciseType);
}
