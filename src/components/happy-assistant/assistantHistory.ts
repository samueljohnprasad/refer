import { COMPLETE_EXERCISE_STATUSES } from "./constants";
import type { HistoryLogItem } from "@/src/screens/ExercisesScreen/hooks/useCBTHistory";

export function getLatestIncompleteExercise(
  history: HistoryLogItem[],
): HistoryLogItem | undefined {
  return history.find(
    (item) =>
      item.type === "unified" &&
      item.exerciseType &&
      !COMPLETE_EXERCISE_STATUSES.has(item.status),
  );
}
