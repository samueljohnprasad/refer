import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/src/network/auth/supabase';
import { useAuth } from '@/src/context/AuthContext';
import { ThoughtReframingEntry } from '../types';

export function useSingleThoughtReframingQuery(id?: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['thought_reframing', id],
    queryFn: async () => {
      if (!id || !user) return null;

      const { data, error } = await supabase
        .from('thought_reframing_entries' as any)
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching single thought reframing:', error);
        return null;
      }

      return data as any as ThoughtReframingEntry;
    },
    enabled: !!id && !!user,
  });
}
