import type { MotivationAnswer, StressLevel } from "../types";

export interface PlanMetaItem {
  subtitle: string;
  youWillLearn: string;
  practiceItems: readonly string[];
}

export const PLAN_META: Record<MotivationAnswer, PlanMetaItem> = {
  anxiety: {
    subtitle: "From racing thoughts to steadier ground.",
    youWillLearn:
      "You’ll learn to spot thought spirals early, calm your body’s alert response, and break free from chronic worry.",
    practiceItems: [
      "Understanding the anxiety loop",
      "Settling the body’s alert response",
      "Catching patterns earlier",
    ],
  },
  mood: {
    subtitle: "From heavy days to steadier light.",
    youWillLearn:
      "You’ll learn to identify mood triggers, practice small daily anchors, and find steady light through difficult moments.",
    practiceItems: [
      "Identifying subtle mood triggers",
      "Practicing tiny daily anchors",
      "Finding steadier responses to hard moments",
    ],
  },
  stress: {
    subtitle: "From pressure to steadier ground.",
    youWillLearn:
      "You’ll learn to notice tension before it peaks, decompress your nervous system, and reset under pressure.",
    practiceItems: [
      "Recognizing tension before it peaks",
      "Decompressing the nervous system",
      "Resetting when pressure mounts",
    ],
  },
  self_understanding: {
    subtitle: "From confusion to clearer patterns.",
    youWillLearn:
      "You’ll learn to decode emotional reactions, untangle recurring thoughts, and reconnect with what truly matters to you.",
    practiceItems: [
      "Uncovering repetitive thought loops",
      "Naming what you actually feel",
      "Aligning daily choices with your needs",
    ],
  },
  sleep: {
    subtitle: "From restless nights to gentler wind-downs.",
    youWillLearn:
      "You’ll learn to quiet late-night thoughts, release physical tension before bed, and ease into restful sleep.",
    practiceItems: [
      "Quieting late-night racing thoughts",
      "Releasing physical tension before bed",
      "Creating a predictable wind-down rhythm",
    ],
  },
};

// ponytail: format course summary to concise user-facing 'You’ll learn' statement instead of author syllabus
export function resolveCourseSummary(
  description: string | null | undefined,
  fallbackYouWillLearn: string,
): string {
  if (!description || description.trim().length === 0) {
    return fallbackYouWillLearn;
  }
  // If the description is an internal syllabus objective ("By the end, the learner can/will...")
  if (/^by the end,\s*the learner/i.test(description)) {
    return fallbackYouWillLearn;
  }
  // Convert third-person learner phrasing to second-person
  if (/^(the\s+)?learners?\s+will\s+/i.test(description)) {
    return description.replace(/^(the\s+)?learners?\s+will\s+/i, "You’ll learn to ");
  }
  if (/^(the\s+)?learners?\s+can\s+/i.test(description)) {
    return description.replace(/^(the\s+)?learners?\s+can\s+/i, "You’ll learn to ");
  }
  // If description is already concise and user-facing
  if (description.length <= 140 && !/learner/i.test(description)) {
    return description;
  }
  return fallbackYouWillLearn;
}

export function getWhyThisCourse(
  motivation: MotivationAnswer,
  stressLevel?: StressLevel,
): string {
  switch (motivation) {
    case "anxiety":
      if (stressLevel === "heavy") {
        return "You told us anxiety feels like a constant weight, so we’ll start with understanding what keeps the alert system switched on and making it easier to settle.";
      }
      if (stressLevel === "moderate") {
        return "You told us anxiety feels like regular tension, so we’ll start with understanding what keeps the alert system switched on and making it easier to settle.";
      }
      if (stressLevel === "overwhelming") {
        return "You told us anxiety feels like it takes over some days, so we’ll start with understanding the alert response and giving you tools to find space.";
      }
      return "Based on what you shared, we’ll start by helping you understand what keeps the alert system switched on and practice ways to settle it.";
    case "mood":
      return "Based on what you shared, we’ll start with small anchors that help you notice what lifts your day.";
    case "stress":
      return "Based on what you shared, we’ll focus on catching pressure before it builds up and giving your nervous system room to decompress.";
    case "self_understanding":
      return "Based on what you shared, we’ll help you decode emotional patterns and find clearer language for what you experience.";
    case "sleep":
      return "Based on what you shared, we’ll focus on evening unwinding practices to help your body signal safety before bed.";
    default:
      return "Based on what you shared, we’ll start with foundational practices tailored to where you are right now.";
  }
}

export function formatCount(value: number, singular: string): string {
  return `${value} ${value === 1 ? singular : `${singular}s`}`;
}
