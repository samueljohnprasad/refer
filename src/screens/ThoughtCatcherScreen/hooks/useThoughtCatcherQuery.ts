import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/src/network/auth/supabase';
import { useAuth } from '@/src/context/AuthContext';
import type { ThoughtCatcherEntry } from '../types';

export const useThoughtCatcherQuery = () => {
  const { user } = useAuth();

  const query = useQuery({
    queryKey: ['thought_catcher', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('thought_catcher_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ThoughtCatcherEntry[];
    },
    enabled: !!user?.id,
  });

  return {
    entries: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};

export const useSingleThoughtCatcherQuery = (id: string | null) => {
  const { user } = useAuth();

  const query = useQuery({
    queryKey: ['thought_catcher_single', id, user?.id],
    queryFn: async () => {
      if (!user?.id || !id) throw new Error('Missing user or id');

      const { data, error } = await supabase
        .from('thought_catcher_entries')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      return data as ThoughtCatcherEntry;
    },
    enabled: !!user?.id && !!id,
  });

  return {
    entry: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
};
