import type { MotivationAnswer, StressLevel } from "../types";

export interface PlanMetaItem {
  summaryKey: string;
  practiceItemKeys: readonly string[];
}

export const PLAN_META = {
  anxiety: {
    summaryKey: "plan_reveal.course.anxiety.summary",
    practiceItemKeys: [
      "plan_reveal.course.anxiety.practice.first",
      "plan_reveal.course.anxiety.practice.second",
      "plan_reveal.course.anxiety.practice.third",
    ],
  },
  mood: {
    summaryKey: "plan_reveal.course.mood.summary",
    practiceItemKeys: [
      "plan_reveal.course.mood.practice.first",
      "plan_reveal.course.mood.practice.second",
      "plan_reveal.course.mood.practice.third",
    ],
  },
  stress: {
    summaryKey: "plan_reveal.course.stress.summary",
    practiceItemKeys: [
      "plan_reveal.course.stress.practice.first",
      "plan_reveal.course.stress.practice.second",
      "plan_reveal.course.stress.practice.third",
    ],
  },
  self_understanding: {
    summaryKey: "plan_reveal.course.self_understanding.summary",
    practiceItemKeys: [
      "plan_reveal.course.self_understanding.practice.first",
      "plan_reveal.course.self_understanding.practice.second",
      "plan_reveal.course.self_understanding.practice.third",
    ],
  },
  sleep: {
    summaryKey: "plan_reveal.course.sleep.summary",
    practiceItemKeys: [
      "plan_reveal.course.sleep.practice.first",
      "plan_reveal.course.sleep.practice.second",
      "plan_reveal.course.sleep.practice.third",
    ],
  },
} as const satisfies Record<MotivationAnswer, PlanMetaItem>;

export function resolveCourseSummary(
  description: string | null | undefined,
  fallbackYouWillLearn: string,
): string {
  if (!description || description.trim().length === 0) {
    return fallbackYouWillLearn;
  }
  if (/^by the end,\s*the learner/i.test(description)) {
    return fallbackYouWillLearn;
  }
  if (/^(the\s+)?learners?\s+will\s+/i.test(description)) {
    return description.replace(/^(the\s+)?learners?\s+will\s+/i, "You’ll learn to ");
  }
  if (/^(the\s+)?learners?\s+can\s+/i.test(description)) {
    return description.replace(/^(the\s+)?learners?\s+can\s+/i, "You’ll learn to ");
  }
  if (description.length <= 140 && !/learner/i.test(description)) {
    return description;
  }
  return fallbackYouWillLearn;
}

export type WhyThisCourseKey =
  | "plan_reveal.why.anxiety.heavy"
  | "plan_reveal.why.anxiety.moderate"
  | "plan_reveal.why.anxiety.overwhelming"
  | "plan_reveal.why.anxiety.default"
  | "plan_reveal.why.mood"
  | "plan_reveal.why.stress"
  | "plan_reveal.why.self_understanding"
  | "plan_reveal.why.sleep";

export function getWhyThisCourseKey(
  motivation: MotivationAnswer,
  stressLevel?: StressLevel,
): WhyThisCourseKey {
  if (motivation !== "anxiety") {
    return `plan_reveal.why.${motivation}`;
  }
  if (stressLevel === "heavy" || stressLevel === "moderate" || stressLevel === "overwhelming") {
    return `plan_reveal.why.anxiety.${stressLevel}`;
  }
  return "plan_reveal.why.anxiety.default";
}

export function formatCount(value: number, singular: string): string {
  return `${value} ${value === 1 ? singular : `${singular}s`}`;
}
