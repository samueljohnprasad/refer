import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';
import { useQuery, UseQueryResult } from '@tanstack/react-query';

export interface UseFetchMoodsRangeParams {
  startDate: Date;
  endDate: Date;
}

export type MoodsMap = Map<string, number>; // key: 'yyyy-MM-dd' -> mood_avg (0-10)

async function fetchMoodsInRange(
  userId: string,
  startDate: Date,
  endDate: Date
): Promise<MoodsMap> {
  const moodMap: MoodsMap = new Map<string, number>();

  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);
  const startIso: string = start.toISOString();
  const endIso: string = end.toISOString();

  const { data, error } = await supabase
    .from('daily_moods')
    .select('day, mood_avg')
    .eq('user_id', userId)
    .gte('day', startIso)
    .lt('day', endIso)
    .order('day', { ascending: true });

  if (error || !data) {
    console.error('Error fetching daily moods:', error);
    return moodMap;
  }

  for (const row of data as Array<{ day: string; mood_avg: number }>) {
    const localDate = new Date(row.day);
    localDate.setHours(0, 0, 0, 0);
    moodMap.set(format(localDate, 'yyyy-MM-dd'), Math.round(row.mood_avg));
  }

  return moodMap;
}

export function useFetchMoodsRange(
  params: UseFetchMoodsRangeParams
): UseQueryResult<MoodsMap, Error> {
  const { startDate, endDate } = params;
  const { user } = useAuth();

  const startKey = format(new Date(startDate), 'yyyy-MM-dd');
  const endKey = format(new Date(endDate), 'yyyy-MM-dd');

  return useQuery<MoodsMap, Error>({
    queryKey: ['daily-moods-range', user?.id, startKey, endKey],
    queryFn: async () => {
      if (!user?.id) return new Map<string, number>();
      return fetchMoodsInRange(user.id, startDate, endDate);
    },
    staleTime: 5 * 60_000,
    gcTime: 10 * 60_000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: Boolean(user?.id && startDate && endDate),
  });
}
