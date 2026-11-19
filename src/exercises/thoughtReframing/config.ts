import type {
  ExerciseConfig,
  ThoughtReframingResponse,
} from "@/src/types/exerciseFlow";
import { createStep } from "@/src/components/exercise/steps/createStep";
import { ThoughtReframingSummary } from "./ThoughtReframingSummary";
import { TRIntroStep } from "./TRIntroStep";
import { TRBeliefSliderStep } from "./TRBeliefSliderStep";
import { hasWords } from "./trWriting";
import {
  TRSituationStep,
  TRAutomaticThoughtStep,
  TREmotionsStep,
  TRDistortionsStep,
  TREvidenceForStep,
  TREvidenceAgainstStep,
  TRBalancedThoughtStep,
} from "./customSteps";

export const THOUGHT_REFRAMING_INITIAL: ThoughtReframingResponse = {
  situation: "",
  automaticThought: "",
  selectedEmotions: [],
  selectedDistortions: [],
  evidenceFor: [],
  evidenceAgainst: [],
  balancedThought: "",
  intensity: 5,
  postIntensity: undefined,
};

function scaleBeliefScore(value: number): number {
  if (value > 10) return Math.round(value / 10);
  return Math.round(value);
}

function normalizeBeliefScore(value: number | undefined): number | undefined {
  if (typeof value !== "number") return undefined;
  return Math.min(Math.max(scaleBeliefScore(value), 0), 10);
}

function applyV2Migration(migrated: any, fromVersion: number) {
  if (fromVersion < 2) migrated.postIntensity = undefined;
}

function getDefaultIntensity(intensity: number | undefined): number {
  if (intensity === undefined) return THOUGHT_REFRAMING_INITIAL.intensity;
  return intensity;
}

function applyV4Migration(migrated: any, fromVersion: number) {
  if (fromVersion < 4) {
    migrated.intensity = getDefaultIntensity(normalizeBeliefScore(migrated.intensity));
    migrated.postIntensity = normalizeBeliefScore(migrated.postIntensity);
  }
}

export const thoughtReframingConfig: ExerciseConfig<ThoughtReframingResponse> =
  {
    type: "thought_reframing",
    category: "cbt_core",
    title: "Thought Reframing",
    subtitle: "Challenge and reframe negative thoughts",
    icon: "thought_reframing",
    duration: "10-15 min",
    xp: 15,
    backgroundColor: "#fff",
    schemaVersion: 4,
    initialResponse: THOUGHT_REFRAMING_INITIAL,
    migrate: (old, fromVersion) => {
      const migrated = { ...THOUGHT_REFRAMING_INITIAL, ...old };
      applyV2Migration(migrated, fromVersion);
      applyV4Migration(migrated, fromVersion);
      return migrated;
    },

    steps: [
      {
        id: "intro",
        component: TRIntroStep,
        label: "Welcome",
        validate: () => true,
        excludeFromProgress: true,
        hideHeader: true,
        nextLabel: "Begin",
      },
      {
        id: "situation",
        component: TRSituationStep,
        label: "Describe the situation",
        validate: (r) => hasWords(r.situation),
      },
      {
        id: "automatic_thought",
        component: TRAutomaticThoughtStep,
        label: "What was the automatic thought?",
        validate: (r) => hasWords(r.automaticThought),
      },
      {
        id: "intensity",
        component: createStep(TRBeliefSliderStep, {
          fieldKey: "intensity" as const,
          title: "How true does it feel right now?",
          subtitle: "Your gut answer. There is no right number.",
        }),
        label: "Rate how true the thought feels",
        validate: () => true,
        nextLabel: "Use this for now",
      },
      {
        id: "emotions",
        component: TREmotionsStep,
        label: "Select emotions (max 3)",
        validate: (r) => r.selectedEmotions.length >= 1,
      },
      {
        id: "distortions",
        component: TRDistortionsStep,
        label: "Notice thought patterns (max 2)",
        validate: () => true,
      },
      {
        id: "evidence_for",
        component: TREvidenceForStep,
        label: "Evidence supporting this thought",
        validate: () => true,
      },
      {
        id: "evidence_against",
        component: TREvidenceAgainstStep,
        label: "Evidence against this thought",
        validate: () => true,
      },
      {
        id: "balanced_thought",
        component: TRBalancedThoughtStep,
        label: "Write a balanced thought",
        validate: (r) => hasWords(r.balancedThought, true),
      },
      {
        id: "re_evaluate",
        component: createStep(TRBeliefSliderStep, {
          fieldKey: "postIntensity" as const,
          title: "And how true does it feel now?",
          subtitle: "Same thought, after weighing it. Any answer is fine.",
        }),
        label: "Re-evaluate your belief",
        validate: () => true,
        nextLabel: "Use this for now",
      },
      {
        id: "summary",
        component: ThoughtReframingSummary,
        label: "Summary",
        validate: () => true,
        excludeFromProgress: true,
        hideHeader: true,
        nextLabel: "Complete",
        secondaryLabel: "Edit answers",
      },
    ],
  };
