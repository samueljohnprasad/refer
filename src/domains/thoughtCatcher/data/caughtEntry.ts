// Reads back the rung-2 response of a sitting so a restored draft can upgrade the same row at rung 3.
// null = the row is confirmed missing; a failed read throws so the caller keeps the draft.
import { supabase } from '@/src/network/auth/supabase';
import type { ThoughtCatcherResponse } from '@/src/types/exerciseFlow';

export async function readCaughtResponse(id: string): Promise<ThoughtCatcherResponse | null> {
  const { data, error } = await supabase.from('exercise_entries' as any).select('response').eq('id', id).maybeSingle();
  if (error) throw error;
  return ((data as unknown as { response?: ThoughtCatcherResponse | null } | null)?.response) ?? null;
}
