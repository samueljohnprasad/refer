// types/journeyV5.ts
// Single source of truth for all Journey Map v5 TypeScript types.
// Imported by: journeySlice, journeySelectors, journeyApi, all hooks, all content components.
// DO NOT define journey types anywhere else.

// ── Status types ────────────────────────────────────────────────────────────

/** All possible statuses a node can have. 'locked' is client-only — never stored in DB. */
export type NodeStatus = "locked" | "in_progress" | "attempted" | "completed";

/**
 * Visual status used by the journey map renderer.
 * Collapses the 4-state NodeStatus down to 3 visual states:
 *   locked     → node is inaccessible (locked icon)
 *   active     → node is accessible but not yet complete (star/checkpoint icon)
 *   completed  → node is done (checkmark icon)
 */
export type NodeVisualStatus = "locked" | "active" | "completed";

/** Status for units and sections — no 'attempted' state at this level. */
export type DerivedStatus = "locked" | "in_progress" | "completed";

/** Course-level progression status — stored in user_course_progress. */
export type CourseStatus = "in_progress" | "completed";

/** Node content types. Determines which content table and renderer component to use. */
export type NodeType =
  | "lesson"
  | "story"
  | "quiz"
  | "exercise"
  | "practice"
  | "challenge"
  | "boss"
  | "mood_check"
  | "journal"
  | "checkpoint"
  | "chest"
  | "ai_insight";

// ── Entity types (mirrors DB schema, camelCase) ──────────────────────────────

export interface Course {
  /** UUID primary key */
  id: string;
  title: string;
  description: string;
  /** URL to course icon image */
  iconUrl: string;
  /** Hex colour without # prefix, e.g. '4A90D9' */
  colorHex: string;
  /** Sort order within the course list */
  orderIndex: number;
  /** Only published courses are served by get-course-tree */
  isPublished: boolean;
}

export interface EnrolledCourseListItem {
  id: string;
  title: string;
  description: string;
  iconUrl: string | null;
  colorHex: string;
  orderIndex: number;
  status: CourseStatus;
  startedAt: string | null;
}

export interface CourseCatalogListItem {
  id: string;
  title: string;
  description: string;
  iconUrl: string | null;
  colorHex: string;
  orderIndex: number;
}

export interface CourseHeaderSummary {
  courseId: string;
  title: string;
  completedNodes: number;
  totalNodes: number;
  activeSectionNumber: number;
  sectionCount: number;
}

export interface Section {
  /** UUID primary key */
  id: string;
  /** Parent course id */
  courseId: string;
  title: string;
  /** Sort order within the course */
  orderIndex: number;
}

export interface Unit {
  /** UUID primary key */
  id: string;
  /** Parent section id */
  sectionId: string;
  title: string;
  /** Key into the icon registry for the unit's avatar icon */
  iconKey: string;
  /** Sort order within the section */
  orderIndex: number;
}

export interface Node {
  /** UUID primary key */
  id: string;
  /** Parent unit id */
  unitId: string;
  title: string;
  /** Determines content table and renderer component */
  type: NodeType;
  /** FK into the type-specific content table (e.g. quiz_contents.id) */
  contentId: string | null;
  /** Mirrors type for content table lookup */
  contentType: string | null;
  /** Score 0–100 required to pass. null = any submission completes. */
  passThreshold: number | null;
  /** Sort order within the unit */
  orderIndex: number;
  /** Estimated minutes to complete */
  estimatedMins: number;
}

export interface CourseJourneyPreviewSection {
  id: string;
  title: string;
  orderIndex: number;
  unitCount: number;
  nodeCount: number;
}

export interface CourseJourneyPreview {
  courseId: string;
  sectionCount: number;
  unitCount: number;
  nodeCount: number;
  estimatedMinutes: number;
  sections: CourseJourneyPreviewSection[];
}

// ── Progress types (mirrors DB progress tables) ──────────────────────────────

export interface UserCourseProgress {
  userId: string;
  courseId: string;
  status: CourseStatus;
  startedAt: string | null;
  completedAt: string | null;
}

export interface UserNodeProgress {
  /** Optional — not always present in nodeProgressMap values */
  userId?: string;
  /** Optional — not always present in nodeProgressMap values */
  nodeId?: string;
  /** Excludes 'locked' — that is derived client-side, never stored */
  status: Exclude<NodeStatus, "locked">;
  attempts: number;
  bestScore: number | null;
  lastScore: number | null;
  lastAttemptedAt: string | null;
  completedAt: string | null;
}

// ── Edge Function response shapes ────────────────────────────────────────────

export interface GetCourseTreeResponse {
  course: Course;
  sections: Section[];
  units: Unit[];
  nodes: Node[];
}

export interface GetCourseProgressResponse {
  courseProgress: UserCourseProgress | null;
  /** Keyed by nodeId — server builds this map so client gets O(1) lookups */
  nodeProgressMap: Record<string, UserNodeProgress>;
}

export interface StartCourseResponse {
  courseProgressId: string;
  firstNodeId: string;
  alreadyStarted: boolean;
}

export interface CompleteNodeArgs {
  nodeId: string;
  courseId: string;
}

export interface CompleteNodeResponse {
  nodeId: string;
  nextNodeId: string | null;
  unitCompleted: boolean;
  sectionCompleted: boolean;
  courseCompleted: boolean;
}
