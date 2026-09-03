// src/data/journey/rewardsConfig.ts
// ponytail: authored config for the Course Rewards MVP.
// OTA-updatable via EAS. Never hardcode authored copy in components.
// All lookups are O(1) keyed by ID. Missing fields fail open with console.warn.

// ── Types ─────────────────────────────────────────────────────────────────────

export interface LessonTakeaway {
  /** Node UUID from the DB */
  nodeId: string;
  /** One-sentence learning takeaway shown on the lesson completion surface (FR-1.2). */
  takeaway: string;
}

export interface InsightCardContent {
  /** Short title, e.g. "Why sleep debt adds up" (FR-2.10) */
  title: string;
  /** Concise useful idea connected to the unit's learning outcome (FR-2.10) */
  body: string;
}

export interface UnitRewardContent {
  /** Unit UUID from the DB */
  unitId: string;
  /**
   * "You can now…" capability statement for the unit trophy (FR-3.3).
   * Must not claim symptom improvement, treatment completion, or perfection.
   */
  capabilityStatement: string;
  /**
   * Authored insight card revealed when the learner claims the chest (FR-2.10).
   * Required when the backend provides a chest node for this unit.
   */
  insightCard: InsightCardContent;
}

export interface CourseRewardContent {
  /** Course UUID from the DB */
  courseId: string;
  /**
   * Warm acknowledgement of effort shown in the course finale (FR-4.3).
   * Must not claim recovery, symptom elimination, or treatment completion.
   */
  acknowledgement: string;
  /**
   * 3–5 concrete capability strings developed across the course (FR-4.3).
   */
  capabilitySummary: string[];
}

export interface RewardsConfig {
  /** Keyed by nodeId for O(1) lesson takeaway lookup */
  lessonTakeaways: Record<string, LessonTakeaway>;
  /** Keyed by unitId for O(1) unit reward lookup */
  unitRewards: Record<string, UnitRewardContent>;
  /** Keyed by courseId for O(1) course reward lookup */
  courseRewards: Record<string, CourseRewardContent>;
}

// ── Fallbacks ─────────────────────────────────────────────────────────────────

/** Shown when a lesson's authored takeaway is missing (FR-1.3). */
export const FALLBACK_TAKEAWAY =
  "You've completed this lesson. Keep going to build on what you've learned.";

/** Shown when a course's authored acknowledgement is missing (FR-4.3). */
export const FALLBACK_ACKNOWLEDGEMENT =
  "You've completed this course. The skills you've practised here are yours to keep.";

// ── Gap-detection helpers ─────────────────────────────────────────────────────

/** Warn once per missing field so content gaps surface during development. */
function warnMissing(field: string, id: string): void {
  console.warn(`[rewards] missing ${field} for ${id}`);
}

/**
 * Looks up the lesson takeaway for a node.
 * Returns the authored takeaway or the neutral fallback, and warns on miss.
 */
export function getLessonTakeaway(nodeId: string): string {
  const entry = REWARDS_CONFIG.lessonTakeaways[nodeId];
  if (!entry?.takeaway) {
    warnMissing("takeaway", `node ${nodeId}`);
    return FALLBACK_TAKEAWAY;
  }
  return entry.takeaway;
}

/**
 * Looks up the unit reward content.
 * Returns null (fail open) and warns if absent — chest and trophy are skipped.
 */
export function getUnitRewardContent(unitId: string): UnitRewardContent | null {
  const entry = REWARDS_CONFIG.unitRewards[unitId];
  if (!entry) {
    warnMissing("unitRewards", `unit ${unitId}`);
    return null;
  }
  if (!entry.insightCard?.title || !entry.insightCard?.body) {
    warnMissing("insightCard", `unit ${unitId}`);
  }
  if (!entry.capabilityStatement) {
    warnMissing("capabilityStatement", `unit ${unitId}`);
  }
  return entry;
}

/**
 * Looks up the course reward content.
 * Returns null (fail open) and warns if absent.
 */
export function getCourseRewardContent(
  courseId: string,
): CourseRewardContent | null {
  const entry = REWARDS_CONFIG.courseRewards[courseId];
  if (!entry) {
    warnMissing("courseRewards", `course ${courseId}`);
    return null;
  }
  if (!entry.acknowledgement) {
    warnMissing("acknowledgement", `course ${courseId}`);
  }
  if (!entry.capabilitySummary?.length) {
    warnMissing("capabilitySummary", `course ${courseId}`);
  }
  return entry;
}

// ── Config ────────────────────────────────────────────────────────────────────
// ponytail: placeholder data — curriculum author pass fills real UUIDs + copy.
// Safe language: no symptom claims, no "conquered", "healed", "perfect", "fast".

export const REWARDS_CONFIG: RewardsConfig = {
  lessonTakeaways: {
    "5b478d6e-4433-9c76-d355-788e1c64d787": {
      nodeId: "5b478d6e-4433-9c76-d355-788e1c64d787",
      takeaway: "Sleep pressure builds throughout the day and releases during sleep.",
    },
    "83da220e-2cf1-5d7d-dde1-665f052cbab4": {
      nodeId: "83da220e-2cf1-5d7d-dde1-665f052cbab4",
      takeaway: "Your sleep runs in cycles, alternating between deep and REM sleep.",
    },
    "e801eeee-2e1b-2742-99d7-c40ac5e26880": {
      nodeId: "e801eeee-2e1b-2742-99d7-c40ac5e26880",
      takeaway: "Light exposure dictates your body's natural waking and sleeping times.",
    },
    "a627b796-164b-96ad-8400-bb61ded9e2e3": {
      nodeId: "a627b796-164b-96ad-8400-bb61ded9e2e3",
      takeaway: "Arousal and stress can override your natural sleep drive.",
    },
    "d9f69e9f-e885-255b-6cd5-abf6386c46b5": {
      nodeId: "d9f69e9f-e885-255b-6cd5-abf6386c46b5",
      takeaway: "Understanding your sleep pressure helps you avoid early bedtime traps.",
    },
    "8673bb14-2054-a526-807f-1c8ba78b45ee": {
      nodeId: "8673bb14-2054-a526-807f-1c8ba78b45ee",
      takeaway: "Caffeine masks sleep pressure, delaying your body's signal to rest.",
    },
    "04ee0763-1f91-6bca-a087-7c10f6629ce2": {
      nodeId: "04ee0763-1f91-6bca-a087-7c10f6629ce2",
      takeaway: "Alcohol fragments your sleep cycles, reducing restorative rest.",
    },
    "eb379247-ab19-47aa-3bf9-a5d55d5a064b": {
      nodeId: "eb379247-ab19-47aa-3bf9-a5d55d5a064b",
      takeaway: "Late-night screen light pushes your circadian rhythm backwards.",
    },
    "d5740e01-fb85-51e9-9868-77c57fed5ed6": {
      nodeId: "d5740e01-fb85-51e9-9868-77c57fed5ed6",
      takeaway: "You now understand the core mechanics that govern your sleep.",
    },
    "c63552e7-515e-eeac-5f58-e65658e53a68": {
      nodeId: "c63552e7-515e-eeac-5f58-e65658e53a68",
      takeaway: "Small experiments build the foundation for lasting sleep habits.",
    },
  },

  unitRewards: {
    "4acb6062-3186-03fe-e1ae-fd5cb726727b": {
      unitId: "4acb6062-3186-03fe-e1ae-fd5cb726727b",
      capabilityStatement:
        "You can now explain how sleep pressure and the circadian clock work together.",
      insightCard: {
        title: "Why sleep debt adds up",
        body: "Each hour of lost sleep is carried forward. Understanding this helps you plan recovery sleep without guilt.",
      },
    },
    "a6ecf308-e8ae-ab65-91ed-8e9e134c1ab9": {
      unitId: "a6ecf308-e8ae-ab65-91ed-8e9e134c1ab9",
      capabilityStatement:
        "You can now identify and manage the common behaviours that interfere with sleep pressure.",
      insightCard: {
        title: "The caffeine half-life",
        body: "Caffeine blocks sleep pressure receptors for up to 6 hours. Timing your last cup helps pressure build naturally.",
      },
    }
  },

  courseRewards: {
    "4684990b-bc14-799c-012a-9766336342f2": {
      courseId: "4684990b-bc14-799c-012a-9766336342f2",
      acknowledgement:
        "You've worked through the core science of sleep. These are skills you can return to any time.",
      capabilitySummary: [
        "Explain the two-process model of sleep regulation.",
        "Identify common behaviours that interfere with sleep pressure.",
        "Describe the role of light in setting your circadian rhythm.",
        "Apply wind-down strategies based on what you've learned.",
      ],
    },
  },
};
