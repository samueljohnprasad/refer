import { useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/src/network/auth/supabase';
import { useAuth } from '@/src/context/AuthContext';
import { formateDate_y_m_d } from '@/src/utils/date';
import type { GratitudeFormState, GratitudeEntry } from '../types';

// ─── Types ───────────────────────────────────────────────────────────

interface SaveParams {
  id?: string;
  formState: GratitudeFormState;
  status?: string;
  completed?: boolean;
  selectedDate?: Date;
}

interface UseGratitudeMutationReturn {
  saveEntry: (params: SaveParams) => Promise<GratitudeEntry | null>;
  isSaving: boolean;
  saveError: Error | null;
}

// ─── Hook ────────────────────────────────────────────────────────────

export const useGratitudeMutation = (): UseGratitudeMutationReturn => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const mutation = useMutation<GratitudeEntry | null, Error, SaveParams>({
    mutationFn: async ({
      id,
      formState,
      status,
      completed,
      selectedDate,
    }: SaveParams): Promise<GratitudeEntry | null> => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      const dateStr: string = formateDate_y_m_d(selectedDate ?? new Date());

      const { data, error } = await supabase
        .from('gratitude_entries' as never)
        .upsert({
          id: id || undefined,
          user_id: user.id,
          current_mood: formState.currentMood,
          initial_intensity: formState.moodIntensity,
          final_intensity: formState.finalMoodIntensity,
          selected_prompt: formState.selectedPrompt.trim(),
          gratitude_entries: formState.gratitudeEntries.filter(
            (e) => e.trim().length > 0
          ),
          completed: completed ?? false,
          status: status || 'started',
          selected_date: dateStr,
        } as never)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data as unknown as GratitudeEntry;
    },
    onSuccess: (): void => {
      queryClient.invalidateQueries({ queryKey: ['gratitude'] });
    },
  });

  const saveEntry = useCallback(
    async (params: SaveParams): Promise<GratitudeEntry | null> => {
      return mutation.mutateAsync(params);
    },
    [mutation]
  );

  return {
    saveEntry,
    isSaving: mutation.isPending,
    saveError: mutation.error,
  };
};
