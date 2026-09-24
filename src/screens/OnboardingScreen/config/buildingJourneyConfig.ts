import type { LoadingTask, MotivationAnswer, StressLevel } from "../types";

export interface BuildingJourneyConfig {
  title: string;
  subtitle: string;
  tasks: readonly LoadingTask[];
}

export const DEFAULT_BUILDING_JOURNEY_CONFIG: BuildingJourneyConfig = {
  title: "Building your journey...",
  subtitle: "Personalizing based on your answers",
  tasks: [
    { id: "profile", label: "Analyzing your profile", durationMs: 800 },
    { id: "journey", label: "Building your personal journey", durationMs: 900 },
    { id: "cbt", label: "Selecting CBT exercises for you", durationMs: 1000 },
    { id: "schedule", label: "Optimizing your daily schedule", durationMs: 800 },
  ],
};

// ponytail: config-driven loading tasks mapped to onboarding motivation & stress level
export const BUILDING_JOURNEY_CONFIGS: Record<
  MotivationAnswer,
  BuildingJourneyConfig
> = {
  anxiety: {
    title: "Building your journey...",
    subtitle: "Personalizing based on your answers",
    tasks: [
      { id: "profile", label: "Analyzing your anxiety profile", durationMs: 800 },
      { id: "journey", label: "Building your personal calm journey", durationMs: 900 },
      { id: "cbt", label: "Selecting anxiety & worry exercises", durationMs: 1000 },
      { id: "schedule", label: "Optimizing your daily schedule", durationMs: 800 },
    ],
  },
  mood: {
    title: "Building your journey...",
    subtitle: "Personalizing based on your answers",
    tasks: [
      { id: "profile", label: "Analyzing your mood patterns", durationMs: 800 },
      { id: "journey", label: "Building your personalized journey", durationMs: 900 },
      { id: "cbt", label: "Selecting mood-lifting CBT exercises", durationMs: 1000 },
      { id: "schedule", label: "Optimizing your daily check-in routine", durationMs: 800 },
    ],
  },
  stress: {
    title: "Building your journey...",
    subtitle: "Personalizing based on your answers",
    tasks: [
      { id: "profile", label: "Analyzing your stress profile", durationMs: 800 },
      { id: "journey", label: "Building your personal journey", durationMs: 900 },
      { id: "cbt", label: "Selecting CBT exercises for you", durationMs: 1000 },
      { id: "schedule", label: "Optimizing your daily schedule", durationMs: 800 },
    ],
  },
  self_understanding: {
    title: "Building your journey...",
    subtitle: "Personalizing based on your answers",
    tasks: [
      { id: "profile", label: "Analyzing your thinking patterns", durationMs: 800 },
      { id: "journey", label: "Building your self-discovery journey", durationMs: 900 },
      { id: "cbt", label: "Selecting reflection & CBT exercises", durationMs: 1000 },
      { id: "schedule", label: "Optimizing your personal growth pace", durationMs: 800 },
    ],
  },
  sleep: {
    title: "Building your journey...",
    subtitle: "Personalizing based on your answers",
    tasks: [
      { id: "profile", label: "Analyzing your sleep & rest patterns", durationMs: 800 },
      { id: "journey", label: "Building your sleep reset journey", durationMs: 900 },
      { id: "cbt", label: "Selecting wind-down & CBT exercises", durationMs: 1000 },
      { id: "schedule", label: "Optimizing your evening wind-down schedule", durationMs: 800 },
    ],
  },
};

export function getBuildingJourneyConfig(
  motivation?: MotivationAnswer,
  stressLevel?: StressLevel,
): BuildingJourneyConfig {
  if (motivation && BUILDING_JOURNEY_CONFIGS[motivation]) {
    const baseConfig = BUILDING_JOURNEY_CONFIGS[motivation];
    if (stressLevel === "overwhelming" || stressLevel === "heavy") {
      return {
        ...baseConfig,
        tasks: baseConfig.tasks.map((task) =>
          task.id === "schedule"
            ? { ...task, label: "Setting a gentle, manageable pace" }
            : task,
        ),
      };
    }
    return baseConfig;
  }
  return DEFAULT_BUILDING_JOURNEY_CONFIG;
}
