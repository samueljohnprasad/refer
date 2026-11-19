// ponytail: thin reads over exercise_entries for the Lessons library — which types were ever started,
// which are paused, and the newest paused Fear Ladder's saved response. Lean selects: no full rows.
import { supabase } from '@/src/network/auth/supabase';

const entries = () => supabase.from('exercise_entries' as any);

export async function fetchEntryStatuses(userId: string): Promise<{ exercise_type: string; status: string }[]> {
  const res = await entries().select('exercise_type, status').eq('user_id', userId);
  return (res.data as unknown as { exercise_type: string; status: string }[]) ?? [];
}

export async function fetchPausedFearLadderResponse(userId: string): Promise<Record<string, any> | undefined> {
  const res = await entries()
    .select('response')
    .eq('user_id', userId)
    .eq('exercise_type', 'fear_ladder')
    .eq('status', 'in_progress')
    .order('created_at', { ascending: false })
    .limit(1);
  return (res.data as unknown as { response?: Record<string, any> }[] | null)?.[0]?.response;
}
