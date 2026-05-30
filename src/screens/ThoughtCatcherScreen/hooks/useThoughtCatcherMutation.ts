import { useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/src/network/auth/supabase';
import { useAuth } from '@/src/context/AuthContext';
import { formateDate_y_m_d } from '@/src/utils/date';
import type { ThoughtCatcherFormState, ThoughtCheckerFormState, ThoughtCatcherEntry } from '../types';

interface SaveCatcherParams {
  formState: ThoughtCatcherFormState;
  selectedDate?: Date;
}

interface SaveCheckerParams {
  id: string; // The ID of the ThoughtCatcherEntry we are updating
  formState: ThoughtCheckerFormState;
}

export const useThoughtCatcherMutation = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const catcherMutation = useMutation<ThoughtCatcherEntry | null, Error, SaveCatcherParams>({
    mutationFn: async ({ formState, selectedDate }) => {
      if (!user?.id) throw new Error('User not authenticated');

      const dateStr = formateDate_y_m_d(selectedDate ?? new Date());

      const { data, error } = await supabase
        .from('thought_catcher_entries')
        .insert({
          user_id: user.id,
          situation: formState.situation.trim(),
          automatic_thought: formState.automaticThought.trim(),
          intensity: formState.intensity,
          status: 'catcher_completed',
          selected_date: dateStr,
        })
        .select()
        .single();

      if (error) throw error;
      return data as unknown as ThoughtCatcherEntry;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['thought_catcher'] });
      queryClient.invalidateQueries({ queryKey: ['cbt_history'] });
    },
  });

  const checkerMutation = useMutation<ThoughtCatcherEntry | null, Error, SaveCheckerParams>({
    mutationFn: async ({ id, formState }) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('thought_catcher_entries')
        .update({
          is_true: formState.isTrue,
          balanced_thought: formState.balancedThought.trim(),
          status: 'checker_completed',
        })
        .eq('id', id)
        .eq('user_id', user.id) // Ensure security
        .select()
        .single();

      if (error) throw error;
      return data as unknown as ThoughtCatcherEntry;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['thought_catcher'] });
      queryClient.invalidateQueries({ queryKey: ['cbt_history'] });
    },
  });

  return {
    saveCatcher: useCallback(
      (params: SaveCatcherParams) => catcherMutation.mutateAsync(params),
      [catcherMutation]
    ),
    isSavingCatcher: catcherMutation.isPending,
    saveChecker: useCallback(
      (params: SaveCheckerParams) => checkerMutation.mutateAsync(params),
      [checkerMutation]
    ),
    isSavingChecker: checkerMutation.isPending,
  };
};
