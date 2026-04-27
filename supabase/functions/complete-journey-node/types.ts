// ---------------------------------------------------------------------------
// Payload
// ---------------------------------------------------------------------------

/** Request body sent by the client */
export interface CompleteJourneyNodePayload {
  enrollmentId?: string;
  nodeId?: string;
}

// ---------------------------------------------------------------------------
// Reward types
// ---------------------------------------------------------------------------

/** Single reward entry stored in a node's `rewards` column */
export interface Reward {
  type?: string;
  amount?: number;
}

/** Parsed, aggregated reward totals */
export interface ParsedRewards {
  xp: number;
  gems: number;
  hearts: number;
}

// ---------------------------------------------------------------------------
// DB row shapes (mirrors Supabase tables — kept minimal to what the function
// actually reads; extend as columns are added)
// ---------------------------------------------------------------------------

export interface EnrollmentRow {
  id: string;
  user_id: string;
  journey_id: string;
  status: "active" | "completed" | "paused";
  current_section_id: string | null;
  current_unit_id: string | null;
  current_section_number: number | null;
  current_section_unit_number: number | null;
  current_unit_number: number | null;
  completed_at: string | null;
}

export interface NodeRow {
  id: string;
  unit_id: string;
  node_index: number;
  rewards: unknown;
  [key: string]: unknown;
}

export interface UnitRow {
  id: string;
  section_id: string;
  unit_number: number;
  section_unit_number: number;
  [key: string]: unknown;
}

export interface SectionRow {
  id: string;
  journey_id: string;
  section_number: number;
  [key: string]: unknown;
}

export interface NodeProgressRow {
  id: string;
  user_id: string;
  enrollment_id: string;
  node_id: string;
  status: "active" | "completed";
  progress: number;
  completed_at: string | null;
}

// ---------------------------------------------------------------------------
// Resolver result
// ---------------------------------------------------------------------------

/**
 * Outcome returned by `resolveNextProgress`.
 * Describes the new enrollment position after completing a node.
 */
export interface NextProgressResult {
  /** ID of the newly-activated node (null when the journey is completed) */
  currentNodeId: string | null;
  currentSectionNumber: number;
  currentUnitNumber: number;
  enrollmentStatus: EnrollmentRow["status"];
}

// ---------------------------------------------------------------------------
// HTTP response body
// ---------------------------------------------------------------------------

export interface NodeCompletionResponse {
  success: true;
  currentSectionNumber: number;
  currentUnitNumber: number;
  currentNodeId: string | null;
  enrollmentStatus: EnrollmentRow["status"];
  journeyCompleted: boolean;
  rewards: ParsedRewards;
}

export interface ErrorResponse {
  success: false;
  error: string;
}
