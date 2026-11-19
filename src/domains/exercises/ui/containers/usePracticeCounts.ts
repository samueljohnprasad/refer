import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/src/context/AuthContext';
import { supabase } from '@/src/network/auth/supabase';
import { practiceCounts, type PracticeEntry } from '../../domain/practice';

// AD-16: the one source for the ring and lifetime count. Never selects `response`.
export function usePracticeCounts() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['practice_counts', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('exercise_entries' as any)
        .select('exercise_type,status,selected_date')
        .eq('user_id', user!.id)
        .in('status', ['completed', 'summary', 'checker_completed']);
      if (error) throw error;
      return practiceCounts((data as unknown as PracticeEntry[]) ?? [], new Date());
    },
    enabled: !!user?.id,
  });
}
