/**
 * useJourneyQuery
 * TanStack Query hooks for journey state — fetch, mutate, cache.
 * Provides optimistic updates and automatic rollback on failure.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSetAtom } from "jotai";

import type { JourneyState } from "@/src/types/journey";
import { journeyStateAtom } from "@/src/store/journeyStore";
import { completeNode, updateNodeProgress } from "@/src/store/journeyActions";
import {
  fetchJourneyState,
  updateProgress as updateProgressApi,
  completeNodeApi,
  claimNodeReward,
} from "@/src/lib/api/journeyApi";
import type {
  UpdateProgressPayload,
  CompleteNodePayload,
  ClaimRewardPayload,
} from "@/src/lib/api/journeyApi";

// ---------------------------------------------------------------------------
// Query keys
// ---------------------------------------------------------------------------

export const JOURNEY_QUERY_KEYS = {
  state: ["journey", "state"] as const,
} as const;

// ---------------------------------------------------------------------------
// Fetch hook
// ---------------------------------------------------------------------------

/**
 * Fetch journey state from the API.
 * Syncs the result into the Jotai atom so the whole app stays consistent.
 */
export function useJourneyState() {
  const setJourneyState = useSetAtom(journeyStateAtom);

  return useQuery({
    queryKey: JOURNEY_QUERY_KEYS.state,
    queryFn: async (): Promise<JourneyState> => {
      const response = await fetchJourneyState();
      if (!response.success)
        throw new Error(response.error ?? "Failed to fetch");
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes cache
    select: (data: JourneyState): JourneyState => {
      // Sync to Jotai atom whenever fresh data arrives
      setJourneyState(data);
      return data;
    },
  });
}

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
    mutationFn: (payload: UpdateProgressPayload) => updateProgressApi(payload),

    onMutate: async (payload: UpdateProgressPayload) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: JOURNEY_QUERY_KEYS.state });

      // Snapshot previous state
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
      // Rollback to snapshot
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
 * Optimistically mark a node as completed.
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

/**
 * Claim reward from a completed node.
 */
export function useClaimReward() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ClaimRewardPayload) => claimNodeReward(payload),

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: JOURNEY_QUERY_KEYS.state });
    },
  });
}
