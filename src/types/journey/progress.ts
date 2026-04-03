/**
 * Journey User Progress Types
 * Per-user state for a specific journey enrollment.
 * Combined with JourneyTemplate via mergeJourneyState() to produce
 * the JourneyState shape the UI consumes.
 */

import type { NodeStatus } from './enums';

// ---------------------------------------------------------------------------
// Enrollment (user ↔ journey link)
// ---------------------------------------------------------------------------

/** A user's enrollment in a specific journey */
export interface UserJourneyEnrollment {
  /** UUID from DB */
  id: string;
  /** Which journey this enrollment is for */
  journeyId: string;
  /** Which unit the user is currently on (1-indexed) */
  currentUnitNumber: number;
  /** active | completed | abandoned */
  status: 'active' | 'completed' | 'abandoned';
  /** ISO timestamp of enrollment */
  enrolledAt: string;
  /** Template version at enrollment time */
  templateVersion: number;
}

// ---------------------------------------------------------------------------
// Per-node progress (sparse — locked nodes have NO row)
// ---------------------------------------------------------------------------

/** Progress record for a single node within an enrollment */
export interface UserNodeProgress {
  /** UUID of the template node this tracks */
  nodeId: string;
  /** completed | active (locked nodes are absent from the array) */
  status: NodeStatus.COMPLETED | NodeStatus.ACTIVE;
  /** 0.0–1.0 for the active node's progress ring */
  progress: number;
  /** Whether the user has claimed the node's rewards */
  rewardClaimed: boolean;
  /** ISO timestamp of completion, null if not completed */
  completedAt: string | null;
}

// ---------------------------------------------------------------------------
// Combined progress response
// ---------------------------------------------------------------------------

/** Full progress payload returned by get_user_journey_progress RPC */
export interface UserJourneyProgress {
  enrollment: UserJourneyEnrollment;
  nodeProgress: UserNodeProgress[];
}

// ---------------------------------------------------------------------------
// Complete-node response
// ---------------------------------------------------------------------------

/** Response from the complete_journey_node RPC */
export interface CompleteNodeResponse {
  success: boolean;
  error?: string;
  rewards?: {
    xp: number;
    gems: number;
    hearts: number;
  };
}
