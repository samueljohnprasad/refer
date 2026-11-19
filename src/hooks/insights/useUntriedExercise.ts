// ponytail: the first free exercise this person has never completed (the prototype's `untried`).
// Reads lifetime entries from useExerciseStats — no new query.
import { useMemo } from 'react';
import { getAllExercises } from '@/src/data/exerciseRegistry';
import type { ExerciseConfig } from '@/src/types/exerciseFlow';
import { useExerciseStats } from './useExerciseStats';

export function useUntriedExercise(): ExerciseConfig<any> | null {
  const { data: stats } = useExerciseStats();
  return useMemo(() => {
    if (!stats) return null;
    const done = new Set<string>(stats.entries.map((e) => e.exercise_type));
    return getAllExercises().find((e) => !e.isProOnly && !done.has(e.type)) ?? null;
  }, [stats]);
}
