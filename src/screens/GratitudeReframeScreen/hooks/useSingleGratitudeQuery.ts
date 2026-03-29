import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/src/network/auth/supabase';
import { useAuth } from '@/src/context/AuthContext';
import { GratitudeEntry } from '../types';

export function useSingleGratitudeQuery(id?: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['gratitude', id],
    queryFn: async () => {
      if (!id || !user) return null;

      const { data, error } = await supabase
        .from('gratitude_entries' as never)
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching single gratitude entry:', error);
        return null;
      }

      return data as unknown as GratitudeEntry;
    },
    enabled: !!id && !!user,
  });
}
