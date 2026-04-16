import type {
  ExerciseConfig,
  SocraticQuestioningResponse,
} from "@/src/types/exerciseFlow";
import { createStep } from "@/src/components/exercise/steps/createStep";
import { createSummaryStep } from "@/src/components/exercise/steps/createSummaryStep";
import { IntroStep } from "@/src/components/exercise/steps/IntroStep";
import { TextInputStep } from "@/src/components/exercise/steps/TextInputStep";
import { SliderStep } from "@/src/components/exercise/steps/SliderStep";

const INITIAL: SocraticQuestioningResponse = {
  troublingThought: "",
  evidence: "",
  alternativeExplanation: "",
  worstOutcome: "",
  bestOutcome: "",
  mostLikelyOutcome: "",
  friendAdvice: "",
  effectOfThinking: "",
  reratedBelief: 50,
};

export const socraticQuestioningConfig: ExerciseConfig<SocraticQuestioningResponse> =
  {
    type: "socratic_questioning",
    category: "cbt_core",
    title: "Socratic Questioning",
    subtitle: "Question your thoughts like a philosopher",
    icon: "socratic_questioning",
    duration: "7-10 min",
    xp: 15,
    backgroundColor: "#fff",
    schemaVersion: 1,
    initialResponse: INITIAL,

    steps: [
      {
        id: "intro",
        component: createStep(IntroStep, {
          title: "Socratic Questioning",
          subtitle: "Ask yourself powerful questions to examine your thoughts.",
          exerciseType: "socratic_questioning",
          duration: "7-10 min",
        }),
        label: "Welcome",
        validate: () => true,
        excludeFromProgress: true,
      },
      {
        id: "troubling_thought",
        component: createStep(TextInputStep, {
          title: "The Thought",
          subtitle: "What thought is troubling you?",
          fieldKey: "troublingThought",
          placeholder: "The thought that bothers me is...",
        }),
        label: "What thought is troubling you?",
        validate: (r) => r.troublingThought.trim().length >= 1,
      },
      {
        id: "q1_evidence",
        component: createStep(TextInputStep, {
          title: "Evidence",
          subtitle: "What evidence supports this thought?",
          fieldKey: "evidence",
          placeholder: "The evidence is...",
        }),
        label: "What evidence supports this?",
        validate: (r) => r.evidence.trim().length >= 1,
      },
      {
        id: "q2_alternative",
        component: createStep(TextInputStep, {
          title: "Alternative",
          subtitle: "Is there an alternative explanation?",
          fieldKey: "alternativeExplanation",
          placeholder: "Another way to see it...",
        }),
        label: "Is there an alternative explanation?",
        validate: (r) => r.alternativeExplanation.trim().length >= 1,
      },
      {
        id: "q3_outcomes",
        component: createStep(TextInputStep, {
          title: "Outcomes",
          subtitle: "What is the worst, best, and most likely outcome?",
          fieldKey: "worstOutcome",
          placeholder: "Worst: ... Best: ... Most likely: ...",
        }),
        label: "Worst / Best / Most Likely outcomes",
        validate: (r) =>
          r.worstOutcome.trim().length >= 1 &&
          r.bestOutcome.trim().length >= 1 &&
          r.mostLikelyOutcome.trim().length >= 1,
      },
      {
        id: "q4_friend",
        component: createStep(TextInputStep, {
          title: "Friend Advice",
          subtitle: "What would you tell a friend in this situation?",
          fieldKey: "friendAdvice",
          placeholder: "I would tell them...",
        }),
        label: "What would you tell a friend?",
        validate: (r) => r.friendAdvice.trim().length >= 1,
      },
      {
        id: "q5_effect",
        component: createStep(TextInputStep, {
          title: "Effect",
          subtitle: "What is the effect of thinking this way?",
          fieldKey: "effectOfThinking",
          placeholder: "This thinking makes me...",
        }),
        label: "What effect does this thinking have?",
        validate: (r) => r.effectOfThinking.trim().length >= 1,
      },
      {
        id: "rerate_belief",
        component: createStep(SliderStep, {
          title: "Re-rate",
          subtitle: "How much do you believe the original thought now?",
          fieldKey: "reratedBelief",
          min: 0,
          max: 100,
          minLabel: "Not at all",
          maxLabel: "Completely",
          unit: "%",
        }),
        label: "How much do you believe the thought now? (0-100%)",
        validate: () => true,
      },
      {
        id: "summary",
        component: createSummaryStep<SocraticQuestioningResponse>(
          [
            { label: "Thought", key: "troublingThought" },
            { label: "Friend Advice", key: "friendAdvice" },
            { label: "Belief After", key: "reratedBelief" },
          ],
          {
            title: "Questioning complete!",
            exerciseType: "socratic_questioning",
          },
        ),
        label: "Summary",
        validate: () => true,
        excludeFromProgress: true,
      },
    ],
  };
