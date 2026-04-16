import type {
  ExerciseConfig,
  ABCAnalysisResponse,
} from "@/src/types/exerciseFlow";
import { createStep } from "@/src/components/exercise/steps/createStep";
import { createSummaryStep } from "@/src/components/exercise/steps/createSummaryStep";
import { IntroStep } from "@/src/components/exercise/steps/IntroStep";
import { TextInputStep } from "@/src/components/exercise/steps/TextInputStep";
import { AITextInputStep } from "@/src/components/exercise/steps/AITextInputStep";

const INITIAL: ABCAnalysisResponse = {
  activatingEvent: "",
  belief: "",
  consequenceEmotion: "",
  consequenceBehavior: "",
  alternativeBelief: "",
  newConsequence: "",
};

export const abcAnalysisConfig: ExerciseConfig<ABCAnalysisResponse> = {
  type: "abc_analysis",
  category: "cbt_core",
  title: "ABC Analysis",
  subtitle: "Understand the link between events, beliefs, and consequences",
  icon: "abc_analysis",
  duration: "7-10 min",
  xp: 15,
  backgroundColor: "#F3E5F5",
  schemaVersion: 1,
  initialResponse: INITIAL,

  steps: [
    {
      id: "intro",
      component: createStep(IntroStep, {
        title: "ABC Analysis",
        subtitle:
          "A = Activating event, B = Belief, C = Consequence. Let's break it down.",
        exerciseType: "abc_analysis",
        duration: "7-10 min",
      }),
      label: "Welcome",
      validate: () => true,
      excludeFromProgress: true,
    },
    {
      id: "activating_event",
      component: createStep(TextInputStep, {
        title: "A — Activating Event",
        subtitle: "What happened? Describe the triggering event.",
        fieldKey: "activatingEvent",
        placeholder: "The event was...",
      }),
      label: "Activating Event",
      validate: (r) => r.activatingEvent.trim().length >= 1,
    },
    {
      id: "belief",
      component: createStep(TextInputStep, {
        title: "B — Belief",
        subtitle: "What did you tell yourself about this event?",
        fieldKey: "belief",
        placeholder: "I thought...",
      }),
      label: "What did you tell yourself?",
      validate: (r) => r.belief.trim().length >= 1,
    },
    {
      id: "consequence",
      component: createStep(TextInputStep, {
        title: "C — Consequence",
        subtitle: "What emotion did you feel and what did you do?",
        fieldKey: "consequenceEmotion",
        placeholder: "I felt...",
      }),
      label: "Consequence (emotion + behavior)",
      validate: (r) => r.consequenceEmotion.trim().length >= 1,
    },
    {
      id: "alternative_belief",
      component: createStep(AITextInputStep, {
        title: "Alternative Belief",
        subtitle: "Write a more balanced belief about the event.",
        fieldKey: "alternativeBelief",
        placeholder: "A more balanced belief would be...",
      }),
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
      component: createStep(TextInputStep, {
        title: "New Consequence",
        subtitle: "With the new belief, how might you feel and act?",
        fieldKey: "newConsequence",
        placeholder: "I would feel...",
      }),
      label: "Predicted new consequence",
      validate: (r) => r.newConsequence.trim().length >= 1,
    },
    {
      id: "summary",
      component: createSummaryStep<ABCAnalysisResponse>(
        [
          { label: "Event", key: "activatingEvent" },
          { label: "Old Belief", key: "belief" },
          { label: "New Belief", key: "alternativeBelief" },
          { label: "New Consequence", key: "newConsequence" },
        ],
        { title: "ABC Complete!", exerciseType: "abc_analysis" },
      ),
      label: "Summary",
      validate: () => true,
      excludeFromProgress: true,
    },
  ],
};
