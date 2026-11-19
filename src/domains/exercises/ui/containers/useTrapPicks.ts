import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/src/context/AuthContext';
import { supabase } from '@/src/network/auth/supabase';
import { rankTraps } from '../../domain/trap';

// AD-15: the person's most-picked traps, from completed thought_catcher rows only.
// fairCount is the AD-21 ordinal: completed rows carrying a non-empty balancedThought.
export function useTrapPicks() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['trap_picks', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('exercise_entries' as any)
        .select('response')
        .eq('user_id', user!.id)
        .eq('exercise_type', 'thought_catcher')
        .eq('status', 'completed');
      if (error) throw error;
      const rows = (data as unknown as { response?: { trap?: string; balancedThought?: string } | null }[]) ?? [];
      return { picks: rankTraps(rows), fairCount: rows.filter((r) => r.response?.balancedThought?.trim()).length };
    },
    enabled: !!user?.id,
  });
}
