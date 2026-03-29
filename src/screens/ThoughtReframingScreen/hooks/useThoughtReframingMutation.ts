import { useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/src/network/auth/supabase';
import { useAuth } from '@/src/context/AuthContext';
import { formateDate_y_m_d } from '@/src/utils/date';
import type { ThoughtReframingFormState, ThoughtReframingEntry } from '../types';

interface SaveParams {
  id?: string;
  formState: ThoughtReframingFormState;
  status?: string;
  completed?: boolean;
  selectedDate?: Date;
}

interface UseMutationReturn {
  saveEntry: (params: SaveParams) => Promise<ThoughtReframingEntry | null>;
  isSaving: boolean;
  saveError: Error | null;
}

export const useThoughtReframingMutation = (): UseMutationReturn => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const mutation = useMutation<ThoughtReframingEntry | null, Error, SaveParams>({
    mutationFn: async ({ id, formState, status, completed, selectedDate }: SaveParams): Promise<ThoughtReframingEntry | null> => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      const dateStr: string = formateDate_y_m_d(selectedDate ?? new Date());

      const { data, error } = await supabase
        .from('thought_reframing_entries' as any)
        .upsert({
          id: id || undefined,
          user_id: user.id,
          situation: formState.situation.trim(),
          automatic_thought: formState.automaticThought.trim(),
          emotions: formState.selectedEmotions,
          cognitive_distortions: formState.selectedDistortions,
          evidence_for: formState.evidenceFor,
          evidence_against: formState.evidenceAgainst,
          balanced_thought: formState.balancedThought.trim(),
          completed: completed ?? false,
          status: status || 'started',
          selected_date: dateStr,
        } as any)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data as any as ThoughtReframingEntry;
    },
    onSuccess: (): void => {
      // Invalidate any cached thought reframing queries
      queryClient.invalidateQueries({ queryKey: ['thought_reframing'] });
      queryClient.invalidateQueries({ queryKey: ['cbt_history'] });
    },
  });

  const saveEntry = useCallback(
    async (params: SaveParams): Promise<ThoughtReframingEntry | null> => {
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
