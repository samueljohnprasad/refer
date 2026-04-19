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

import { supabase } from "@/src/network/auth/supabase";
import type { JourneyState } from "@/src/types/journey/state";
import type {
  JourneyTemplate,
  JourneyListItem,
} from "@/src/types/journey/template";
import type {
  UserJourneyProgress,
  CompleteNodeResponse,
} from "@/src/types/journey/progress";
import type {
  SectionMapResponse,
  NodeContentResponse,
  SectionViewMode,
} from "@/src/types/journey/sectionMap";
import { createLogger } from "@/src/lib/logger";

const log = createLogger("JourneyAPI");
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;

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

export interface ReplayCompletedNodePayload {
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
    const { data, error } = await supabase.rpc("get_journey_template", {
      p_slug: slug,
    });

    if (error) {
      log.error("fetchJourneyTemplate RPC error", error.message);
      return { data: null, success: false, error: error.message };
    }

    return { data: data as unknown as JourneyTemplate, success: true };
  } catch (err) {
    log.error("fetchJourneyTemplate exception", err);
    return {
      data: null,
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
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
    const { data, error } = await supabase.rpc("get_user_journey_progress", {
      p_journey_id: journeyId,
    });

    if (error) {
      log.error("fetchUserProgress RPC error", error.message);
      return { data: null, success: false, error: error.message };
    }

    // RPC returns null if no active enrollment exists
    if (!data) {
      return { data: null, success: true };
    }

    return { data: data as unknown as UserJourneyProgress, success: true };
  } catch (err) {
    log.error("fetchUserProgress exception", err);
    return {
      data: null,
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
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
      .from("user_node_progress")
      .update({
        progress: payload.progress,
      })
      .eq("enrollment_id", payload.enrollmentId)
      .eq("node_id", payload.nodeId);

    if (error) {
      log.error("updateNodeProgress mutation error", error.message);
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
    log.error("updateNodeProgress exception", err);
    return {
      data: { nodeId: payload.nodeId, progress: payload.progress },
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
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
    const { data, error } = await supabase.rpc("complete_journey_node", {
      p_enrollment_id: payload.enrollmentId,
      p_node_id: payload.nodeId,
    });

    if (error) {
      log.error("completeNodeApi RPC error", error.message);
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
    log.error("completeNodeApi exception", err);
    return {
      data: {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error",
      },
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

export async function replayCompletedNodeApi(
  payload: ReplayCompletedNodePayload,
): Promise<ApiResponse<CompleteNodeResponse>> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase.rpc as any)(
      "replay_completed_journey_node",
      {
        p_enrollment_id: payload.enrollmentId,
        p_node_id: payload.nodeId,
      },
    );

    if (error) {
      log.error("replayCompletedNodeApi RPC error", error.message);
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
    log.error("replayCompletedNodeApi exception", err);
    return {
      data: {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error",
      },
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
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
    const userId: string | undefined = (await supabase.auth.getUser()).data.user
      ?.id;
    if (!userId) {
      return { data: null, success: false, error: "Not authenticated" };
    }

    const { data: firstNode, error: firstNodeError } = await db
      .from("journey_template_nodes")
      .select("unit_id")
      .eq("id", payload.firstNodeId)
      .single();

    if (firstNodeError || !firstNode?.unit_id) {
      log.error(
        "enrollInJourney first node lookup error",
        firstNodeError?.message,
      );
      return {
        data: null,
        success: false,
        error: firstNodeError?.message ?? "First node not found",
      };
    }

    const { data: firstUnit, error: firstUnitError } = await db
      .from("journey_template_units")
      .select("id, unit_number, section_id, section_unit_number")
      .eq("id", firstNode.unit_id)
      .single();

    if (firstUnitError || !firstUnit?.id) {
      log.error(
        "enrollInJourney first unit lookup error",
        firstUnitError?.message,
      );
      return {
        data: null,
        success: false,
        error: firstUnitError?.message ?? "First unit not found",
      };
    }

    const { data: firstSection, error: firstSectionError } = await db
      .from("journey_template_sections")
      .select("id, section_number")
      .eq("id", firstUnit.section_id)
      .single();

    if (firstSectionError || !firstSection?.id) {
      log.error(
        "enrollInJourney first section lookup error",
        firstSectionError?.message,
      );
      return {
        data: null,
        success: false,
        error: firstSectionError?.message ?? "First section not found",
      };
    }

    // Insert enrollment
    const { data: enrollment, error: enrollError } = await supabase
      .from("user_journey_enrollments")
      .insert({
        user_id: userId,
        journey_id: payload.journeyId,
        template_version: payload.templateVersion,
        current_unit_number: firstUnit.unit_number,
        current_section_id: firstSection.id,
        current_unit_id: firstUnit.id,
        current_section_number: firstSection.section_number,
        current_section_unit_number: firstUnit.section_unit_number,
        status: "active",
      })
      .select()
      .single();

    if (enrollError) {
      log.error("enrollInJourney insert error", enrollError.message);
      return { data: null, success: false, error: enrollError.message };
    }

    // Insert first node as active
    const { error: nodeError } = await supabase
      .from("user_node_progress")
      .insert({
        user_id: userId,
        enrollment_id: enrollment.id,
        node_id: payload.firstNodeId,
        status: "active",
        progress: 0.0,
      });

    if (nodeError) {
      log.error("enrollInJourney first node insert error", nodeError.message);
    }

    // Re-fetch the full progress to return a clean state
    return fetchUserProgress(payload.journeyId);
  } catch (err) {
    log.error("enrollInJourney exception", err);
    return {
      data: null,
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
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
    const { data, error } = await supabase.rpc("get_journey_catalog");

    if (error) {
      log.error("fetchJourneyCatalog RPC error", error.message);
      return { data: [], success: false, error: error.message };
    }

    return {
      data: (data as unknown as JourneyListItem[]) ?? [],
      success: true,
    };
  } catch (err) {
    log.error("fetchJourneyCatalog exception", err);
    return {
      data: [],
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

// ---------------------------------------------------------------------------
// Section Map API (lazy-loaded section architecture)
// ---------------------------------------------------------------------------

/**
 * Fetch a single section's node stubs + user progress.
 * Content JSONB is excluded — fetched on-demand via fetchNodeContent.
 *
 * @param slug - Journey slug (e.g. 'anxiety-toolkit')
 * @param unitNumber - Section number to fetch; undefined = user's current
 */
export async function fetchSectionMap(
  slug: string,
  unitNumber?: number,
): Promise<ApiResponse<SectionMapResponse | null>> {
  try {
    const params: {
      p_slug: string;
      p_unit_number?: number;
      p_view_mode?: SectionViewMode;
    } = {
      p_slug: slug,
    };
    if (unitNumber !== undefined) {
      params.p_unit_number = unitNumber;
    }

    params.p_view_mode = 'active';


    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let query = (supabase.rpc as any)("get_section_map", params);
    const { data, error } = await query;

    if (error) {
      log.error("fetchSectionMap RPC error", error.message, {
        slug,
        unitNumber,
      });
      return { data: null, success: false, error: error.message };
    }

    if (!data) {
      return { data: null, success: true };
    }

    return { data: data as unknown as SectionMapResponse, success: true };
  } catch (err: unknown) {
    log.error("fetchSectionMap exception", err, { slug, unitNumber });
    return {
      data: null,
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

/**
 * Fetch the full content JSONB for a single node.
 * Called on-demand when user taps a node to start or review it.
 *
 * @param nodeId - UUID of the node to fetch content for
 */
export async function fetchNodeContent(
  nodeId: string,
): Promise<ApiResponse<NodeContentResponse | null>> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase.rpc as any)("get_node_content", {
      p_node_id: nodeId,
    });

    if (error) {
      log.error("fetchNodeContent RPC error", error.message, { nodeId });
      return { data: null, success: false, error: error.message };
    }

    if (!data) {
      return { data: null, success: true };
    }

    return { data: data as unknown as NodeContentResponse, success: true };
  } catch (err: unknown) {
    log.error("fetchNodeContent exception", err, { nodeId });
    return {
      data: null,
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

// ---------------------------------------------------------------------------
// Legacy fallback (kept for offline / dev mode)
// ---------------------------------------------------------------------------

/**
 * Fetch the full journey state using mock data.
 * @deprecated Use fetchJourneyTemplate + fetchUserProgress + mergeJourneyState instead.
 * This function is no longer supported - mock data has been removed.
 */
export async function fetchJourneyStateLegacy(): Promise<
  ApiResponse<JourneyState>
> {
  return {
    data: null as any,
    success: false,
    error:
      "Legacy function deprecated - use fetchJourneyTemplate + fetchUserProgress instead",
  };
}
