// ponytail: filter state + filtered groups for the Lessons library. Rules live in
// domain/libraryFilter.ts; this hook only holds the selected chip and the data it needs.
import { useMemo, useState } from 'react';
import type { ExerciseCategory, ExerciseConfig } from '@/src/types/exerciseFlow';
import { filterExercises, LibraryFilter } from '../../domain/libraryFilter';
import { useExerciseEntryStatus } from './useExerciseEntryStatus';

interface Group {
  category: ExerciseCategory;
  exercises: ExerciseConfig<any>[];
}

export function useExerciseLibrary<G extends Group>(groups: readonly G[]) {
  const [filter, setFilter] = useState<LibraryFilter>(LibraryFilter.All);
  const { tried } = useExerciseEntryStatus();

  const visible = useMemo(
    () =>
      groups
        .map((g) => ({ ...g, exercises: filterExercises(g.exercises, filter, tried) }))
        .filter((g) => g.exercises.length > 0),
    [groups, filter, tried],
  );

  return { filter, setFilter, visible };
}
