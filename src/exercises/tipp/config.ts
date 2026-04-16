import type { ExerciseConfig, TIPPResponse } from "@/src/types/exerciseFlow";
import { createStep } from "@/src/components/exercise/steps/createStep";
import { createSummaryStep } from "@/src/components/exercise/steps/createSummaryStep";
import { IntroStep } from "@/src/components/exercise/steps/IntroStep";
import { SliderStep } from "@/src/components/exercise/steps/SliderStep";
import { ChoiceStep } from "@/src/components/exercise/steps/ChoiceStep";
import { CountdownTimerStep } from "@/src/components/exercise/steps/CountdownTimerStep";

const INITIAL: TIPPResponse = {
  distressRating: 5,
  chosenTechnique: null,
  techniqueCompleted: false,
  postDistressRating: 5,
  effectivenessRating: 5,
};

export const tippConfig: ExerciseConfig<TIPPResponse> = {
  type: "tipp",
  category: "dbt",
  title: "TIPP",
  subtitle: "Temperature, Intense exercise, Paced breathing, Paired relaxation",
  icon: "tipp",
  duration: "5-10 min",
  xp: 10,
  backgroundColor: "#E1F5FE",
  schemaVersion: 1,
  initialResponse: INITIAL,

  steps: [
    {
      id: "intro",
      component: createStep(IntroStep, {
        title: "TIPP",
        subtitle:
          "Temperature, Intense exercise, Paced breathing, Paired relaxation.",
        exerciseType: "tipp",
        duration: "5-10 min",
        bulletPoints: [
          "T — Cold water on face",
          "I — Intense exercise",
          "P — Paced breathing",
          "P — Paired muscle relaxation",
        ],
      }),
      label: "Welcome",
      validate: () => true,
      excludeFromProgress: true,
    },
    {
      id: "distress_rating",
      component: createStep(SliderStep, {
        title: "Distress Level",
        subtitle: "How distressed do you feel right now?",
        fieldKey: "distressRating",
        min: 0,
        max: 10,
        minLabel: "Calm",
        maxLabel: "Extreme",
      }),
      label: "Rate your distress (0-10)",
      validate: () => true,
    },
    {
      id: "choose_technique",
      component: createStep(ChoiceStep, {
        title: "Choose a Technique",
        subtitle: "Pick the TIPP skill that feels right.",
        fieldKey: "chosenTechnique",
        options: [
          {
            value: "temperature",
            label: "Temperature (cold water)",
            iconKey: "temperature",
          },
          {
            value: "intense_exercise",
            label: "Intense exercise",
            iconKey: "intense_exercise",
          },
          {
            value: "paced_breathing",
            label: "Paced breathing",
            iconKey: "paced_breathing",
          },
          {
            value: "paired_relaxation",
            label: "Paired relaxation",
            iconKey: "paired_relaxation",
          },
        ],
      }),
      label: "Choose a technique",
      validate: (r) => r.chosenTechnique !== null,
    },
    {
      id: "guided_technique",
      component: createStep(CountdownTimerStep, {
        title: "Do the Technique",
        subtitle: "Follow along for 2 minutes.",
        timerConfig: {
          type: "countdown" as const,
          durationMs: 120_000,
          skippable: true,
        },
        completedFieldKey: "techniqueCompleted",
      }),
      label: "Do the technique",
      validate: (r) => r.techniqueCompleted,
      timerConfig: { type: "countdown", durationMs: 120_000, skippable: true },
    },
    {
      id: "post_distress_rating",
      component: createStep(SliderStep, {
        title: "Distress Now",
        subtitle: "How distressed do you feel now?",
        fieldKey: "postDistressRating",
        min: 0,
        max: 10,
        minLabel: "Calm",
        maxLabel: "Extreme",
      }),
      label: "Rate distress now (0-10)",
      validate: () => true,
    },
    {
      id: "log_effectiveness",
      component: createStep(SliderStep, {
        title: "Effectiveness",
        subtitle: "How effective was this technique?",
        fieldKey: "effectivenessRating",
        min: 1,
        max: 10,
        minLabel: "Not helpful",
        maxLabel: "Very helpful",
      }),
      label: "How effective was it?",
      validate: () => true,
    },
    {
      id: "summary",
      component: createSummaryStep<TIPPResponse>(
        [
          { label: "Distress Before", key: "distressRating" },
          { label: "Technique", key: "chosenTechnique" },
          { label: "Distress After", key: "postDistressRating" },
          { label: "Effectiveness", key: "effectivenessRating" },
        ],
        { title: "TIPP complete!", exerciseType: "tipp" },
      ),
      label: "Summary",
      validate: () => true,
      excludeFromProgress: true,
    },
  ],
};
