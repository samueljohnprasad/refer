import type {
  ExerciseConfig,
  BoxBreathingResponse,
} from "@/src/types/exerciseFlow";
import { createStep } from "@/src/components/exercise/steps/createStep";
import { createSummaryStep } from "@/src/components/exercise/steps/createSummaryStep";
import { IntroStep } from "@/src/components/exercise/steps/IntroStep";
import { SliderStep } from "@/src/components/exercise/steps/SliderStep";
import { BreathingTimerStep } from "@/src/components/exercise/steps/BreathingTimerStep";

const INITIAL: BoxBreathingResponse = {
  preCalmRating: 5,
  timerCompleted: false,
  postCalmRating: 5,
};

export const boxBreathingConfig: ExerciseConfig<BoxBreathingResponse> = {
  type: "box_breathing",
  category: "mindfulness",
  title: "Box Breathing",
  subtitle: "4-4-4-4 square breathing for calm",
  icon: "box_breathing",
  duration: "3-5 min",
  xp: 8,
  backgroundColor: "#E3F2FD",
  schemaVersion: 1,
  initialResponse: INITIAL,

  steps: [
    {
      id: "intro",
      component: createStep(IntroStep, {
        title: "Box Breathing",
        subtitle: "A calming 4-4-4-4 breathing pattern used by Navy SEALs.",
        exerciseType: "box_breathing",
        duration: "3-5 min",
        bulletPoints: [
          "Breathe in for 4 seconds",
          "Hold for 4 seconds",
          "Breathe out for 4 seconds",
          "Hold for 4 seconds",
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
      label: "How calm are you now? (1-10)",
      validate: () => true,
    },
    {
      id: "breathing_timer",
      component: createStep(BreathingTimerStep, {
        title: "Box Breathing",
        subtitle: "Follow the animation. Breathe in, hold, out, hold.",
        pattern: {
          inhale: 4,
          holdIn: 4,
          exhale: 4,
          holdOut: 4,
          rounds: 4,
          visual: "square" as const,
        },
        completedFieldKey: "timerCompleted",
      }),
      label: "Breathe with the square",
      validate: (r) => r.timerCompleted,
      timerConfig: {
        type: "breathing",
        durationMs: 4 * (4 + 4 + 4 + 4) * 1000,
        pattern: {
          inhale: 4,
          holdIn: 4,
          exhale: 4,
          holdOut: 4,
          rounds: 4,
          visual: "square",
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
      component: createSummaryStep<BoxBreathingResponse>(
        [
          { label: "Before", key: "preCalmRating" },
          { label: "After", key: "postCalmRating" },
        ],
        { title: "Well done!", exerciseType: "box_breathing" },
      ),
      label: "Summary",
      validate: () => true,
      excludeFromProgress: true,
    },
  ],
};
