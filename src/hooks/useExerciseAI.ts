/**
 * useExerciseAI — Structured AI Suggestions for Exercise Steps
 *
 * Consumes an exercise step's `AIStepConfig` (promptBuilder + responseSchema)
 * and generates structured suggestions using the centralized AI provider.
 *
 * Implements React Query for robust caching, aborting, and isolation.
 */

import { useRef, useMemo, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { uniqueId } from 'lodash-es';
import type { ExerciseStepDef, AISuggestionItem } from '@/src/types/exerciseFlow';
import { useActiveModel } from '@/src/hooks/useActiveModel';
import { createAIProvider } from '@/src/services/ai';

// ─── Interfaces ─────────────────────────────────────────────────────────────

export interface UseExerciseAIOptions<T> {
  readonly steps: ExerciseStepDef<T>[];
  readonly currentStepIndex: number;
  readonly response: T;
  readonly readOnly?: boolean;
}

export interface UseExerciseAIReturn {
  readonly suggestions: AISuggestionItem[];
  readonly isLoading: boolean;
  readonly error: string | null;
  readonly downloadProgress: number;
  readonly loadingMessage: string;
}

// ─── Hook ───────────────────────────────────────────────────────────────────

export function useExerciseAI<T extends Record<string, any>>({
  steps,
  currentStepIndex,
  response,
  readOnly,
}: UseExerciseAIOptions<T>): UseExerciseAIReturn {
  // Session isolation for caching. A new session ID is generated on mount.
  const sessionIdRef = useRef<string>(uniqueId('exercise-'));
  const sessionSeedRef = useRef<number>(Math.random());

  const currentStep = steps[currentStepIndex];
  const aiConfig = currentStep?.ai;

  const { getActiveModel, providerType, downloadProgress } = useActiveModel();

  // Generate deterministic prompt based on the *current* response state.
  // If the user modifies an input that the prompt depends on, `prompt` will change.
  const prompt = useMemo(() => {
    if (!aiConfig || readOnly) return '';
    try {
      return aiConfig.promptBuilder(response, { seed: sessionSeedRef.current });
    } catch (e) {
      console.warn("Exercise AI prompt builder failed:", e);
      return '';
    }
  }, [aiConfig, response, readOnly]);

  const queryKey = ['exercise-ai', sessionIdRef.current, currentStep?.id, prompt];

  const { data, isLoading, error } = useQuery({
    queryKey,
    queryFn: async ({ signal }) => {
      if (!aiConfig || !prompt.trim()) return [];

      const activeModel = await getActiveModel();
      const provider = createAIProvider(providerType);

      const items = await provider.generateStructured({
        model: activeModel,
        prompt,
        responseSchema: aiConfig.responseSchema,
        maxResults: aiConfig.maxResults ?? 5,
        abortSignal: signal,
      });

      return items as AISuggestionItem[];
    },
    enabled: !!aiConfig && !readOnly && !!prompt.trim(),
    staleTime: Infinity,
    gcTime: Infinity,
  });

  // Query Client cleanup
  const queryClient = useQueryClient();
  useEffect(() => {
    const sid = sessionIdRef.current;
    return () => {
      // Remove all queries associated with this specific exercise session on unmount
      queryClient.removeQueries({ queryKey: ['exercise-ai', sid] });
    };
  }, [queryClient]);

  return {
    suggestions: data || [],
    isLoading,
    error: error instanceof Error ? error.message : null,
    downloadProgress,
    loadingMessage: aiConfig?.aiLoadingMessage || "Sage is thinking...",
  };
}
