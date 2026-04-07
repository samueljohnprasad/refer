/**
 * Multi-Journey Enrollment Types
 * Types for managing multiple journey enrollments with active journey switching.
 */

// ---------------------------------------------------------------------------
// Enrollment Status
// ---------------------------------------------------------------------------

/** Possible enrollment statuses for a journey */
export type EnrollmentStatus = 'active' | 'completed' | 'paused' | 'abandoned';

// ---------------------------------------------------------------------------
// Enrollment Record
// ---------------------------------------------------------------------------

/**
 * A single journey enrollment with progress metadata.
 * Used in the journey switcher bottom sheet and state management.
 */
export interface JourneyEnrollment {
    /** Journey template ID (UUID) */
    journeyId: string;
    /** Journey slug for routing */
    slug: string;
    /** Human-readable title */
    title: string;
    /** Journey description */
    description: string;
    /** Enrollment status */
    status: EnrollmentStatus;
    /** Number of completed nodes */
    completedNodes: number;
    /** Total nodes in the journey */
    totalNodes: number;
    /** Progress percentage (0–100) */
    progressPercent: number;
    /** Current unit/section title the user is on */
    currentUnitTitle: string | null;
    /** Color scheme for visual theming */
    colorScheme: string;
    /** Category for filtering */
    category: string;
    /** Difficulty level */
    difficulty: string;
    /** Icon URL for display */
    iconUrl: string | null;
    /** Color theme key */
    colorThemeKey: string | null;
    /** Icon key for map display */
    iconKey: string | null;
    /** Enrollment timestamp */
    enrolledAt: string;
    /** Whether this enrollment is archived/hidden by the user */
    isArchived: boolean;
}

// ---------------------------------------------------------------------------
// Multi-Journey State
// ---------------------------------------------------------------------------

/**
 * Global multi-journey state shape.
 * Stored in Jotai atom with AsyncStorage persistence.
 */
export interface MultiJourneyState {
    /** Slug of the currently active journey (shown on map) */
    activeJourneySlug: string | null;
    /** All user enrollments (ordered by most recent activity) */
    enrollments: JourneyEnrollment[];
}

// ---------------------------------------------------------------------------
// Switcher Item (presentation-only)
// ---------------------------------------------------------------------------

/**
 * Lightweight item used by the Journey Switcher bottom sheet.
 * Derived from JourneyEnrollment but only contains display fields.
 */
export interface JourneySwitcherItem {
    /** Journey slug */
    slug: string;
    /** Journey title */
    title: string;
    /** Progress percentage (0–100) */
    progressPercent: number;
    /** Current unit title */
    currentUnitTitle: string | null;
    /** Color scheme */
    colorScheme: string;
    /** Whether this is the active journey */
    isActive: boolean;
    /** Icon URL */
    iconUrl: string | null;
    /** Enrollment status */
    status: EnrollmentStatus;
}
