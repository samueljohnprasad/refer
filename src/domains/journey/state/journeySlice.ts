// domains/journey/state/journeySlice.ts
// Normalized Redux state for the Journey Map.
// Stores courses, sections, units, nodes as entity adapters (O(1) lookups).
// Maintains relationship indexes for O(1) parent→children traversal.
// Owns shared journey data plus global/per-course UI state that must survive
// beyond a single screen render.

import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

import type {
  Course,
  Section,
  Unit,
  Node,
  UserCourseProgress,
  UserNodeProgress,
  GetCourseTreeResponse,
  GetCourseProgressResponse,
} from "@/src/types/journeyV5";

// ── Entity adapters ───────────────────────────────────────────────────────────

const coursesAdapter = createEntityAdapter<Course>();
const sectionsAdapter = createEntityAdapter<Section>();
const unitsAdapter = createEntityAdapter<Unit>();
const nodesAdapter = createEntityAdapter<Node>();

// ── State shape ───────────────────────────────────────────────────────────────

export interface JourneyState {
  // Normalized entity stores
  courses: ReturnType<typeof coursesAdapter.getInitialState>;
  sections: ReturnType<typeof sectionsAdapter.getInitialState>;
  units: ReturnType<typeof unitsAdapter.getInitialState>;
  nodes: ReturnType<typeof nodesAdapter.getInitialState>;

  // Relationship indexes — O(1) parent→children lookup (ordered)
  sectionsByCourse: Record<string, string[]>;
  unitsBySection: Record<string, string[]>;
  nodesByUnit: Record<string, string[]>;

  // Progress — flat maps keyed by entity id
  courseProgress: Record<string, UserCourseProgress>;
  nodeProgress: Record<string, UserNodeProgress>;

  // Loading state — keyed by courseId for O(1) check
  loadedCourses: Record<string, boolean>;
  loadingCourses: Record<string, boolean>;
  courseLoadErrors: Record<string, string>;

  // UI state
  activeCourseId: string | null;
  previewSectionIdByCourse: Record<string, string | null>;
  activeNodeModalIdByCourse: Record<string, string | null>;

  // Reward UI state — set after completeNode; cleared after the surface is shown.
  // 'lesson' | 'unit' | 'course' — priority: course > unit > lesson
  pendingCelebration: Record<string, 'lesson' | 'unit' | 'course' | null>;

  // Tracks whether the full course finale has been shown for a given courseId.
  // Seeded from AsyncStorage on load; persisted to AsyncStorage on set.
  courseFinaleSeenByCourse: Record<string, boolean>;
}

const initialState: JourneyState = {
  courses: coursesAdapter.getInitialState(),
  sections: sectionsAdapter.getInitialState(),
  units: unitsAdapter.getInitialState(),
  nodes: nodesAdapter.getInitialState(),

  sectionsByCourse: {},
  unitsBySection: {},
  nodesByUnit: {},

  courseProgress: {},
  nodeProgress: {},

  loadedCourses: {},
  loadingCourses: {},
  courseLoadErrors: {},

  activeCourseId: null,
  previewSectionIdByCourse: {},
  activeNodeModalIdByCourse: {},
  pendingCelebration: {},
  courseFinaleSeenByCourse: {},
};

// ── Slice ─────────────────────────────────────────────────────────────────────

const journeySlice = createSlice({
  name: "journey",
  initialState,
  reducers: {
    // ── Tree loading ──────────────────────────────────────────────────────────

    /**
     * Loads a full course tree into the normalized store.
     * Builds all 3 relationship indexes (ordered by orderIndex).
     * Marks the course as loaded and removes it from loadingCourses.
     */
    setCourseTree(state, action: PayloadAction<GetCourseTreeResponse>) {
      const { course, sections, units, nodes } = action.payload;

      // Upsert into entity stores (additive — multi-course sharing one flat store)
      coursesAdapter.upsertOne(state.courses, course);
      sectionsAdapter.upsertMany(state.sections, sections);
      unitsAdapter.upsertMany(state.units, units);
      nodesAdapter.upsertMany(state.nodes, nodes);

      // Build sectionsByCourse index
      state.sectionsByCourse[course.id] = [...sections]
        .sort((a, b) => a.orderIndex - b.orderIndex)
        .map((s) => s.id);

      // Build unitsBySection index
      for (const section of sections) {
        state.unitsBySection[section.id] = units
          .filter((u) => u.sectionId === section.id)
          .sort((a, b) => a.orderIndex - b.orderIndex)
          .map((u) => u.id);
      }

      // Build nodesByUnit index
      for (const unit of units) {
        state.nodesByUnit[unit.id] = nodes
          .filter((n) => n.unitId === unit.id)
          .sort((a, b) => a.orderIndex - b.orderIndex)
          .map((n) => n.id);
      }

      // Mark as loaded
      state.loadedCourses[course.id] = true;
      delete state.loadingCourses[course.id];
      delete state.courseLoadErrors[course.id];
    },

    /**
     * Merges course + node progress from get-course-progress into the flat maps.
     * Only updates nodes present in the response (others remain unchanged).
     */
    setCourseProgress(state, action: PayloadAction<GetCourseProgressResponse>) {
      const { courseProgress, nodeProgressMap } = action.payload;

      if (courseProgress) {
        state.courseProgress[courseProgress.courseId] = courseProgress;
      }

      for (const [nodeId, progress] of Object.entries(nodeProgressMap)) {
        state.nodeProgress[nodeId] = progress;
      }
    },

    /**
     * Optimistically updates a node's status client-side.
     * Used to reflect open-node (→ in_progress) immediately before the refetch.
     */
    optimisticSetNodeStatus(
      state,
      action: PayloadAction<{
        nodeId: string;
        status: UserNodeProgress["status"];
      }>,
    ) {
      const { nodeId, status } = action.payload;
      const existing = state.nodeProgress[nodeId];
      if (existing) {
        existing.status = status;
      } else {
        state.nodeProgress[nodeId] = {
          status,
          attempts: 0,
          bestScore: null,
          lastScore: null,
          lastAttemptedAt: null,
          completedAt: null,
        };
      }
    },

    // ── Loading state ─────────────────────────────────────────────────────────

    /** Marks a course as currently being fetched (prevents duplicate fetches). */
    setLoadingCourse(state, action: PayloadAction<string>) {
      state.loadingCourses[action.payload] = true;
      delete state.courseLoadErrors[action.payload];
    },

    setCourseLoadFailed(
      state,
      action: PayloadAction<{ courseId: string; message: string }>,
    ) {
      const { courseId, message } = action.payload;
      delete state.loadingCourses[courseId];
      state.courseLoadErrors[courseId] = message;
    },

    clearCourseLoadError(state, action: PayloadAction<string>) {
      delete state.courseLoadErrors[action.payload];
    },

    // ── UI state ──────────────────────────────────────────────────────────────

    setActiveCourse(state, action: PayloadAction<string | null>) {
      if (state.activeCourseId === action.payload) return;
      state.activeCourseId = action.payload;
    },

    setPreviewSection(
      state,
      action: PayloadAction<{ courseId: string; sectionId: string | null }>,
    ) {
      const { courseId, sectionId } = action.payload;
      state.previewSectionIdByCourse[courseId] = sectionId;
    },

    setActiveNodeModal(
      state,
      action: PayloadAction<{ courseId: string; nodeId: string | null }>,
    ) {
      const { courseId, nodeId } = action.payload;
      state.activeNodeModalIdByCourse[courseId] = nodeId;
    },

    // ── Reward UI state ───────────────────────────────────────────────────────

    /**
     * Set after a completeNode call returns with completion flags.
     * Priority enforced by useCelebrationOrchestrator: course > unit > lesson.
     * Pass level: null to clear after the surface is dismissed.
     */
    setPendingCelebration(
      state,
      action: PayloadAction<{ courseId: string; level: 'lesson' | 'unit' | 'course' | null }>,
    ) {
      const { courseId, level } = action.payload;
      state.pendingCelebration[courseId] = level;
    },

    /**
     * Mark the course finale as seen for a given courseId.
     * Also persists to AsyncStorage so the flag survives app restarts.
     */
    markCourseFinaleSeen(
      state,
      action: PayloadAction<{ courseId: string }>,
    ) {
      const { courseId } = action.payload;
      state.courseFinaleSeenByCourse[courseId] = true;
      // ponytail: fire-and-forget — failure is non-blocking (FR-5.4)
      AsyncStorage.setItem(`@rewards/finaleSeen/${courseId}`, "true").catch(
        (err) => console.warn("[rewards] failed to persist finaleSeen", err),
      );
    },
  },
});

export const {
  setCourseTree,
  setCourseProgress,
  optimisticSetNodeStatus,
  setLoadingCourse,
  setCourseLoadFailed,
  clearCourseLoadError,
  setActiveCourse,
  setPreviewSection,
  setActiveNodeModal,
  setPendingCelebration,
  markCourseFinaleSeen,
} = journeySlice.actions;

export default journeySlice.reducer;
