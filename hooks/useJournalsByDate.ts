import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import type { FeelingsType } from '@/network/genAi';

export interface JournalEntryRow {
  id: string;
  user_id: string;
  date: string; // YYYY-MM-DD
  title: string;
  content: string;
  ai_insights: string;
  mood_score: number | null;
  main_emoji: string | null;
  selected_emoji: string;
  feelings: FeelingsType[];
  suggested_tags: string[];
  growth_areas: string[];
  positive_insights: string[];
  transcripts: string[] | null;
  created_at: string;
}

const formatDateKey = (date: Date): string => {
  const tz: number = date.getTimezoneOffset() * 60000;
  const local = new Date(date.getTime() - tz);
  return local.toISOString().slice(0, 10);
};

export const useJournalsByDate = (date: Date | null) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [entries, setEntries] = useState<JournalEntryRow[]>([]);

  const dateKey = useMemo<string | null>(() => (date ? formatDateKey(date) : null), [date]);

  const fetchEntries = useCallback(async (): Promise<void> => {
    if (!user?.id || !dateKey) return;
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', dateKey)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEntries((data as JournalEntryRow[]) ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [user?.id, dateKey]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  return { entries, loading, error, refresh: fetchEntries, dateKey } as const;
};
