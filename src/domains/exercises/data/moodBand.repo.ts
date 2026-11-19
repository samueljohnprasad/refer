// AD-18: the one read of today's check-in band. A failed read throws so the caller can treat it as no band.
import { supabase } from '@/src/network/auth/supabase';
import { bandForDay, type MoodBand, type MoodRow } from '../domain/mood';

const pad = (n: number): string => String(n).padStart(2, '0');

const READ_TIMEOUT_MS = 4000;

/** A hung read resolves to no band so the saved card still shows. */
export function readBandToday(userId: string, now: Date): Promise<MoodBand | null> {
  const timeout = new Promise<null>((resolve) => setTimeout(() => resolve(null), READ_TIMEOUT_MS));
  return Promise.race([queryBand(userId, now), timeout]);
}

async function queryBand(userId: string, now: Date): Promise<MoodBand | null> {
  const today = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  // a day either side: timestamps are UTC and are re-bucketed to the local day in the domain
  const from = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1).toISOString();
  const to = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2).toISOString();
  const { data, error } = await supabase
    .from('moods')
    .select('mood_score,input_method,selected_date')
    .eq('user_id', userId)
    .gte('selected_date', from)
    .lte('selected_date', to);
  if (error) throw error;
  return bandForDay((data ?? []) as MoodRow[], today);
}
