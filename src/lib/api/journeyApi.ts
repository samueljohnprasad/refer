/**
 * Journey API Client
 * Functions for fetching and updating journey state from Supabase.
 *
 * Two data flows:
 * 1. Read: fetch template + progress → merge on client → JourneyState
 * 2. Write: complete_journey_node RPC → refetch progress → re-merge
 *
 * Falls back to mock data when Supabase calls fail (dev/offline).
 */

import { supabase } from '@/src/network/auth/supabase';
import { MOCK_JOURNEY_STATE } from '@/src/data/journey';
import type { JourneyState } from '@/src/types/journey/state';
import type {
  JourneyTemplate,
  JourneyListItem,
} from '@/src/types/journey/template';
import type {
  UserJourneyProgress,
  CompleteNodeResponse,
} from '@/src/types/journey/progress';

// ---------------------------------------------------------------------------
// Response wrapper
// ---------------------------------------------------------------------------

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

// ---------------------------------------------------------------------------
// Payload types
// ---------------------------------------------------------------------------

export interface UpdateProgressPayload {
  enrollmentId: string;
  nodeId: string;
  progress: number;
}

export interface CompleteNodePayload {
  enrollmentId: string;
  nodeId: string;
}

export interface EnrollPayload {
  journeyId: string;
  templateVersion: number;
  firstNodeId: string;
}

// ---------------------------------------------------------------------------
// Template API
// ---------------------------------------------------------------------------

/**
 * Fetch the full journey template by slug.
 * Templates are authored once and shared across all users — cache aggressively.
 */
export async function fetchJourneyTemplate(
  slug: string,
): Promise<ApiResponse<JourneyTemplate | null>> {
  try {
    const { data, error } = await supabase.rpc('get_journey_template', {
      p_slug: slug,
    });

    if (error) {
      console.error('[JourneyAPI] fetchJourneyTemplate error:', error.message);
      return { data: null, success: false, error: error.message };
    }

    return { data: data as unknown as JourneyTemplate, success: true };
  } catch (err) {
    console.error('[JourneyAPI] fetchJourneyTemplate exception:', err);
    return {
      data: null,
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

// ---------------------------------------------------------------------------
// Progress API
// ---------------------------------------------------------------------------

/**
 * Fetch the user's enrollment + node progress for a specific journey.
 * Returns null if the user is not enrolled.
 */
export async function fetchUserProgress(
  journeyId: string,
): Promise<ApiResponse<UserJourneyProgress | null>> {
  try {
    const { data, error } = await supabase.rpc('get_user_journey_progress', {
      p_journey_id: journeyId,
    });

    if (error) {
      console.error('[JourneyAPI] fetchUserProgress error:', error.message);
      return { data: null, success: false, error: error.message };
    }

    // RPC returns null if no active enrollment exists
    if (!data) {
      return { data: null, success: true };
    }

    return { data: data as unknown as UserJourneyProgress, success: true };
  } catch (err) {
    console.error('[JourneyAPI] fetchUserProgress exception:', err);
    return {
      data: null,
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

/**
 * Update the progress float (0–1) of the active node.
 * Used for the progress ring animation as the user works through a task.
 */
export async function updateNodeProgress(
  payload: UpdateProgressPayload,
): Promise<ApiResponse<{ nodeId: string; progress: number }>> {
  try {
    const { error } = await supabase
      .from('user_node_progress')
      .update({
        progress: payload.progress,
      })
      .eq('enrollment_id', payload.enrollmentId)
      .eq('node_id', payload.nodeId);

    if (error) {
      console.error('[JourneyAPI] updateNodeProgress error:', error.message);
      return {
        data: { nodeId: payload.nodeId, progress: payload.progress },
        success: false,
        error: error.message,
      };
    }

    return {
      data: { nodeId: payload.nodeId, progress: payload.progress },
      success: true,
    };
  } catch (err) {
    console.error('[JourneyAPI] updateNodeProgress exception:', err);
    return {
      data: { nodeId: payload.nodeId, progress: payload.progress },
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

/**
 * Atomically complete a node via server-side RPC.
 * Validates the node is active, marks it completed, unlocks the next,
 * and grants XP/gems rewards — all in one transaction.
 */
export async function completeNodeApi(
  payload: CompleteNodePayload,
): Promise<ApiResponse<CompleteNodeResponse>> {
  try {
    const { data, error } = await supabase.rpc('complete_journey_node', {
      p_enrollment_id: payload.enrollmentId,
      p_node_id: payload.nodeId,
    });

    if (error) {
      console.error('[JourneyAPI] completeNodeApi error:', error.message);
      return {
        data: { success: false, error: error.message },
        success: false,
        error: error.message,
      };
    }

    return {
      data: data as unknown as CompleteNodeResponse,
      success: true,
    };
  } catch (err) {
    console.error('[JourneyAPI] completeNodeApi exception:', err);
    return {
      data: {
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error',
      },
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

// ---------------------------------------------------------------------------
// Enrollment API
// ---------------------------------------------------------------------------

/**
 * Enroll the current user in a journey.
 * Creates the enrollment row and the first node's active progress row.
 */
export async function enrollInJourney(
  payload: EnrollPayload,
): Promise<ApiResponse<UserJourneyProgress | null>> {
  try {
    const userId: string | undefined = (await supabase.auth.getUser()).data.user?.id;
    if (!userId) {
      return { data: null, success: false, error: 'Not authenticated' };
    }

    // Insert enrollment
    const { data: enrollment, error: enrollError } = await supabase
      .from('user_journey_enrollments')
      .insert({
        user_id: userId,
        journey_id: payload.journeyId,
        template_version: payload.templateVersion,
        current_unit_number: 1,
        status: 'active',
      })
      .select()
      .single();

    if (enrollError) {
      console.error('[JourneyAPI] enrollInJourney error:', enrollError.message);
      return { data: null, success: false, error: enrollError.message };
    }

    // Insert first node as active
    const { error: nodeError } = await supabase
      .from('user_node_progress')
      .insert({
        user_id: userId,
        enrollment_id: enrollment.id,
        node_id: payload.firstNodeId,
        status: 'active',
        progress: 0.0,
      });

    if (nodeError) {
      console.error('[JourneyAPI] enrollInJourney node error:', nodeError.message);
    }

    // Re-fetch the full progress to return a clean state
    return fetchUserProgress(payload.journeyId);
  } catch (err) {
    console.error('[JourneyAPI] enrollInJourney exception:', err);
    return {
      data: null,
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

// ---------------------------------------------------------------------------
// Catalog API
// ---------------------------------------------------------------------------

/**
 * Fetch all active journeys with the current user's enrollment summary.
 * Used by the journey picker screen.
 */
export async function fetchJourneyCatalog(): Promise<
  ApiResponse<JourneyListItem[]>
> {
  try {
    const { data, error } = await supabase.rpc('get_journey_catalog');

    if (error) {
      console.error('[JourneyAPI] fetchJourneyCatalog error:', error.message);
      return { data: [], success: false, error: error.message };
    }

    return {
      data: (data as unknown as JourneyListItem[]) ?? [],
      success: true,
    };
  } catch (err) {
    console.error('[JourneyAPI] fetchJourneyCatalog exception:', err);
    return {
      data: [],
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

// ---------------------------------------------------------------------------
// Legacy fallback (kept for offline / dev mode)
// ---------------------------------------------------------------------------

/**
 * Fetch the full journey state using mock data.
 * @deprecated Use fetchJourneyTemplate + fetchUserProgress + mergeJourneyState instead.
 */
export async function fetchJourneyStateLegacy(): Promise<
  ApiResponse<JourneyState>
> {
  return {
    data: MOCK_JOURNEY_STATE,
    success: true,
  };
}
