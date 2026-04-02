/**
 * Journey API Client
 * Functions for fetching and updating journey state from the backend.
 * Uses Supabase as the networking layer (per tech stack rules).
 *
 * Currently returns mock data — swap implementation when backend is ready.
 * The interface stays the same so consumers don't need to change.
 */

import { MOCK_JOURNEY_STATE } from "@/src/data/journey";
import { JourneyState } from "@/src/types/journey/state";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface UpdateProgressPayload {
  nodeId: string;
  progress: number;
}

export interface CompleteNodePayload {
  nodeId: string;
}

export interface ClaimRewardPayload {
  nodeId: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

// ---------------------------------------------------------------------------
// API Functions (mock implementation — swap with Supabase calls)
// ---------------------------------------------------------------------------

/** Simulated network delay */
const MOCK_DELAY_MS = 300;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Fetch the full journey state for the current user.
 */
export async function fetchJourneyState(): Promise<ApiResponse<JourneyState>> {
  await delay(MOCK_DELAY_MS);

  // TODO: Replace with Supabase call
  // const { data, error } = await supabase.from('journey_state').select('*').single();
  return {
    data: MOCK_JOURNEY_STATE,
    success: true,
  };
}

/**
 * Update progress on a specific node.
 */
export async function updateProgress(
  payload: UpdateProgressPayload,
): Promise<ApiResponse<{ nodeId: string; progress: number }>> {
  await delay(MOCK_DELAY_MS);

  // TODO: Replace with Supabase call
  return {
    data: { nodeId: payload.nodeId, progress: payload.progress },
    success: true,
  };
}

/**
 * Mark a node as completed on the server.
 */
export async function completeNodeApi(
  payload: CompleteNodePayload,
): Promise<ApiResponse<{ nodeId: string; completed: boolean }>> {
  await delay(MOCK_DELAY_MS);

  // TODO: Replace with Supabase call
  return {
    data: { nodeId: payload.nodeId, completed: true },
    success: true,
  };
}

/**
 * Claim reward from a completed node.
 */
export async function claimNodeReward(
  payload: ClaimRewardPayload,
): Promise<ApiResponse<{ nodeId: string; claimed: boolean }>> {
  await delay(MOCK_DELAY_MS);

  // TODO: Replace with Supabase call
  return {
    data: { nodeId: payload.nodeId, claimed: true },
    success: true,
  };
}
