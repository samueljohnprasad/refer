import type { ExerciseStatsEntry } from "@/src/hooks/insights/useExerciseStats";
import type {
  PrePostFieldMapping,
  PrePostSession,
} from "@/src/hooks/insights/config/types";

export function extractPrePostSessions(
  entries: ExerciseStatsEntry[],
  mappings: PrePostFieldMapping[],
): PrePostSession[] {
  const mappingByType = new Map(mappings.map((m) => [m.exerciseType, m]));
  const sessions: PrePostSession[] = [];

  for (const entry of entries) {
    const mapping = mappingByType.get(entry.exercise_type);
    if (!mapping) continue;

    const pre = entry.response?.[mapping.preField];
    const post = entry.response?.[mapping.postField];
    if (typeof pre !== "number" || typeof post !== "number") continue;

    const shift =
      mapping.direction === "pre_minus_post" ? pre - post : post - pre;

    sessions.push({
      date: entry.completed_at,
      pre,
      post,
      shift,
      exerciseType: entry.exercise_type,
    });
  }

  return sessions.sort((a, b) => a.date.localeCompare(b.date));
}
