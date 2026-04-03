/**
 * useJourneyQuery
 * TanStack Query hooks for journey mutations — complete node, update progress.
 * Provides optimistic updates and automatic rollback on failure.
 *
 * NOTE: Journey state loading is now handled by useJourneyData (Jotai-based).
 * This file only exposes mutation hooks used for write operations.
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSetAtom } from "jotai";

import type { JourneyState } from "@/src/types/journey";
import { journeyStateAtom } from "@/src/store/journeyStore";
import { completeNode, updateNodeProgress } from "@/src/store/journeyActions";
import {
  completeNodeApi,
  updateNodeProgress as updateNodeProgressApi,
} from "@/src/lib/api/journeyApi";
import type {
  UpdateProgressPayload,
  CompleteNodePayload,
} from "@/src/lib/api/journeyApi";

// ---------------------------------------------------------------------------
// Query keys (kept for cache invalidation)
// ---------------------------------------------------------------------------

export const JOURNEY_QUERY_KEYS = {
  state: ["journey", "state"] as const,
} as const;

// ---------------------------------------------------------------------------
// Mutation hooks with optimistic updates
// ---------------------------------------------------------------------------

/**
 * Optimistically update node progress.
 * UI updates immediately; rolls back if server rejects.
 */
export function useUpdateProgress() {
  const queryClient = useQueryClient();
  const setJourneyState = useSetAtom(journeyStateAtom);

  return useMutation({
    mutationFn: (payload: UpdateProgressPayload) =>
      updateNodeProgressApi(payload),

    onMutate: async (payload: UpdateProgressPayload) => {
      await queryClient.cancelQueries({ queryKey: JOURNEY_QUERY_KEYS.state });
      const previous = queryClient.getQueryData<JourneyState>(
        JOURNEY_QUERY_KEYS.state,
      );

      // Optimistically update Jotai atom
      setJourneyState((prev: JourneyState) =>
        updateNodeProgress(prev, payload.nodeId, payload.progress),
      );

      return { previous };
    },

    onError: (_err, _payload, context) => {
      if (context?.previous) {
        setJourneyState(context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: JOURNEY_QUERY_KEYS.state });
    },
  });
}

/**
 * Optimistically mark a node as completed via the server RPC.
 */
export function useCompleteNode() {
  const queryClient = useQueryClient();
  const setJourneyState = useSetAtom(journeyStateAtom);

  return useMutation({
    mutationFn: (payload: CompleteNodePayload) => completeNodeApi(payload),

    onMutate: async (payload: CompleteNodePayload) => {
      await queryClient.cancelQueries({ queryKey: JOURNEY_QUERY_KEYS.state });
      const previous = queryClient.getQueryData<JourneyState>(
        JOURNEY_QUERY_KEYS.state,
      );

      // Optimistic local update
      setJourneyState((prev: JourneyState) =>
        completeNode(prev, payload.nodeId),
      );

      return { previous };
    },

    onError: (_err, _payload, context) => {
      if (context?.previous) {
        setJourneyState(context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: JOURNEY_QUERY_KEYS.state });
    },
  });
}
