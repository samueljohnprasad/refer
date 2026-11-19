// ponytail: which exercise types this user has ever started, and which still have a paused entry —
// from the same exercise_entries table the log reads. Feeds "Not tried yet" and "Paused part way".
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/src/context/AuthContext';
import { pausedRung } from '../../domain/fearLadder';
import { fetchEntryStatuses, fetchPausedFearLadderResponse } from '../../data/exerciseEntryStatus.repo';

export interface ExerciseEntryStatus {
  tried: ReadonlySet<string>;
  paused: ReadonlySet<string>;
  /** newest paused Fear Ladder run's rung, when one is picked */
  fearLadderRung?: { position: number; total: number };
}

const NONE: ExerciseEntryStatus = { tried: new Set(), paused: new Set() };

export function useExerciseEntryStatus(): ExerciseEntryStatus {
  const { user } = useAuth();
  const { data } = useQuery({
    queryKey: ['exercise_entry_status', user?.id],
    enabled: !!user?.id,
    queryFn: async (): Promise<ExerciseEntryStatus> => {
      const [rows, ladder] = await Promise.all([fetchEntryStatuses(user!.id), fetchPausedFearLadderResponse(user!.id)]);
      return {
        fearLadderRung: pausedRung(ladder),
        tried: new Set(rows.map((r) => r.exercise_type)),
        paused: new Set(rows.filter((r) => r.status === 'in_progress').map((r) => r.exercise_type)),
      };
    },
  });
  return data ?? NONE;
}
