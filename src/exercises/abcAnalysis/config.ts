import type {
  ExerciseConfig,
  ABCAnalysisResponse,
} from "@/src/types/exerciseFlow";
import {
  ABCActivatingEventStep,
  ABCAlternativeBeliefStep,
  ABCBeliefStep,
  ABCConsequenceStep,
  ABCNewConsequenceStep,
  ABCSummaryStep,
} from "./customSteps";
import { createStep } from "@/src/components/exercise/steps/createStep";
import { SliderStep } from "@/src/components/exercise/steps/SliderStep";

const INITIAL: ABCAnalysisResponse = {
  activatingEvent: "",
  belief: "",
  consequenceEmotion: "",
  consequenceBehavior: "",
  alternativeBelief: "",
  newConsequence: "",
  preEmotionalIntensity: 5,
  postEmotionalIntensity: 5,
};

export const abcAnalysisConfig: ExerciseConfig<ABCAnalysisResponse> = {
  type: "abc_analysis",
  category: "cbt_core",
  title: "ABC Analysis",
  subtitle: "Understand the link between events, beliefs, and consequences",
  icon: "abc_analysis",
  duration: "7-10 min",
  xp: 15,
  backgroundColor: "#fff",
  schemaVersion: 2,
  initialResponse: INITIAL,

  steps: [
    {
      id: "pre_emotional_intensity",
      component: createStep(SliderStep, {
        title: "Before We Start",
        subtitle: "How intense are your emotions about this event?",
        fieldKey: "preEmotionalIntensity",
        min: 1,
        max: 10,
        minLabel: "Mild",
        maxLabel: "Very intense",
      }),
      label: "How intense are your emotions? (1-10)",
      validate: () => true,
    },
    {
      id: "activating_event",
      component: ABCActivatingEventStep,
      label: "Activating Event",
      validate: (r) => r.activatingEvent.trim().length >= 1,
    },
    {
      id: "belief",
      component: ABCBeliefStep,
      label: "What did you tell yourself?",
      validate: (r) => r.belief.trim().length >= 1,
    },
    {
      id: "consequence",
      component: ABCConsequenceStep,
      label: "Consequence (emotion + behavior)",
      validate: (r) =>
        r.consequenceEmotion.trim().length >= 1 &&
        r.consequenceBehavior.trim().length >= 1,
    },
    {
      id: "alternative_belief",
      component: ABCAlternativeBeliefStep,
      label: "Alternative belief",
      validate: (r) => r.alternativeBelief.trim().length >= 1,
      ai: {
        promptBuilder: (r) =>
          `You are a CBT therapist. The user experienced:\nEvent: "${r.activatingEvent}"\nBelief: "${r.belief}"\nConsequence: Emotion: "${r.consequenceEmotion}", Behavior: "${r.consequenceBehavior}"\n\nSuggest 3 alternative, more balanced beliefs. Each should be realistic and written in first person.`,
        responseSchema: {
          type: "array",
          items: {
            type: "object",
            properties: {
              text: { type: "string" },
              rationale: { type: "string" },
            },
            required: ["text", "rationale"],
          },
        },
        maxResults: 3,
      },
    },
    {
      id: "new_consequence",
      component: ABCNewConsequenceStep,
      label: "Predicted new consequence",
      validate: (r) => r.newConsequence.trim().length >= 1,
    },
    {
      id: "post_emotional_intensity",
      component: createStep(SliderStep, {
        title: "After Reframing",
        subtitle: "How intense are your emotions now?",
        fieldKey: "postEmotionalIntensity",
        min: 1,
        max: 10,
        minLabel: "Mild",
        maxLabel: "Very intense",
      }),
      label: "How intense are your emotions now? (1-10)",
      validate: () => true,
    },
    {
      id: "summary",
      component: ABCSummaryStep,
      label: "Summary",
      validate: () => true,
      excludeFromProgress: true,
    },
  ],
};
