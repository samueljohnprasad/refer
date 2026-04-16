import type {
  ExerciseConfig,
  Breathing478Response,
} from "@/src/types/exerciseFlow";
import { createStep } from "@/src/components/exercise/steps/createStep";
import { createSummaryStep } from "@/src/components/exercise/steps/createSummaryStep";
import { IntroStep } from "@/src/components/exercise/steps/IntroStep";
import { SliderStep } from "@/src/components/exercise/steps/SliderStep";
import { BreathingTimerStep } from "@/src/components/exercise/steps/BreathingTimerStep";

const INITIAL: Breathing478Response = {
  preCalmRating: 5,
  timerCompleted: false,
  postCalmRating: 5,
};

export const breathing478Config: ExerciseConfig<Breathing478Response> = {
  type: "breathing_478",
  category: "mindfulness",
  title: "4-7-8 Breathing",
  subtitle: "Calm your nervous system with 4-7-8",
  icon: "breathing_478",
  duration: "3-5 min",
  xp: 8,
  backgroundColor: "#fff",
  schemaVersion: 1,
  initialResponse: INITIAL,

  steps: [
    {
      id: "intro",
      component: createStep(IntroStep, {
        title: "4-7-8 Breathing",
        subtitle: "A powerful technique to calm your nervous system quickly.",
        exerciseType: "breathing_478",
        duration: "3-5 min",
        bulletPoints: [
          "Inhale for 4 seconds",
          "Hold for 7 seconds",
          "Exhale for 8 seconds",
        ],
      }),
      label: "Welcome",
      validate: () => true,
      excludeFromProgress: true,
    },
    {
      id: "pre_calm_rating",
      component: createStep(SliderStep, {
        title: "Before We Start",
        subtitle: "How calm do you feel right now?",
        fieldKey: "preCalmRating",
        min: 1,
        max: 10,
        minLabel: "Very tense",
        maxLabel: "Very calm",
      }),
      label: "How calm are you? (1-10)",
      validate: () => true,
    },
    {
      id: "breathing_timer",
      component: createStep(BreathingTimerStep, {
        title: "4-7-8 Breathing",
        subtitle: "Follow the circle. Inhale, hold, exhale slowly.",
        pattern: {
          inhale: 4,
          holdIn: 7,
          exhale: 8,
          holdOut: 0,
          rounds: 3,
          visual: "circle" as const,
        },
        completedFieldKey: "timerCompleted",
      }),
      label: "Breathe with the circle",
      validate: (r) => r.timerCompleted,
      timerConfig: {
        type: "breathing",
        durationMs: 3 * (4 + 7 + 8) * 1000,
        pattern: {
          inhale: 4,
          holdIn: 7,
          exhale: 8,
          holdOut: 0,
          rounds: 3,
          visual: "circle",
        },
      },
    },
    {
      id: "post_calm_rating",
      component: createStep(SliderStep, {
        title: "After Breathing",
        subtitle: "How calm do you feel now?",
        fieldKey: "postCalmRating",
        min: 1,
        max: 10,
        minLabel: "Very tense",
        maxLabel: "Very calm",
      }),
      label: "How calm are you now? (1-10)",
      validate: () => true,
    },
    {
      id: "summary",
      component: createSummaryStep<Breathing478Response>(
        [
          { label: "Before", key: "preCalmRating" },
          { label: "After", key: "postCalmRating" },
        ],
        { title: "Well done!", exerciseType: "breathing_478" },
      ),
      label: "Summary",
      validate: () => true,
      excludeFromProgress: true,
    },
  ],
};
