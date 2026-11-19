import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/src/context/AuthContext';
import { supabase } from '@/src/network/auth/supabase';
import { showedUpDays, weekBoundsYmd, type PracticeEntry } from '../../domain/practice';

// AD-16: the one source for the week leaf. A day is filled by a completed exercise or a mood log.
export function useWeekShowedUp() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['week_showed_up', user?.id],
    queryFn: async (): Promise<Set<string>> => {
      const now = new Date();
      const { start, end } = weekBoundsYmd(now);
      // a day either side: mood timestamps are UTC and are re-bucketed to the local day in the domain
      const from = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 8).toISOString();
      const to = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 8).toISOString();
      const [ex, mood] = await Promise.all([
        supabase
          .from('exercise_entries' as any)
          .select('status,selected_date')
          .eq('user_id', user!.id)
          .in('status', ['completed', 'summary', 'checker_completed'])
          .gte('selected_date', start)
          .lte('selected_date', end),
        supabase
          .from('moods')
          .select('selected_date')
          .eq('user_id', user!.id)
          .gte('selected_date', from)
          .lte('selected_date', to),
      ]);
      if (ex.error) throw ex.error;
      if (mood.error) throw mood.error;
      return showedUpDays(
        (ex.data as unknown as PracticeEntry[]) ?? [],
        (mood.data ?? []).map((m) => m.selected_date as string | null),
        now,
      );
    },
    enabled: !!user?.id,
  });
}
